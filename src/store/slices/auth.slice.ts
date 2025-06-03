import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import authService from '@/services/auth.service';

import { getCurrentUser, resetUserState, setCurrentUser } from './user.slice';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialLoad: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  initialLoad: false,
};

export const login = createAsyncThunk(
  'auth/login',
  async (
    credentials: { emailOrUsername: string; password: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const response = await authService.login(credentials);

      if (response.success) {
        dispatch(setCurrentUser(response.data));
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Login failed');
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    data: { fullName: string; username: string; email: string; password: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const response = await authService.register(data);

      if (response.success) {
        dispatch(setCurrentUser(response.data));
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Registration failed',
      );
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch, rejectWithValue }) => {
  try {
    const response = await authService.logout();

    dispatch(resetUserState());

    return response;
  } catch (error: any) {
    dispatch(resetUserState());
    return rejectWithValue(error?.response?.data?.message || error?.message || 'Logout failed');
  }
});

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const result = await dispatch(getCurrentUser());

      if (getCurrentUser.fulfilled.match(result)) {
        return { isAuthenticated: true };
      } else {
        return { isAuthenticated: false };
      }
    } catch (error: any) {
      return rejectWithValue({ isAuthenticated: false });
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setInitialLoad: (state, action) => {
      state.initialLoad = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAuthState: (state) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.initialLoad = false;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.initialLoad = true;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.initialLoad = true;
        state.error = null;
      })

      .addCase(getCurrentUser.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isAuthenticated = false;
      });
  },
});

export const {
  setIsAuthenticated,
  setIsLoading,
  setError,
  setInitialLoad,
  clearError,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;
