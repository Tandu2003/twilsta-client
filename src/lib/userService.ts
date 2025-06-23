import { api } from './api';
import type { ApiResponse, User } from '@/types';

export const userService = {
  async getAll(
    params: { page?: number; limit?: number; search?: string; verified?: boolean } = {},
  ) {
    const res = await api.get<ApiResponse<{ users: User[]; pagination: any }>>('/users', {
      params,
    });
    return res.data;
  },
  async getById(id: string) {
    const res = await api.get<ApiResponse<User & { isFollowing: boolean; isOwnProfile: boolean }>>(
      `/users/${id}`,
    );
    return res.data;
  },
  async getByUsername(username: string) {
    const res = await api.get<ApiResponse<User & { isFollowing: boolean; isOwnProfile: boolean }>>(
      `/users/username/${username}`,
    );
    return res.data;
  },
  async getFollowers(id: string, page = 1, limit = 20) {
    const res = await api.get<ApiResponse<{ users: User[]; pagination: any }>>(
      `/users/${id}/followers`,
      { params: { page, limit } },
    );
    return res.data;
  },
  async getFollowing(id: string, page = 1, limit = 20) {
    const res = await api.get<ApiResponse<{ users: User[]; pagination: any }>>(
      `/users/${id}/following`,
      { params: { page, limit } },
    );
    return res.data;
  },
  async follow(id: string) {
    const res = await api.post<ApiResponse<null>>(`/users/${id}/follow`);
    return res.data;
  },
  async unfollow(id: string) {
    const res = await api.delete<ApiResponse<null>>(`/users/${id}/follow`);
    return res.data;
  },
  async updateProfile(id: string, data: Partial<User>) {
    const res = await api.put<ApiResponse<User>>(`/users/${id}/profile`, data);
    return res.data;
  },
  async uploadAvatar(id: string, file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await api.post<ApiResponse<User>>(`/users/${id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  async removeAvatar(id: string) {
    const res = await api.delete<ApiResponse<User>>(`/users/${id}/avatar`);
    return res.data;
  },
  async uploadCover(id: string, file: File) {
    const formData = new FormData();
    formData.append('cover', file);
    const res = await api.post<ApiResponse<User>>(`/users/${id}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  async removeCover(id: string) {
    const res = await api.delete<ApiResponse<User>>(`/users/${id}/cover`);
    return res.data;
  },
  async changePassword(id: string, oldPassword: string, newPassword: string) {
    const res = await api.put<ApiResponse<null>>(`/users/${id}/password`, {
      oldPassword,
      newPassword,
    });
    return res.data;
  },
  async deactivateAccount(id: string) {
    const res = await api.post<ApiResponse<null>>(`/users/${id}/deactivate`);
    return res.data;
  },
  async deleteUser(id: string) {
    const res = await api.delete<ApiResponse<null>>(`/users/${id}`);
    return res.data;
  },
};
