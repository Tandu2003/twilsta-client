import apiInstance from '@/lib/axios';

import {
  CheckUsernameRequest,
  CheckUsernameResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  GetMeResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationEmailRequest,
  ResendVerificationEmailResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from '@/types';

const authService = {
  getMe: async (): Promise<GetMeResponse> => {
    const response = await apiInstance.get<GetMeResponse>('/auth/me');
    return response.data;
  },

  login: async ({ emailOrUsername, password }: LoginRequest): Promise<LoginResponse> => {
    const response = await apiInstance.post<LoginResponse>('/auth/login', {
      emailOrUsername,
      password,
    });
    return response.data;
  },

  register: async ({
    fullName,
    username,
    email,
    password,
  }: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiInstance.post<RegisterResponse>('/auth/register', {
      fullName,
      username,
      email,
      password,
    });
    return response.data;
  },

  logout: async (): Promise<LogoutResponse> => {
    const response = await apiInstance.post<LogoutResponse>('/auth/logout');
    return response.data;
  },

  forgotPassword: async ({ email }: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    const response = await apiInstance.post<ForgotPasswordResponse>('/auth/forgot-password', {
      email,
    });
    return response.data;
  },

  resetPassword: async ({
    token,
    password,
  }: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await apiInstance.post<ResetPasswordResponse>('/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  },

  updatePassword: async ({
    oldPassword,
    newPassword,
  }: UpdatePasswordRequest): Promise<UpdatePasswordResponse> => {
    const response = await apiInstance.post<UpdatePasswordResponse>('/auth/update-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  verifyEmail: async ({ token }: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
    const response = await apiInstance.post<VerifyEmailResponse>('/auth/verify-email', {
      token,
    });
    return response.data;
  },

  resendVerificationEmail: async ({
    email,
  }: ResendVerificationEmailRequest): Promise<ResendVerificationEmailResponse> => {
    const response = await apiInstance.post<ResendVerificationEmailResponse>(
      '/auth/send-verification-email',
      {
        email,
      },
    );
    return response.data;
  },

  checkUsername: async ({ username }: CheckUsernameRequest): Promise<CheckUsernameResponse> => {
    const response = await apiInstance.post<CheckUsernameResponse>('/auth/check-username', {
      username,
    });
    return response.data;
  },

  checkAuth: async (): Promise<{ isValid: boolean; message: string }> => {
    const response = await apiInstance.post<{ isValid: boolean; message: string }>(
      '/auth/check-auth',
    );
    return response.data;
  },

  refreshToken: async (): Promise<{ message: string }> => {
    const response = await apiInstance.post<{ message: string }>('/auth/refresh-token');
    return response.data;
  },
};

export default authService;
