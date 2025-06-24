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
    try {
      const res = await api.post<ApiResponse<LoginResponse>>('/auth/login', data);
      if (res.data.success && res.data.data) {
        store.dispatch(setCredentials(res.data.data));
      }
      return res.data;
    } catch (error: any) {
      // Không tự động refresh cho login endpoint
      throw error;
    }
  },
  async register(data: RegisterRequest) {
    try {
      const res = await api.post<ApiResponse<RegisterResponse>>('/auth/register', data);
      if (res.data.success && res.data.data) {
        store.dispatch(setCredentials(res.data.data));
      }
      return res.data;
    } catch (error: any) {
      // Không tự động refresh cho register endpoint
      throw error;
    }
  },
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error: any) {
      // Vẫn logout ở client ngay cả khi server call fail
      console.warn('Logout API call failed, but proceeding with client logout:', error.message);
    } finally {
      store.dispatch(logoutAction());
    }
  },
  async refresh() {
    try {
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
    } catch (error: any) {
      // Refresh failed - logout user
      store.dispatch(logoutAction());
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw error;
    }
  },
  async getMe() {
    // API interceptor sẽ tự động handle refresh nếu cần
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },
  async resendVerification(email: string) {
    // Không cần refresh cho endpoint này
    const res = await api.post<ApiResponse<null>>('/auth/resend-verification', { email });
    return res.data;
  },
  async verifyEmail(token: string) {
    // Không cần refresh cho endpoint này
    const res = await api.get<ApiResponse<null>>(`/auth/verify/${token}`);
    return res.data;
  },
  async requestPasswordReset(email: string) {
    // Không cần refresh cho endpoint này
    const res = await api.post<ApiResponse<null>>('/auth/reset-password-request', { email });
    return res.data;
  },
  async resetPassword(token: string, password: string) {
    // Không cần refresh cho endpoint này
    const res = await api.post<ApiResponse<null>>(`/auth/reset-password/${token}`, { password });
    return res.data;
  },
  async updateActivity() {
    // API interceptor sẽ tự động handle refresh nếu cần
    const res = await api.post<ApiResponse<null>>('/auth/update-activity');
    return res.data;
  },
  async getActiveTokens() {
    // API interceptor sẽ tự động handle refresh nếu cần
    const res = await api.get<ApiResponse<{ activeTokens: any[] }>>('/auth/active-tokens');
    return res.data;
  },
  async logoutAllDevices() {
    try {
      const res = await api.post<ApiResponse<null>>('/auth/logout-all');
      return res.data;
    } catch (error: any) {
      // Vẫn logout ở client ngay cả khi server call fail
      console.warn(
        'Logout all devices API call failed, but proceeding with client logout:',
        error.message,
      );
      throw error;
    } finally {
      store.dispatch(logoutAction());
    }
  },
};
