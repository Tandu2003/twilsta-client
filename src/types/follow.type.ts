import { User } from './user.type';

export interface FollowResponse {
  id: string;
  followerId: string;
  followingId: string;
  status: FollowStatus;
  createdAt: string;
  follower?: User;
  following?: User;
}

export interface FollowStatusResponse {
  isFollowing: boolean;
  isPending: boolean;
  canFollow: boolean;
}

export interface FollowUsersResponse {
  users: UserWithFollowInfo[];
  pagination: {
    hasNext: boolean;
    cursor?: string;
  };
}

export interface UserWithFollowInfo {
  id: string;
  username: string;
  fullName?: string;
  avatar?: string;
  isVerified: boolean;
  isPrivate: boolean;
  followStatus?: FollowStatus;
  createdAt: string;
}

export interface FollowRequestResponse {
  id: string;
  user: User;
  createdAt: string;
}

export interface PaginationQuery {
  limit?: number;
  cursor?: string;
}

export enum FollowStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
}

// API Response types
export interface FollowUserResponse {
  message: string;
  status: FollowStatus;
}

export interface UnfollowUserResponse {
  message: string;
}

export interface AcceptFollowRequestResponse {
  message: string;
}

export interface RejectFollowRequestResponse {
  message: string;
}
