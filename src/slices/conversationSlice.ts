import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Conversation } from '@/types';

interface ConversationState {
  conversations: Conversation[];
  conversationDetail: Conversation | null;
  loading: boolean;
  error: string | null;
}

const initialState: ConversationState = {
  conversations: [],
  conversationDetail: null,
  loading: false,
  error: null,
};

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setConversations(state, action: PayloadAction<Conversation[]>) {
      state.conversations = action.payload;
    },
    setConversationDetail(state, action: PayloadAction<Conversation | null>) {
      state.conversationDetail = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    resetConversationState() {
      return initialState;
    },
  },
});

export const {
  setConversations,
  setConversationDetail,
  setLoading,
  setError,
  resetConversationState,
} = conversationSlice.actions;
export default conversationSlice.reducer;
