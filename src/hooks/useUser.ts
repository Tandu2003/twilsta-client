import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import userService from '@/services/user.service';

import {
  ChangePasswordRequest,
  FollowListQuery,
  FollowListResponse,
  UpdateProfileRequest,
  User,
  UserSearchQuery,
  UserSearchResponse,
  UserStats,
} from '@/types';

export const useUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Get user by ID
  const getUserById = useCallback(async (userId: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.getUserById(userId);
      return response.data || null;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to get user';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get user by username
  const getUserByUsername = useCallback(async (username: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.getUserByUsername(username);
      return response.data || null;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to get user';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get current user profile
  const getCurrentUser = useCallback(async (): Promise<User | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.getCurrentUser();
      return response.data || null;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to get current user';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (data: UpdateProfileRequest): Promise<User | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.updateProfile(data);
      toast.success(response.data?.message || 'Profile updated successfully');
      return response.data?.user || null;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (data: ChangePasswordRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.changePassword(data);
      toast.success(response.data?.message || 'Password changed successfully');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update avatar
  const updateAvatar = useCallback(async (file: File): Promise<User | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.updateAvatar(file);
      toast.success(response.data?.message || 'Avatar updated successfully');
      return response.data?.user || null;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update avatar';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete account
  const deleteAccount = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.deleteAccount();
      toast.success(response.data?.message || 'Account deleted successfully');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete account';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search users
  const searchUsers = useCallback(
    async (query: UserSearchQuery = {}): Promise<UserSearchResponse | null> => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await userService.searchUsers(query);
        return response.data || null;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to search users';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Get user stats
  const getUserStats = useCallback(async (userId: string): Promise<UserStats | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.getUserStats(userId);
      return response.data || null;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to get user stats';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get followers
  const getFollowers = useCallback(
    async (userId: string, query: FollowListQuery = {}): Promise<FollowListResponse | null> => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await userService.getFollowers(userId, query);
        return response.data || null;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to get followers';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Get following
  const getFollowing = useCallback(
    async (userId: string, query: FollowListQuery = {}): Promise<FollowListResponse | null> => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await userService.getFollowing(userId, query);
        return response.data || null;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to get following';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    isLoading,
    error,
    clearError,
    getUserById,
    getUserByUsername,
    getCurrentUser,
    updateProfile,
    changePassword,
    updateAvatar,
    deleteAccount,
    searchUsers,
    getUserStats,
    getFollowers,
    getFollowing,
  };
};
