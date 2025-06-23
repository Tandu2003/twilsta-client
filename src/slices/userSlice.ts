import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';

interface UserState {
  users: User[];
  userDetail: User | null;
  followers: User[];
  following: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  userDetail: null,
  followers: [],
  following: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
    },
    setUserDetail(state, action: PayloadAction<User | null>) {
      state.userDetail = action.payload;
    },
    setFollowers(state, action: PayloadAction<User[]>) {
      state.followers = action.payload;
    },
    setFollowing(state, action: PayloadAction<User[]>) {
      state.following = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    resetUserState() {
      return initialState;
    },
  },
});

export const {
  setUsers,
  setUserDetail,
  setFollowers,
  setFollowing,
  setLoading,
  setError,
  resetUserState,
} = userSlice.actions;
export default userSlice.reducer;
