import { ApiResponse } from '.';

export interface User {
  id: string;
  username: string;
  email?: string; // Only included if user owns profile
  fullName?: string;
  bio?: string;
  avatar?: string;
  website?: string;
  phone?: string;
  isVerified: boolean;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithStats extends User {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface UserStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface UserSearchResult {
  id: string;
  username: string;
  fullName?: string;
  avatar?: string;
  isVerified: boolean;
  isPrivate: boolean;
}

export interface UserSearchResponse {
  users: UserSearchResult[];
  hasMore: boolean;
  total: number;
}

export interface FollowListItem {
  id: string;
  username: string;
  fullName?: string;
  avatar?: string;
  isVerified: boolean;
  isPrivate: boolean;
  isFollowing?: boolean;
  isFollowedBy?: boolean;
}

export interface FollowListResponse {
  users: FollowListItem[];
  hasMore: boolean;
  nextCursor?: string;
  total: number;
}

// Request DTOs
export interface UpdateProfileRequest {
  fullName?: string;
  bio?: string;
  website?: string;
  phone?: string;
  isPrivate?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserSearchQuery {
  q?: string;
  limit?: number;
  offset?: number;
}

export interface FollowListQuery {
  limit?: number;
  cursor?: string;
}

// Response Types
export interface GetUserResponse extends ApiResponse<User> {}
export interface GetCurrentUserResponse extends ApiResponse<User> {}
export interface UpdateProfileResponse extends ApiResponse<{ user: User; message: string }> {}
export interface ChangePasswordResponse extends ApiResponse<{ message: string }> {}
export interface UpdateAvatarResponse extends ApiResponse<{ user: User; message: string }> {}
export interface DeleteAccountResponse extends ApiResponse<{ message: string }> {}
export interface GetUserStatsResponse extends ApiResponse<UserStats> {}
export interface SearchUsersResponse extends ApiResponse<UserSearchResponse> {}
export interface GetFollowersResponse extends ApiResponse<FollowListResponse> {}
export interface GetFollowingResponse extends ApiResponse<FollowListResponse> {}
