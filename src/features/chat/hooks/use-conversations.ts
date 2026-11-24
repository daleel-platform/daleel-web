import { useQuery } from '@tanstack/react-query';
import { getConversations } from '../api/chat.api';
import { chatQueryKeys } from './query-keys';
import type { Conversation } from '../types/chat.types';

export function useConversations() {
  return useQuery<Conversation[], Error>({
    queryKey: chatQueryKeys.conversations(),
    queryFn: getConversations,
    staleTime: 30 * 1000,
  });
}
