import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  acceptFollowRequest,
  clearError,
  clearFollowStatus,
  clearFollowersAndFollowing,
  followUser,
  getFollowRequests,
  getFollowStatus,
  getFollowers,
  getFollowing,
  rejectFollowRequest,
  resetFollowState,
  unfollowUser,
} from '@/store/slices/follow.slice';
import { AppDispatch, RootState } from '@/store/store';

import { PaginationQuery } from '@/types';

export const useFollow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, followStatus, followers, following, followRequests } = useSelector(
    (state: RootState) => state.follow,
  );

  // Follow a user
  const handleFollowUser = useCallback(
    async (targetUserId: string) => {
      try {
        const result = await dispatch(followUser(targetUserId)).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  // Unfollow a user
  const handleUnfollowUser = useCallback(
    async (targetUserId: string) => {
      try {
        const result = await dispatch(unfollowUser(targetUserId)).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  // Get follow status with another user
  const handleGetFollowStatus = useCallback(
    async (userId: string) => {
      try {
        const result = await dispatch(getFollowStatus(userId)).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  // Get followers list
  const handleGetFollowers = useCallback(
    async (userId: string, pagination?: PaginationQuery) => {
      try {
        const result = await dispatch(getFollowers({ userId, pagination })).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  // Get following list
  const handleGetFollowing = useCallback(
    async (userId: string, pagination?: PaginationQuery) => {
      try {
        const result = await dispatch(getFollowing({ userId, pagination })).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  // Get follow requests
  const handleGetFollowRequests = useCallback(async () => {
    try {
      const result = await dispatch(getFollowRequests()).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  // Accept follow request
  const handleAcceptFollowRequest = useCallback(
    async (followId: string) => {
      try {
        const result = await dispatch(acceptFollowRequest(followId)).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  // Reject follow request
  const handleRejectFollowRequest = useCallback(
    async (followId: string) => {
      try {
        const result = await dispatch(rejectFollowRequest(followId)).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  // Clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Clear follow status
  const handleClearFollowStatus = useCallback(
    (userId?: string) => {
      dispatch(clearFollowStatus(userId));
    },
    [dispatch],
  );

  // Clear followers and following
  const handleClearFollowersAndFollowing = useCallback(
    (userId?: string) => {
      dispatch(clearFollowersAndFollowing(userId));
    },
    [dispatch],
  );

  // Reset follow state
  const handleResetFollowState = useCallback(() => {
    dispatch(resetFollowState());
  }, [dispatch]);

  // Helper functions to get specific data
  const getFollowStatusForUser = useCallback(
    (userId: string) => {
      return (
        followStatus[userId] || {
          isFollowing: false,
          isPending: false,
          canFollow: true,
        }
      );
    },
    [followStatus],
  );

  const getFollowersForUser = useCallback(
    (userId: string) => {
      return followers[userId];
    },
    [followers],
  );

  const getFollowingForUser = useCallback(
    (userId: string) => {
      return following[userId];
    },
    [following],
  );

  return {
    // State
    isLoading,
    error,
    followRequests,

    // Actions
    followUser: handleFollowUser,
    unfollowUser: handleUnfollowUser,
    getFollowStatus: handleGetFollowStatus,
    getFollowers: handleGetFollowers,
    getFollowing: handleGetFollowing,
    getFollowRequests: handleGetFollowRequests,
    acceptFollowRequest: handleAcceptFollowRequest,
    rejectFollowRequest: handleRejectFollowRequest,

    // Utility actions
    clearError: handleClearError,
    clearFollowStatus: handleClearFollowStatus,
    clearFollowersAndFollowing: handleClearFollowersAndFollowing,
    resetFollowState: handleResetFollowState,

    // Helper functions
    getFollowStatusForUser,
    getFollowersForUser,
    getFollowingForUser,
  };
};
