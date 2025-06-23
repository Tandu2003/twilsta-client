import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import type { Conversation } from '@/types';
import {
  setConversations,
  setConversationDetail,
  setLoading,
  setError,
  resetConversationState,
} from '@/slices/conversationSlice';

export const useConversation = () => {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector((state) => state.conversation.conversations);
  const conversationDetail = useAppSelector((state) => state.conversation.conversationDetail);
  const loading = useAppSelector((state) => state.conversation.loading);
  const error = useAppSelector((state) => state.conversation.error);

  return {
    conversations,
    conversationDetail,
    loading,
    error,
    setConversations: (payload: Conversation[]) => dispatch(setConversations(payload)),
    setConversationDetail: (payload: Conversation | null) =>
      dispatch(setConversationDetail(payload)),
    setLoading: (payload: boolean) => dispatch(setLoading(payload)),
    setError: (payload: string | null) => dispatch(setError(payload)),
    resetConversationState: () => dispatch(resetConversationState()),
  };
};
