import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { getMessages } from '../api/chat.api';
import { chatQueryKeys } from './query-keys';
import type { PaginatedMessages } from '../types/chat.types';

export function useMessages(
  conversationId: string | null,
): UseInfiniteQueryResult<
  InfiniteData<PaginatedMessages, string | undefined>,
  Error
> {
  return useInfiniteQuery<
    PaginatedMessages,
    Error,
    InfiniteData<PaginatedMessages, string | undefined>,
    ReturnType<typeof chatQueryKeys.messages>,
    string | undefined
  >({
    queryKey: chatQueryKeys.messages(conversationId ?? ''),
    queryFn: ({ pageParam }) => getMessages(conversationId!, pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore && lastPage.nextCursor ? lastPage.nextCursor : undefined,
    enabled: Boolean(conversationId),
    staleTime: 10 * 1000,
  });
}
