import { useCallback, useEffect } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { authService } from '@/lib/authService';
import { logout } from '@/slices/authSlice';
import { shouldAutoRefresh, getAuthErrorType, logAuthError } from '@/lib/utils';
import type { RootState } from '@/lib/store';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, accessToken, isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  // Function để handle auth errors
  const handleAuthError = useCallback(
    (error: any, context: string = '') => {
      logAuthError(error, context);

      const errorType = getAuthErrorType(error);

      // Handle theo loại error
      switch (errorType) {
        case 'verification_required':
          // Redirect to verification page
          if (typeof window !== 'undefined') {
            window.location.href = '/verify-email';
          }
          break;

        case 'invalid_credentials':
          // Clear auth state và redirect to login
          dispatch(logout());
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          break;

        case 'token_expired':
        case 'token_invalid':
          // Sẽ được handle bởi axios interceptor
          break;

        default:
          // Log error for debugging
          console.warn('Unhandled auth error:', error);
      }
    },
    [dispatch],
  );

  // Function để manually trigger refresh
  const refreshToken = useCallback(async () => {
    try {
      await authService.refresh();
      return true;
    } catch (error) {
      handleAuthError(error, 'Manual refresh');
      return false;
    }
  }, [handleAuthError]);

  // Function để check if token is about to expire
  const isTokenExpiring = useCallback(() => {
    if (!accessToken) return false;

    try {
      // Decode JWT để check expiration (chỉ cần check payload, không verify)
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = payload.exp - currentTime;

      // Return true if token expires trong 5 phút
      return timeUntilExpiry < 300; // 5 minutes
    } catch (error) {
      console.warn('Error checking token expiration:', error);
      return true; // Assume expiring if can't parse
    }
  }, [accessToken]);

  // Auto refresh if token is expiring
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    const checkAndRefresh = async () => {
      if (isTokenExpiring()) {
        console.log('Token is expiring soon, refreshing...');
        await refreshToken();
      }
    };

    // Check every 2 minutes
    const interval = setInterval(checkAndRefresh, 2 * 60 * 1000);

    // Check immediately
    checkAndRefresh();

    return () => clearInterval(interval);
  }, [isAuthenticated, accessToken, isTokenExpiring, refreshToken]);

  return {
    user,
    accessToken,
    isAuthenticated,
    isTokenExpiring: isTokenExpiring(),
    refreshToken,
    handleAuthError,
    logout: () => dispatch(logout()),
  };
}
