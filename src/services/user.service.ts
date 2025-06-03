import apiInstance from '@/lib/axios';

import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  DeleteAccountResponse,
  FollowListQuery,
  GetCurrentUserResponse,
  GetFollowersResponse,
  GetFollowingResponse,
  GetUserResponse,
  GetUserStatsResponse,
  SearchUsersResponse,
  UpdateAvatarResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UserSearchQuery,
} from '@/types';

const userService = {
  getUserById: async (userId: string): Promise<GetUserResponse> => {
    const response = await apiInstance.get<GetUserResponse>(`/users/${userId}`);
    return response.data;
  },

  getUserByUsername: async (username: string): Promise<GetUserResponse> => {
    const response = await apiInstance.get<GetUserResponse>(`/users/username/${username}`);
    return response.data;
  },

  getCurrentUser: async (): Promise<GetCurrentUserResponse> => {
    const response = await apiInstance.get<GetCurrentUserResponse>('/users/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    const response = await apiInstance.put<UpdateProfileResponse>('/users/me', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    const response = await apiInstance.post<ChangePasswordResponse>(
      '/users/me/change-password',
      data,
    );
    return response.data;
  },

  updateAvatar: async (file: File): Promise<UpdateAvatarResponse> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiInstance.post<UpdateAvatarResponse>('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteAccount: async (): Promise<DeleteAccountResponse> => {
    const response = await apiInstance.delete<DeleteAccountResponse>('/users/me');
    return response.data;
  },

  searchUsers: async (query: UserSearchQuery = {}): Promise<SearchUsersResponse> => {
    const params = new URLSearchParams();

    if (query.q) params.append('q', query.q);
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.offset) params.append('offset', query.offset.toString());

    const response = await apiInstance.get<SearchUsersResponse>(`/users?${params.toString()}`);
    return response.data;
  },

  getUserStats: async (userId: string): Promise<GetUserStatsResponse> => {
    const response = await apiInstance.get<GetUserStatsResponse>(`/users/${userId}/stats`);
    return response.data;
  },

  getFollowers: async (
    userId: string,
    query: FollowListQuery = {},
  ): Promise<GetFollowersResponse> => {
    const params = new URLSearchParams();

    if (query.limit) params.append('limit', query.limit.toString());
    if (query.cursor) params.append('cursor', query.cursor);

    const response = await apiInstance.get<GetFollowersResponse>(
      `/users/${userId}/followers?${params.toString()}`,
    );
    return response.data;
  },

  getFollowing: async (
    userId: string,
    query: FollowListQuery = {},
  ): Promise<GetFollowingResponse> => {
    const params = new URLSearchParams();

    if (query.limit) params.append('limit', query.limit.toString());
    if (query.cursor) params.append('cursor', query.cursor);

    const response = await apiInstance.get<GetFollowingResponse>(
      `/users/${userId}/following?${params.toString()}`,
    );
    return response.data;
  },
};

export default userService;
