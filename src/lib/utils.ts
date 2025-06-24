import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Xác định xem có nên tự động refresh token không dựa trên error response
 */
export function shouldAutoRefresh(error: any, url?: string): boolean {
  // Không phải lỗi 401
  if (error?.response?.status !== 401) {
    return false;
  }

  // Danh sách endpoints không nên auto refresh
  const noAutoRefreshEndpoints = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh',
    '/auth/logout',
    '/auth/verify/',
    '/auth/resend-verification',
    '/auth/reset-password',
    '/auth/reset-password-request',
  ];

  // Kiểm tra URL
  if (url) {
    const shouldSkip = noAutoRefreshEndpoints.some((endpoint) => url.includes(endpoint));
    if (shouldSkip) {
      return false;
    }
  }

  // Kiểm tra error message để xác định loại lỗi
  const errorMessage = error?.response?.data?.message?.toLowerCase() || '';

  // Những cases không nên refresh:
  const noRefreshMessages = [
    'email verification required',
    'invalid credentials',
    'user not found',
    'email already verified',
    'verification token',
    'password reset',
    'invalid refresh token',
    'refresh token not found',
  ];

  const shouldSkipByMessage = noRefreshMessages.some((msg) => errorMessage.includes(msg));

  return !shouldSkipByMessage;
}

/**
 * Xác định loại lỗi auth để xử lý phù hợp
 */
export function getAuthErrorType(
  error: any,
): 'token_expired' | 'invalid_credentials' | 'verification_required' | 'token_invalid' | 'other' {
  const errorMessage = error?.response?.data?.message?.toLowerCase() || '';

  if (errorMessage.includes('expired')) {
    return 'token_expired';
  }

  if (errorMessage.includes('invalid credentials')) {
    return 'invalid_credentials';
  }

  if (errorMessage.includes('verification required') || errorMessage.includes('verify')) {
    return 'verification_required';
  }

  if (errorMessage.includes('invalid') && errorMessage.includes('token')) {
    return 'token_invalid';
  }

  return 'other';
}

/**
 * Helper để log auth errors một cách structured
 */
export function logAuthError(error: any, context: string = ''): void {
  const errorType = getAuthErrorType(error);
  const shouldRefresh = shouldAutoRefresh(error);

  console.log(`Auth Error [${context}]:`, {
    status: error?.response?.status,
    message: error?.response?.data?.message,
    errorType,
    shouldRefresh,
    url: error?.config?.url,
  });
}
