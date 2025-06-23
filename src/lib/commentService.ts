import { api } from './api';
import type { ApiResponse, Comment, CreateCommentRequest, UpdateCommentRequest } from '@/types';

export const commentService = {
  async getCommentsByPost(postId: string, page = 1, limit = 10) {
    const res = await api.get<ApiResponse<{ comments: Comment[]; pagination: any }>>(
      `/posts/${postId}/comments`,
      { params: { page, limit } },
    );
    return res.data;
  },
  async getReplies(commentId: string, page = 1, limit = 10) {
    const res = await api.get<ApiResponse<{ replies: Comment[]; pagination: any }>>(
      `/comments/${commentId}/replies`,
      { params: { page, limit } },
    );
    return res.data;
  },
  async create(data: CreateCommentRequest) {
    const res = await api.post<ApiResponse<Comment>>('/comments', data);
    return res.data;
  },
  async createWithMedia(data: CreateCommentRequest, files: File[]) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });
    files.forEach((file) => formData.append('media', file));
    const res = await api.post<ApiResponse<Comment>>('/comments/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  async update(id: string, data: UpdateCommentRequest) {
    const res = await api.put<ApiResponse<Comment>>(`/comments/${id}`, data);
    return res.data;
  },
  async delete(id: string) {
    const res = await api.delete<ApiResponse<null>>(`/comments/${id}`);
    return res.data;
  },
  async toggleLike(id: string) {
    const res = await api.post<ApiResponse<null>>(`/comments/${id}/like`);
    return res.data;
  },
  async addMedia(id: string, files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append('media', file));
    const res = await api.post<ApiResponse<Comment>>(`/comments/${id}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  async removeMedia(id: string, mediaUrl: string) {
    const res = await api.delete<ApiResponse<Comment>>(`/comments/${id}/media`, {
      data: { mediaUrl },
    });
    return res.data;
  },
};
