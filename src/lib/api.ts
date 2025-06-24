import axios from 'axios';
import type { LoginRequest, LoginResponse, ApiResponse } from '@/types/server-contract';
import { store } from './store';
import { setCredentials, logout } from '@/slices/authSlice';

// Tạo axios instance
export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api` || 'http://localhost:5000/api',
  withCredentials: true, // Để gửi cookie httpOnly
});

// Interceptor để tự động thêm accessToken vào header nếu có
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.accessToken;
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

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
