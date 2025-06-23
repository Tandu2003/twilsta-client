import { api } from './api';
import type {
  ApiResponse,
  Conversation,
  CreateConversationRequest,
  UpdateConversationRequest,
} from '@/types';

export const conversationService = {
  async getAll(params: { page?: number; limit?: number } = {}) {
    const res = await api.get<ApiResponse<{ conversations: Conversation[]; pagination: any }>>(
      '/conversations',
      { params },
    );
    return res.data;
  },
  async getById(id: string) {
    const res = await api.get<ApiResponse<Conversation>>(`/conversations/${id}`);
    return res.data;
  },
  async create(data: CreateConversationRequest) {
    const res = await api.post<ApiResponse<Conversation>>('/conversations', data);
    return res.data;
  },
  async update(id: string, data: UpdateConversationRequest) {
    const res = await api.put<ApiResponse<Conversation>>(`/conversations/${id}`, data);
    return res.data;
  },
  async delete(id: string) {
    const res = await api.delete<ApiResponse<null>>(`/conversations/${id}`);
    return res.data;
  },
  async addParticipants(id: string, userIds: string[]) {
    const res = await api.post<ApiResponse<Conversation>>(`/conversations/${id}/participants`, {
      userIds,
    });
    return res.data;
  },
  async removeParticipant(id: string, userId: string) {
    const res = await api.delete<ApiResponse<Conversation>>(
      `/conversations/${id}/participants/${userId}`,
    );
    return res.data;
  },
  async leaveConversation(id: string) {
    const res = await api.post<ApiResponse<null>>(`/conversations/${id}/leave`);
    return res.data;
  },
};
