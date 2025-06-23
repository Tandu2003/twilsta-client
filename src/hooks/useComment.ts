import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import type { Comment } from '@/types';
import {
  setComments,
  setReplies,
  setLoading,
  setError,
  resetCommentState,
} from '@/slices/commentSlice';

export const useComment = () => {
  const dispatch = useAppDispatch();
  const comments = useAppSelector((state) => state.comment.comments);
  const replies = useAppSelector((state) => state.comment.replies);
  const loading = useAppSelector((state) => state.comment.loading);
  const error = useAppSelector((state) => state.comment.error);

  return {
    comments,
    replies,
    loading,
    error,
    setComments: (payload: Comment[]) => dispatch(setComments(payload)),
    setReplies: (payload: Comment[]) => dispatch(setReplies(payload)),
    setLoading: (payload: boolean) => dispatch(setLoading(payload)),
    setError: (payload: string | null) => dispatch(setError(payload)),
    resetCommentState: () => dispatch(resetCommentState()),
  };
};
