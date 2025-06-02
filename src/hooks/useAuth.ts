import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { clearError, getMe, login, logout, register, resetState } from '@/store/slices/auth.slice';
import { AppDispatch, RootState } from '@/store/store';

import authService from '@/services/auth.service';

import {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from '@/types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error, initialLoad } = useSelector(
    (state: RootState) => state.auth,
  );

  const handleLogin = useCallback(
    async (credentials: LoginRequest) => {
      try {
        const result = await dispatch(login(credentials)).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleRegister = useCallback(
    async (data: RegisterRequest) => {
      try {
        const result = await dispatch(register(data)).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(resetState());
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const handleGetMe = useCallback(async () => {
    try {
      const result = await dispatch(getMe()).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const handleForgotPassword = useCallback(async (data: ForgotPasswordRequest) => {
    try {
      const result = await authService.forgotPassword(data);
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  const handleResetPassword = useCallback(async (data: ResetPasswordRequest) => {
    try {
      const result = await authService.resetPassword(data);
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  const handleVerifyEmail = useCallback(async (data: VerifyEmailRequest) => {
    try {
      const result = await authService.verifyEmail(data);
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    initialLoad,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    getMe: handleGetMe,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    verifyEmail: handleVerifyEmail,
    clearError: handleClearError,
  };
};
