import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Comment } from '@/types';

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    setComments(state, action: PayloadAction<Comment[]>) {
      state.comments = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    resetCommentState() {
      return initialState;
    },
  },
});

export const { setComments, setLoading, setError, resetCommentState } = commentSlice.actions;

export default commentSlice.reducer;
