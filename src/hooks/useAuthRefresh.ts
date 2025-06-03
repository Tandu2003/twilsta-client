import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import TokenManager from '@/lib/token-manager';

import { logout as authLogout, setIsAuthenticated } from '@/store/slices/auth.slice';
import { getCurrentUser, resetUserState } from '@/store/slices/user.slice';
import { useAppDispatch, useAppSelector } from '@/store/store';

export const useAuthRefresh = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    currentUser,
    isLoading: isUserLoading,
    initialLoad,
  } = useAppSelector((state) => state.user);
  const { isAuthenticated, isLoading: isAuthLoading } = useAppSelector((state) => state.auth);

  const checkAndRefreshToken = useCallback(async () => {
    try {
      const result = await dispatch(getCurrentUser());

      if (getCurrentUser.fulfilled.match(result)) {
        dispatch(setIsAuthenticated(true));
        return true;
      } else {
        const refreshSuccess = await TokenManager.refreshToken();

        if (refreshSuccess) {
          const retryResult = await dispatch(getCurrentUser());
          if (getCurrentUser.fulfilled.match(retryResult)) {
            dispatch(setIsAuthenticated(true));
            return true;
          }
        }

        TokenManager.resetState();
        dispatch(resetUserState());
        dispatch(setIsAuthenticated(false));
        router.push('/login');
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);

      const refreshSuccess = await TokenManager.refreshToken();
      if (refreshSuccess) {
        const retryResult = await dispatch(getCurrentUser());
        if (getCurrentUser.fulfilled.match(retryResult)) {
          dispatch(setIsAuthenticated(true));
          return true;
        }
      }

      TokenManager.resetState();
      dispatch(resetUserState());
      dispatch(setIsAuthenticated(false));
      router.push('/login');
      return false;
    }
  }, [dispatch, router]);

  const logout = useCallback(async () => {
    try {
      await dispatch(authLogout());
    } catch (error) {
      console.error('Logout error:', error);

      dispatch(resetUserState());
      dispatch(setIsAuthenticated(false));
    } finally {
      TokenManager.resetState();
      router.push('/login');
    }
  }, [dispatch, router]);

  useEffect(() => {
    if (!initialLoad) {
      checkAndRefreshToken();
      return;
    }

    const interval = setInterval(
      () => {
        if (isAuthenticated) {
          checkAndRefreshToken();
        }
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [checkAndRefreshToken, initialLoad, isAuthenticated]);

  return {
    currentUser,
    isAuthenticated,
    isLoading: isUserLoading || isAuthLoading,
    checkAndRefreshToken,
    logout,
    isRefreshing: TokenManager.isCurrentlyRefreshing(),
  };
};
