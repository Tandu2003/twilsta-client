import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import userService from '@/services/user.service';

import {
  ChangePasswordRequest,
  UpdateProfileRequest,
  User,
  UserSearchQuery,
  UserSearchResponse,
} from '@/types';

interface UserState {
  currentUser: User | null;
  searchResults: UserSearchResponse | null;
  isLoading: boolean;
  isUpdating: boolean;
  isSearching: boolean;
  error: string | null;
  searchError: string | null;
  initialLoad: boolean;
}

const initialState: UserState = {
  currentUser: null,
  searchResults: null,
  isLoading: false,
  isUpdating: false,
  isSearching: false,
  error: null,
  searchError: null,
  initialLoad: false,
};

// Async thunks
export const getCurrentUser = createAsyncThunk(
  'user/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getCurrentUser();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to fetch current user',
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: UpdateProfileRequest, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfile(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to update profile',
      );
    }
  },
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (data: ChangePasswordRequest, { rejectWithValue }) => {
    try {
      const response = await userService.changePassword(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to change password',
      );
    }
  },
);

export const updateAvatar = createAsyncThunk(
  'user/updateAvatar',
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await userService.updateAvatar(file);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to update avatar',
      );
    }
  },
);

export const deleteAccount = createAsyncThunk(
  'user/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.deleteAccount();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to delete account',
      );
    }
  },
);

export const searchUsers = createAsyncThunk(
  'user/searchUsers',
  async (query: UserSearchQuery, { rejectWithValue }) => {
    try {
      const response = await userService.searchUsers(query);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to search users',
      );
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    updateCurrentUser: (state, action) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    clearSearchResults: (state) => {
      state.searchResults = null;
      state.searchError = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSearchError: (state) => {
      state.searchError = null;
    },
    resetUserState: (state) => {
      state.currentUser = null;
      state.searchResults = null;
      state.isLoading = false;
      state.isUpdating = false;
      state.isSearching = false;
      state.error = null;
      state.searchError = null;
      state.initialLoad = false;
    },
    setInitialLoad: (state, action) => {
      state.initialLoad = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // getCurrentUser
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.data || null;
        state.initialLoad = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.initialLoad = true;
      })

      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (action.payload.data?.user) {
          state.currentUser = action.payload.data.user;
        }
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // changePassword
      .addCase(changePassword.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isUpdating = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // updateAvatar
      .addCase(updateAvatar.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (action.payload.data?.user) {
          state.currentUser = action.payload.data.user;
        }
        state.error = null;
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // deleteAccount
      .addCase(deleteAccount.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.currentUser = null;
        state.isUpdating = false;
        state.error = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // searchUsers
      .addCase(searchUsers.pending, (state) => {
        state.isSearching = true;
        state.searchError = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload.data || null;
        state.searchError = null;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isSearching = false;
        state.searchError = action.payload as string;
      });
  },
});

export const {
  setCurrentUser,
  updateCurrentUser,
  clearSearchResults,
  clearError,
  clearSearchError,
  resetUserState,
  setInitialLoad,
} = userSlice.actions;

export default userSlice.reducer;
