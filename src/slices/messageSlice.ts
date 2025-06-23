import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Message } from '@/types';

interface MessageState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: MessageState = {
  messages: [],
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    resetMessageState() {
      return initialState;
    },
  },
});

export const { setMessages, setLoading, setError, resetMessageState } = messageSlice.actions;
export default messageSlice.reducer;
