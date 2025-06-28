import { api } from './api';
import type { ApiResponse, Post, CreatePostRequest, UpdatePostRequest } from '@/types';

export const postService = {
  async getAll(
    params: {
      page?: number;
      limit?: number;
      type?: string;
      authorId?: string;
      parentId?: string;
      search?: string;
    } = {},
  ) {
    const res = await api.get<ApiResponse<{ posts: Post[]; pagination: any }>>('/posts', {
      params,
    });
    return res.data;
  },
  async getById(id: string) {
    const res = await api.get<ApiResponse<Post>>(`/posts/${id}`);
    return res.data;
  },
  async getReplies(id: string, page = 1, limit = 10) {
    const res = await api.get<ApiResponse<{ replies: Post[]; pagination: any }>>(
      `/posts/${id}/replies`,
      { params: { page, limit } },
    );
    return res.data;
  },
  async create(data: CreatePostRequest) {
    const res = await api.post<ApiResponse<Post>>('/posts', data);
    return res.data;
  },
  async createWithMedia(formData: FormData) {
    const res = await api.post<ApiResponse<Post>>('/posts/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  async update(id: string, data: UpdatePostRequest) {
    const res = await api.put<ApiResponse<Post>>(`/posts/${id}`, data);
    return res.data;
  },
  async delete(id: string) {
    const res = await api.delete<ApiResponse<null>>(`/posts/${id}`);
    return res.data;
  },
  async toggleLike(id: string) {
    const res = await api.post<ApiResponse<{ postId: string; liked: boolean; likeCount: number }>>(
      `/posts/${id}/like`,
    );
    return res.data;
  },
  async checkLikeStatus(id: string) {
    const res = await api.get<ApiResponse<{ liked: boolean }>>(`/posts/${id}/like-status`);
    return res.data;
  },
  async addMedia(id: string, files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append('media', file));
    const res = await api.post<ApiResponse<Post>>(`/posts/${id}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  async removeMedia(id: string, mediaUrl: string) {
    const res = await api.delete<ApiResponse<Post>>(`/posts/${id}/media`, { data: { mediaUrl } });
    return res.data;
  },
};
