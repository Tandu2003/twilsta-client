import { ApiResponse, User } from '.';

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationEmailRequest {
  email: string;
}

export interface CheckUsernameRequest {
  username: string;
}

export interface GetMeResponse extends ApiResponse<User> {}
export interface LoginResponse extends ApiResponse<User> {}
export interface RegisterResponse extends ApiResponse<User> {}
export interface LogoutResponse extends ApiResponse<void> {}
export interface ForgotPasswordResponse extends ApiResponse<void> {}
export interface ResetPasswordResponse extends ApiResponse<void> {}
export interface UpdatePasswordResponse extends ApiResponse<void> {}
export interface VerifyEmailResponse extends ApiResponse<void> {}
export interface ResendVerificationEmailResponse extends ApiResponse<void> {}
export interface CheckUsernameResponse extends ApiResponse<void> {}
