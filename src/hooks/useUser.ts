import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import type { User } from '@/types';
import {
  setUsers,
  setUserDetail,
  setFollowers,
  setFollowing,
  setLoading,
  setError,
  resetUserState,
} from '@/slices/userSlice';

export const useUser = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.user.users);
  const userDetail = useAppSelector((state) => state.user.userDetail);
  const followers = useAppSelector((state) => state.user.followers);
  const following = useAppSelector((state) => state.user.following);
  const loading = useAppSelector((state) => state.user.loading);
  const error = useAppSelector((state) => state.user.error);

  return {
    users,
    userDetail,
    followers,
    following,
    loading,
    error,
    setUsers: (payload: User[]) => dispatch(setUsers(payload)),
    setUserDetail: (payload: User | null) => dispatch(setUserDetail(payload)),
    setFollowers: (payload: User[]) => dispatch(setFollowers(payload)),
    setFollowing: (payload: User[]) => dispatch(setFollowing(payload)),
    setLoading: (payload: boolean) => dispatch(setLoading(payload)),
    setError: (payload: string | null) => dispatch(setError(payload)),
    resetUserState: () => dispatch(resetUserState()),
  };
};
