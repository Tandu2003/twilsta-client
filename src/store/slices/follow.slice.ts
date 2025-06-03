import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import followService from '@/services/follow.service';

import {
  AcceptFollowRequestResponse,
  FollowRequestResponse,
  FollowStatus,
  FollowStatusResponse,
  FollowUserResponse,
  FollowUsersResponse,
  PaginationQuery,
  RejectFollowRequestResponse,
  UnfollowUserResponse,
} from '@/types';

interface FollowState {
  isLoading: boolean;
  error: string | null;
  followStatus: Record<string, FollowStatusResponse>; // userId -> status
  followers: Record<string, FollowUsersResponse>; // userId -> followers
  following: Record<string, FollowUsersResponse>; // userId -> following
  followRequests: FollowRequestResponse[];
}

const initialState: FollowState = {
  isLoading: false,
  error: null,
  followStatus: {},
  followers: {},
  following: {},
  followRequests: [],
};

// Async thunks
export const followUser = createAsyncThunk(
  'follow/followUser',
  async (targetUserId: string, { rejectWithValue }) => {
    try {
      const response = await followService.followUser(targetUserId);
      return { targetUserId, response };
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to follow user',
      );
    }
  },
);

export const unfollowUser = createAsyncThunk(
  'follow/unfollowUser',
  async (targetUserId: string, { rejectWithValue }) => {
    try {
      const response = await followService.unfollowUser(targetUserId);
      return { targetUserId, response };
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to unfollow user',
      );
    }
  },
);

export const getFollowStatus = createAsyncThunk(
  'follow/getFollowStatus',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await followService.getFollowStatus(userId);
      return { userId, response };
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to get follow status',
      );
    }
  },
);

export const getFollowers = createAsyncThunk(
  'follow/getFollowers',
  async (
    { userId, pagination }: { userId: string; pagination?: PaginationQuery },
    { rejectWithValue },
  ) => {
    try {
      const response = await followService.getFollowers(userId, pagination);
      return { userId, response, isRefresh: !pagination?.cursor };
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to get followers',
      );
    }
  },
);

export const getFollowing = createAsyncThunk(
  'follow/getFollowing',
  async (
    { userId, pagination }: { userId: string; pagination?: PaginationQuery },
    { rejectWithValue },
  ) => {
    try {
      const response = await followService.getFollowing(userId, pagination);
      return { userId, response, isRefresh: !pagination?.cursor };
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to get following',
      );
    }
  },
);

export const getFollowRequests = createAsyncThunk(
  'follow/getFollowRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await followService.getFollowRequests();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to get follow requests',
      );
    }
  },
);

export const acceptFollowRequest = createAsyncThunk(
  'follow/acceptFollowRequest',
  async (followId: string, { rejectWithValue }) => {
    try {
      const response = await followService.acceptFollowRequest(followId);
      return { followId, response };
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to accept follow request',
      );
    }
  },
);

export const rejectFollowRequest = createAsyncThunk(
  'follow/rejectFollowRequest',
  async (followId: string, { rejectWithValue }) => {
    try {
      const response = await followService.rejectFollowRequest(followId);
      return { followId, response };
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to reject follow request',
      );
    }
  },
);

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearFollowStatus: (state, action) => {
      if (action.payload) {
        delete state.followStatus[action.payload];
      } else {
        state.followStatus = {};
      }
    },
    clearFollowersAndFollowing: (state, action) => {
      if (action.payload) {
        delete state.followers[action.payload];
        delete state.following[action.payload];
      } else {
        state.followers = {};
        state.following = {};
      }
    },
    resetFollowState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Follow User
      .addCase(followUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const { targetUserId, response } = action.payload;

        // Update follow status
        state.followStatus[targetUserId] = {
          isFollowing: response.status === FollowStatus.ACCEPTED,
          isPending: response.status === FollowStatus.PENDING,
          canFollow: false,
        };
      })
      .addCase(followUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Unfollow User
      .addCase(unfollowUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const { targetUserId } = action.payload;

        // Update follow status
        state.followStatus[targetUserId] = {
          isFollowing: false,
          isPending: false,
          canFollow: true,
        };
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Get Follow Status
      .addCase(getFollowStatus.fulfilled, (state, action) => {
        const { userId, response } = action.payload;
        state.followStatus[userId] = response;
      })

      // Get Followers
      .addCase(getFollowers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFollowers.fulfilled, (state, action) => {
        state.isLoading = false;
        const { userId, response, isRefresh } = action.payload;

        if (isRefresh) {
          state.followers[userId] = response;
        } else {
          // Append to existing users (pagination)
          const existing = state.followers[userId];
          if (existing) {
            state.followers[userId] = {
              ...response,
              users: [...existing.users, ...response.users],
            };
          } else {
            state.followers[userId] = response;
          }
        }
      })
      .addCase(getFollowers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Get Following
      .addCase(getFollowing.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFollowing.fulfilled, (state, action) => {
        state.isLoading = false;
        const { userId, response, isRefresh } = action.payload;

        if (isRefresh) {
          state.following[userId] = response;
        } else {
          // Append to existing users (pagination)
          const existing = state.following[userId];
          if (existing) {
            state.following[userId] = {
              ...response,
              users: [...existing.users, ...response.users],
            };
          } else {
            state.following[userId] = response;
          }
        }
      })
      .addCase(getFollowing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Get Follow Requests
      .addCase(getFollowRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFollowRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.followRequests = action.payload;
      })
      .addCase(getFollowRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Accept Follow Request
      .addCase(acceptFollowRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(acceptFollowRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        const { followId } = action.payload;

        // Remove from follow requests
        state.followRequests = state.followRequests.filter((req) => req.id !== followId);
      })
      .addCase(acceptFollowRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Reject Follow Request
      .addCase(rejectFollowRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rejectFollowRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        const { followId } = action.payload;

        // Remove from follow requests
        state.followRequests = state.followRequests.filter((req) => req.id !== followId);
      })
      .addCase(rejectFollowRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearFollowStatus, clearFollowersAndFollowing, resetFollowState } =
  followSlice.actions;

export default followSlice.reducer;
