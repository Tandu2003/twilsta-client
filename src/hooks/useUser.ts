import { useCallback } from 'react';

import {
  changePassword,
  clearError,
  clearSearchError,
  clearSearchResults,
  deleteAccount,
  getCurrentUser,
  searchUsers,
  updateAvatar,
  updateCurrentUser,
  updateProfile,
} from '@/store/slices/user.slice';
import { useAppDispatch, useAppSelector } from '@/store/store';

import { ChangePasswordRequest, UpdateProfileRequest, UserSearchQuery } from '@/types';

export const useUser = () => {
  const dispatch = useAppDispatch();

  const {
    currentUser,
    searchResults,
    isLoading,
    isUpdating,
    isSearching,
    error,
    searchError,
    initialLoad,
  } = useAppSelector((state) => state.user);

  // User data operations
  const fetchCurrentUser = useCallback(async () => {
    const result = await dispatch(getCurrentUser());
    return getCurrentUser.fulfilled.match(result);
  }, [dispatch]);

  const updateUserProfile = useCallback(
    async (data: UpdateProfileRequest) => {
      const result = await dispatch(updateProfile(data));
      return updateProfile.fulfilled.match(result);
    },
    [dispatch],
  );

  const updateUserPassword = useCallback(
    async (data: ChangePasswordRequest) => {
      const result = await dispatch(changePassword(data));
      return changePassword.fulfilled.match(result);
    },
    [dispatch],
  );

  const updateUserAvatar = useCallback(
    async (file: File) => {
      const result = await dispatch(updateAvatar(file));
      return updateAvatar.fulfilled.match(result);
    },
    [dispatch],
  );

  const removeAccount = useCallback(async () => {
    const result = await dispatch(deleteAccount());
    return deleteAccount.fulfilled.match(result);
  }, [dispatch]);

  const findUsers = useCallback(
    async (query: UserSearchQuery) => {
      const result = await dispatch(searchUsers(query));
      return searchUsers.fulfilled.match(result);
    },
    [dispatch],
  );

  // State management
  const clearUserError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearUserSearchError = useCallback(() => {
    dispatch(clearSearchError());
  }, [dispatch]);

  const clearUserSearchResults = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  const updateUser = useCallback(
    (updates: Partial<typeof currentUser>) => {
      dispatch(updateCurrentUser(updates));
    },
    [dispatch],
  );

  // Computed values
  const hasUser = Boolean(currentUser);
  const isUserVerified = currentUser?.isVerified ?? false;
  const isUserPrivate = currentUser?.isPrivate ?? false;
  const userFullName = currentUser?.fullName || '';
  const userBio = currentUser?.bio || '';
  const userAvatar = currentUser?.avatar;
  const userWebsite = currentUser?.website || '';

  return {
    // State
    currentUser,
    searchResults,
    isLoading,
    isUpdating,
    isSearching,
    error,
    searchError,
    initialLoad,

    // Computed
    hasUser,
    isUserVerified,
    isUserPrivate,
    userFullName,
    userBio,
    userAvatar,
    userWebsite,

    // Actions
    fetchCurrentUser,
    updateUserProfile,
    updateUserPassword,
    updateUserAvatar,
    removeAccount,
    findUsers,
    clearUserError,
    clearUserSearchError,
    clearUserSearchResults,
    updateUser,
  };
};
