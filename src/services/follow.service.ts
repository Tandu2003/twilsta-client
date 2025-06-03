import apiInstance from '@/lib/axios';

import {
  AcceptFollowRequestResponse,
  FollowRequestResponse,
  FollowStatusResponse,
  FollowUserResponse,
  FollowUsersResponse,
  PaginationQuery,
  RejectFollowRequestResponse,
  UnfollowUserResponse,
} from '@/types';

const followService = {
  followUser: async (targetUserId: string): Promise<FollowUserResponse> => {
    const response = await apiInstance.post<FollowUserResponse>(`/follow/${targetUserId}`);
    return response.data;
  },

  unfollowUser: async (targetUserId: string): Promise<UnfollowUserResponse> => {
    const response = await apiInstance.delete<UnfollowUserResponse>(`/follow/${targetUserId}`);
    return response.data;
  },

  getFollowStatus: async (userId: string): Promise<FollowStatusResponse> => {
    const response = await apiInstance.get<FollowStatusResponse>(`/follow/status/${userId}`);
    return response.data;
  },

  getFollowers: async (
    userId: string,
    pagination?: PaginationQuery,
  ): Promise<FollowUsersResponse> => {
    const params = new URLSearchParams();
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    if (pagination?.cursor) params.append('cursor', pagination.cursor);

    const queryString = params.toString();
    const url = `/follow/followers/${userId}${queryString ? `?${queryString}` : ''}`;

    const response = await apiInstance.get<FollowUsersResponse>(url);
    return response.data;
  },

  getFollowing: async (
    userId: string,
    pagination?: PaginationQuery,
  ): Promise<FollowUsersResponse> => {
    const params = new URLSearchParams();
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    if (pagination?.cursor) params.append('cursor', pagination.cursor);

    const queryString = params.toString();
    const url = `/follow/following/${userId}${queryString ? `?${queryString}` : ''}`;

    const response = await apiInstance.get<FollowUsersResponse>(url);
    return response.data;
  },

  getFollowRequests: async (): Promise<FollowRequestResponse[]> => {
    const response = await apiInstance.get<FollowRequestResponse[]>('/follow/requests');
    return response.data;
  },

  acceptFollowRequest: async (followId: string): Promise<AcceptFollowRequestResponse> => {
    const response = await apiInstance.post<AcceptFollowRequestResponse>(
      `/follow/requests/${followId}/accept`,
    );
    return response.data;
  },

  rejectFollowRequest: async (followId: string): Promise<RejectFollowRequestResponse> => {
    const response = await apiInstance.post<RejectFollowRequestResponse>(
      `/follow/requests/${followId}/reject`,
    );
    return response.data;
  },
};

export default followService;
