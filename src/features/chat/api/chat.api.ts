import { apiClient } from '@/api/client';
import type { Conversation, PaginatedMessages } from '../types/chat.types';

export function getConversations(): Promise<Conversation[]> {
  return apiClient.get<Conversation[]>('/conversations');
}

export function getMessages(
  conversationId: string,
  cursor?: string,
  limit: number = 50,
): Promise<PaginatedMessages> {
  return apiClient.get<PaginatedMessages>(
    `/conversations/${conversationId}/messages`,
    {
      params: {
        ...(cursor ? { cursor } : {}),
        limit,
      },
    },
  );
}

export function createConversation(recipientId: string): Promise<Conversation> {
  return apiClient.post<Conversation>('/conversations', { recipientId });
}
