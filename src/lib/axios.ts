import axios from 'axios';

import TokenManager from './token-manager';

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add response interceptor to handle auto refresh token
apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra nếu lỗi 401 và chưa retry lần nào
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Tránh refresh token cho endpoint refresh-token để tránh vòng lặp
      if (
        originalRequest.url?.includes('/auth/refresh-token') ||
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register')
      ) {
        return Promise.reject(error);
      }

      // Kiểm tra xem có nên thử refresh không
      if (!TokenManager.shouldRefresh(error)) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Sử dụng TokenManager để refresh token
        const refreshSuccess = await TokenManager.refreshToken();

        if (refreshSuccess) {
          // Retry original request
          return apiInstance(originalRequest);
        } else {
          // Refresh thất bại, redirect về login
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        // Refresh token thất bại - TokenManager sẽ handle redirect
        console.error('Auto refresh failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    // Xử lý các lỗi khác
    if (error.response?.data) {
      const errorData = error.response.data as { message: string };
      error.message = errorData.message || error.message;
    }

    return Promise.reject(error);
  },
);

export default apiInstance;
