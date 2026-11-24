import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, type Socket } from 'socket.io-client';
import { AUTH_TOKEN_STORAGE_KEY } from '@/config/constants';
import { env } from '@/config/env';
import { chatQueryKeys } from './query-keys';
import type {
  Conversation,
  Message,
  PaginatedMessages,
} from '../types/chat.types';

interface UseChatSocketOptions {
  conversationId: string | null;
}

export function useChatSocket({ conversationId }: UseChatSocketOptions) {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const activeConversationIdRef = useRef<string | null>(conversationId);

  useEffect(() => {
    activeConversationIdRef.current = conversationId;
  }, [conversationId]);

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
        : null;

    if (!token) {
      return;
    }

    const socket: Socket = io(env.wsBaseUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      if (activeConversationIdRef.current) {
        socket.emit('joinConversation', {
          conversationId: activeConversationIdRef.current,
        });
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('messageCreated', (newMessage: Message) => {
      // 1. Update message history in cache
      queryClient.setQueryData<PaginatedMessages>(
        chatQueryKeys.messages(newMessage.conversationId),
        (oldData) => {
          if (!oldData) {
            return {
              items: [newMessage],
              nextCursor: null,
              hasMore: false,
            };
          }
          if (oldData.items.some((item) => item.id === newMessage.id)) {
            return oldData;
          }
          return {
            ...oldData,
            items: [...oldData.items, newMessage],
          };
        },
      );

      // 2. Update conversation list preview & order in cache
      queryClient.setQueryData<Conversation[]>(
        chatQueryKeys.conversations(),
        (oldConversations) => {
          if (!oldConversations) return oldConversations;

          const updated = oldConversations.map((conv) => {
            if (conv.id === newMessage.conversationId) {
              return {
                ...conv,
                lastMessage: newMessage,
                lastMessageAt: newMessage.createdAt,
              };
            }
            return conv;
          });

          // Move the conversation with the new message to the top
          return [...updated].sort((a, b) => {
            const timeA = a.lastMessageAt
              ? new Date(a.lastMessageAt).getTime()
              : 0;
            const timeB = b.lastMessageAt
              ? new Date(b.lastMessageAt).getTime()
              : 0;
            return timeB - timeA;
          });
        },
      );
    });

    socket.on('messageUpdated', (updatedMessage: Message) => {
      queryClient.setQueryData<PaginatedMessages>(
        chatQueryKeys.messages(updatedMessage.conversationId),
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: oldData.items.map((item) =>
              item.id === updatedMessage.id ? updatedMessage : item,
            ),
          };
        },
      );
    });

    socket.on(
      'messageDeleted',
      (payload: { messageId: string; conversationId: string }) => {
        queryClient.setQueryData<PaginatedMessages>(
          chatQueryKeys.messages(payload.conversationId),
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              items: oldData.items.map((item) =>
                item.id === payload.messageId
                  ? {
                      ...item,
                      isDeleted: true,
                      content: 'This message was deleted',
                    }
                  : item,
              ),
            };
          },
        );
      },
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [queryClient]);

  // Handle room joining/leaving when conversationId changes
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !socket.connected || !conversationId) return;

    socket.emit('joinConversation', { conversationId });

    return () => {
      socket.emit('leaveConversation', { conversationId });
    };
  }, [conversationId]);

  const sendMessage = useCallback((content: string): Promise<Message> => {
    return new Promise((resolve, reject) => {
      const socket = socketRef.current;
      if (!socket || !socket.connected) {
        reject(new Error('Chat server is currently disconnected.'));
        return;
      }

      if (!activeConversationIdRef.current) {
        reject(new Error('No active conversation selected.'));
        return;
      }

      socket.emit(
        'sendMessage',
        {
          conversationId: activeConversationIdRef.current,
          content: content.trim(),
        },
        (response: Message | { error: string }) => {
          if ('error' in response) {
            reject(new Error(response.error));
          } else {
            resolve(response);
          }
        },
      );
    });
  }, []);

  return {
    sendMessage,
    isConnected,
  };
}
