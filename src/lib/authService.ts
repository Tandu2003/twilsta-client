import { api } from './api';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ApiResponse,
  User,
} from '@/types';
import { setCredentials, logout as logoutAction } from '@/slices/authSlice';
import { store } from './store';

export const authService = {
  async login(data: LoginRequest) {
    const res = await api.post<ApiResponse<LoginResponse>>('/auth/login', data);
    if (res.data.success && res.data.data) {
      store.dispatch(setCredentials(res.data.data));
    }
    return res.data;
  },
  async register(data: RegisterRequest) {
    const res = await api.post<ApiResponse<RegisterResponse>>('/auth/register', data);
    if (res.data.success && res.data.data) {
      store.dispatch(setCredentials(res.data.data));
    }
    return res.data;
  },
  async logout() {
    await api.post('/auth/logout');
    store.dispatch(logoutAction());
  },
  async refresh() {
    const res = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');
    if (res.data.success && res.data.data) {
      store.dispatch(
        setCredentials({
          user: store.getState().auth.user as User,
          accessToken: res.data.data.accessToken,
        }),
      );
    }
    return res.data;
  },
  async getMe() {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },
  async resendVerification(email: string) {
    const res = await api.post<ApiResponse<null>>('/auth/resend-verification', { email });
    return res.data;
  },
  async verifyEmail(token: string) {
    const res = await api.get<ApiResponse<null>>(`/auth/verify/${token}`);
    return res.data;
  },
  async requestPasswordReset(email: string) {
    const res = await api.post<ApiResponse<null>>('/auth/reset-password-request', { email });
    return res.data;
  },
  async resetPassword(token: string, password: string) {
    const res = await api.post<ApiResponse<null>>(`/auth/reset-password/${token}`, { password });
    return res.data;
  },
  async updateActivity() {
    const res = await api.post<ApiResponse<null>>('/auth/update-activity');
    return res.data;
  },
  async getActiveTokens() {
    const res = await api.get<ApiResponse<{ activeTokens: any[] }>>('/auth/active-tokens');
    return res.data;
  },
  async logoutAllDevices() {
    const res = await api.post<ApiResponse<null>>('/auth/logout-all');
    store.dispatch(logoutAction());
    return res.data;
  },
};
