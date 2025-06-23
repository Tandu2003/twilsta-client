import { api } from './api';
import type { ApiResponse, Message, CreateMessageRequest, UpdateMessageRequest } from '@/types';

export const messageService = {
  async getByConversation(conversationId: string, page = 1, limit = 50) {
    const res = await api.get<ApiResponse<{ messages: Message[]; pagination: any }>>(
      `/messages/${conversationId}`,
      {
        params: { page, limit },
      },
    );
    return res.data;
  },
  async create(conversationId: string, data: CreateMessageRequest) {
    const res = await api.post<ApiResponse<Message>>(`/messages/${conversationId}`, data);
    return res.data;
  },
  async createWithMedia(conversationId: string, data: CreateMessageRequest, files: File[]) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });
    files.forEach((file) => formData.append('media', file));
    const res = await api.post<ApiResponse<Message>>(
      `/messages/${conversationId}/media`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return res.data;
  },
  async update(messageId: string, data: UpdateMessageRequest) {
    const res = await api.put<ApiResponse<Message>>(`/messages/${messageId}`, data);
    return res.data;
  },
  async delete(messageId: string) {
    const res = await api.delete<ApiResponse<null>>(`/messages/${messageId}`);
    return res.data;
  },
  async reactToMessage(messageId: string, emoji: string) {
    const res = await api.post<ApiResponse<any>>(`/messages/${messageId}/react`, { emoji });
    return res.data;
  },
  async markAsRead(conversationId: string, messageId?: string) {
    const res = await api.post<ApiResponse<null>>(`/messages/${conversationId}/read`, {
      messageId,
    });
    return res.data;
  },
};
