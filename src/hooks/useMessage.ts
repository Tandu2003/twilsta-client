import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import type { Message } from '@/types';
import { setMessages, setLoading, setError, resetMessageState } from '@/slices/messageSlice';

export const useMessage = () => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.message.messages);
  const loading = useAppSelector((state) => state.message.loading);
  const error = useAppSelector((state) => state.message.error);

  return {
    messages,
    loading,
    error,
    setMessages: (payload: Message[]) => dispatch(setMessages(payload)),
    setLoading: (payload: boolean) => dispatch(setLoading(payload)),
    setError: (payload: string | null) => dispatch(setError(payload)),
    resetMessageState: () => dispatch(resetMessageState()),
  };
};
