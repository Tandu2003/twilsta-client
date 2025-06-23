import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import type { Post } from '@/types';
import {
  setPosts,
  setPostDetail,
  setReplies,
  setLoading,
  setError,
  resetPostState,
} from '@/slices/postSlice';

export const usePost = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.post.posts);
  const postDetail = useAppSelector((state) => state.post.postDetail);
  const replies = useAppSelector((state) => state.post.replies);
  const loading = useAppSelector((state) => state.post.loading);
  const error = useAppSelector((state) => state.post.error);

  return {
    posts,
    postDetail,
    replies,
    loading,
    error,
    setPosts: (payload: Post[]) => dispatch(setPosts(payload)),
    setPostDetail: (payload: Post | null) => dispatch(setPostDetail(payload)),
    setReplies: (payload: Post[]) => dispatch(setReplies(payload)),
    setLoading: (payload: boolean) => dispatch(setLoading(payload)),
    setError: (payload: string | null) => dispatch(setError(payload)),
    resetPostState: () => dispatch(resetPostState()),
  };
};
