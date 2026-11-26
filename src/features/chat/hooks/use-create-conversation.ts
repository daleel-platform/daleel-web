import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';
import { createConversation } from '../api/chat.api';
import { chatQueryKeys } from './query-keys';
import type { Conversation } from '../types/chat.types';

export function useCreateConversation(): UseMutationResult<
  Conversation,
  Error,
  string
> {
  const queryClient = useQueryClient();

  return useMutation<Conversation, Error, string>({
    mutationFn: (recipientId: string) => createConversation(recipientId),
    onSuccess: (conversation) => {
      queryClient.setQueryData<Conversation[]>(
        chatQueryKeys.conversations(),
        (oldData) => {
          if (!oldData) return undefined;
          if (oldData.some((c) => c.id === conversation.id)) return oldData;
          return [conversation, ...oldData];
        },
      );
      void queryClient.invalidateQueries({
        queryKey: chatQueryKeys.conversations(),
      });
    },
  });
}
