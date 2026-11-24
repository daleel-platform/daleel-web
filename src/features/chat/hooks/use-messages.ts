import { useQuery } from '@tanstack/react-query';
import { getMessages } from '../api/chat.api';
import { chatQueryKeys } from './query-keys';
import type { PaginatedMessages } from '../types/chat.types';

export function useMessages(conversationId: string | null) {
  return useQuery<PaginatedMessages, Error>({
    queryKey: chatQueryKeys.messages(conversationId ?? ''),
    queryFn: () => getMessages(conversationId!),
    enabled: Boolean(conversationId),
    staleTime: 10 * 1000,
  });
}
