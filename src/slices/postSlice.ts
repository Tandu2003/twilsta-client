import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Post } from '@/types';

interface PostState {
  posts: Post[];
  postDetail: Post | null;
  replies: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  postDetail: null,
  replies: [],
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Post[]>) {
      state.posts = action.payload;
    },
    setPostDetail(state, action: PayloadAction<Post | null>) {
      state.postDetail = action.payload;
    },
    setReplies(state, action: PayloadAction<Post[]>) {
      state.replies = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    resetPostState() {
      return initialState;
    },
  },
});

export const { setPosts, setPostDetail, setReplies, setLoading, setError, resetPostState } =
  postSlice.actions;
export default postSlice.reducer;
