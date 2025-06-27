import axios from 'axios';
import type { LoginRequest, LoginResponse, ApiResponse } from '@/types/server-contract';
import { store } from './store';
import { setCredentials, logout } from '@/slices/authSlice';
import { shouldAutoRefresh, logAuthError } from './utils';

// Tạo axios instance
export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api` || 'http://localhost:5000/api',
  withCredentials: true, // Để gửi cookie httpOnly
});

// Flag để tránh nhiều refresh requests đồng thời
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Helper function to check if token is expiring soon
const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = payload.exp - currentTime;
    return timeUntilExpiry < 60; // 1 minute
  } catch (error) {
    return false;
  }
};

// Interceptor để tự động thêm accessToken vào header nếu có
api.interceptors.request.use(async (config) => {
  const state = store.getState();
  const token = state.auth.accessToken;

  if (token) {
    // Check if token is expiring soon and proactively refresh
    if (isTokenExpiringSoon(token) && !isRefreshing) {
      try {
        isRefreshing = true;
        const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');

        if (response.data.success && response.data.data) {
          store.dispatch(
            setCredentials({
              user: state.auth.user!,
              accessToken: response.data.data.accessToken,
            }),
          );
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${response.data.data.accessToken}`;
        }
      } catch (error) {
        // Refresh failed - will be handled by response interceptor
        console.warn('Proactive refresh failed:', error);
      } finally {
        isRefreshing = false;
      }
    } else {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return config;
});

// Response interceptor để handle auto refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Log lỗi để debug
    logAuthError(error, `API Request: ${originalRequest?.url}`);

    // Chỉ xử lý lỗi 401 và chỉ khi chưa retry
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Sử dụng utility function để kiểm tra có nên auto refresh không
    if (!shouldAutoRefresh(error, originalRequest.url)) {
      console.log('Skipping auto refresh based on error analysis');
      return Promise.reject(error);
    }

    // Kiểm tra xem có access token không
    const currentState = store.getState();
    if (!currentState.auth.accessToken) {
      console.log('No access token found, skipping refresh');
      return Promise.reject(error);
    }

    // Nếu đang refresh, thêm vào queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Gọi refresh token
      const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');

      if (response.data.success && response.data.data) {
        const newAccessToken = response.data.data.accessToken;

        // Cập nhật token trong store
        store.dispatch(
          setCredentials({
            user: currentState.auth.user!,
            accessToken: newAccessToken,
          }),
        );

        // Process queue với token mới
        processQueue(null, newAccessToken);

        // Retry original request với token mới
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } else {
        throw new Error('Refresh failed');
      }
    } catch (refreshError: any) {
      // Refresh thất bại - logout user
      processQueue(refreshError, null);
      store.dispatch(logout());

      // Chỉ redirect về login nếu không phải server-side
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// Hàm login
export async function login(data: LoginRequest) {
  const res = await api.post<ApiResponse<LoginResponse>>('/auth/login', data);
  if (res.data.success && res.data.data) {
    store.dispatch(setCredentials(res.data.data));
  }
  return res.data;
}

// Hàm logout
export async function logoutUser() {
  await api.post('/auth/logout');
  store.dispatch(logout());
}
