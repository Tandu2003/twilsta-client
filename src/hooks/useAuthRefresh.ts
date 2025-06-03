import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import TokenManager from '@/lib/token-manager';

import authService from '@/services/auth.service';

export const useAuthRefresh = () => {
  const router = useRouter();

  const checkAndRefreshToken = useCallback(async () => {
    try {
      // Kiểm tra token hiện tại
      const authCheck = await authService.checkAuth();

      if (!authCheck.isValid) {
        // Nếu token không hợp lệ, thử refresh
        const refreshSuccess = await TokenManager.refreshToken();

        if (!refreshSuccess) {
          // Refresh thất bại, redirect về login
          TokenManager.resetState();
          router.push('/login');
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Auth check failed:', error);

      // Nếu lỗi 401, thử refresh token
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError?.response?.status === 401) {
          const refreshSuccess = await TokenManager.refreshToken();
          if (!refreshSuccess) {
            router.push('/login');
            return false;
          }
          return true;
        }
      }

      return false;
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      TokenManager.resetState();
      router.push('/login');
    }
  }, [router]);

  // Auto check token validity on mount and periodically
  useEffect(() => {
    const interval = setInterval(
      () => {
        checkAndRefreshToken();
      },
      5 * 60 * 1000,
    ); // Check every 5 minutes

    // Initial check
    checkAndRefreshToken();

    return () => clearInterval(interval);
  }, [checkAndRefreshToken]);

  return {
    checkAndRefreshToken,
    logout,
    isRefreshing: TokenManager.isCurrentlyRefreshing(),
  };
};
