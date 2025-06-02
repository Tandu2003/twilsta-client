import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import authService from '@/services/auth.service';

import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialLoad: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  initialLoad: false,
};

export const getMe = createAsyncThunk('auth/getMe', async () => {
  const response = await authService.getMe();
  return response;
});

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { emailOrUsername: string; password: string }) => {
    const response = await authService.login(credentials);
    return response;
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: { fullName: string; username: string; email: string; password: string }) => {
    const response = await authService.register(data);
    return response;
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  const response = await authService.logout();
  return response;
});

const authSlice = createSlice({
  name: 'auth-slice',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
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
    resetState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.initialLoad = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data || null;
        state.isAuthenticated = true;
        state.initialLoad = true;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch user data';
        state.initialLoad = true;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data || null;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data || null;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Logout failed';
      });
  },
});

export const {
  setUser,
  setIsAuthenticated,
  setIsLoading,
  setError,
  setInitialLoad,
  clearError,
  resetState,
} = authSlice.actions;

export default authSlice.reducer;
