import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { io, type Socket } from 'socket.io-client';
import {
  AUTH_SESSION_EXPIRED_EVENT,
  AUTH_TOKEN_REFRESHED_EVENT,
  refreshAccessToken,
} from '@/api/client';
import { AUTH_TOKEN_STORAGE_KEY } from '@/config/constants';
import { env } from '@/config/env';
import { chatQueryKeys } from './query-keys';
import type {
  Conversation,
  Message,
  MessageDeletedPayload,
  PaginatedMessages,
  SendMessagePayload,
} from '../types/chat.types';

const SEND_MESSAGE_TIMEOUT_MS = 10_000;

interface UseChatSocketOptions {
  conversationId: string | null;
}

export interface UseChatSocketReturn {
  sendMessage: (content: string) => Promise<Message>;
  isConnected: boolean;
}

interface WsErrorPayload {
  status?: string;
  statusCode?: number;
  message?: unknown;
}

function extractWsErrorMessage(payload: WsErrorPayload): string {
  if (Array.isArray(payload.message)) {
    const messages = payload.message.filter(
      (item): item is string => typeof item === 'string',
    );
    if (messages.length > 0) {
      return messages.join(', ');
    }
  }
  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message;
  }
  return 'Failed to send message.';
}

export function useChatSocket({
  conversationId,
}: UseChatSocketOptions): UseChatSocketReturn {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const activeConversationIdRef = useRef<string | null>(conversationId);
  const hasConnectedOnceRef = useRef(false);

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
      auth: (cb) => {
        const latestToken =
          typeof window !== 'undefined'
            ? localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
            : null;
        cb({ token: latestToken });
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;
    let isDisposed = false;
    let hasRetriedAuth = false;

    const handleTokenRefreshed = () => {
      if (!isDisposed && !socket.connected) {
        hasRetriedAuth = false;
        socket.connect();
      }
    };

    window.addEventListener(AUTH_TOKEN_REFRESHED_EVENT, handleTokenRefreshed);

    socket.on('connect', () => {
      hasRetriedAuth = false;
      setIsConnected(true);

      if (hasConnectedOnceRef.current) {
        void queryClient.invalidateQueries({
          queryKey: chatQueryKeys.conversations(),
        });
        if (activeConversationIdRef.current) {
          void queryClient.invalidateQueries({
            queryKey: chatQueryKeys.messages(activeConversationIdRef.current),
          });
        }
      }
      hasConnectedOnceRef.current = true;
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('error', (err: WsErrorPayload) => {
      if (err?.statusCode !== 401 || hasRetriedAuth || isDisposed) {
        return;
      }

      hasRetriedAuth = true;
      void refreshAccessToken().then((newToken) => {
        if (isDisposed) return;
        if (newToken) {
          if (!socket.connected) {
            socket.connect();
          }
        } else {
          window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT));
        }
      });
    });

    socket.on('messageCreated', (newMessage: Message) => {
      // 1. Update message history in cache only if already loaded
      let hasLoadedPages = false;
      queryClient.setQueryData<InfiniteData<PaginatedMessages>>(
        chatQueryKeys.messages(newMessage.conversationId),
        (oldData) => {
          if (!oldData || oldData.pages.length === 0) {
            return undefined;
          }
          hasLoadedPages = true;

          const alreadyExists = oldData.pages.some((page) =>
            page.items.some((item) => item.id === newMessage.id),
          );
          if (alreadyExists) {
            return oldData;
          }

          const [newestPage, ...olderPages] = oldData.pages;
          return {
            ...oldData,
            pages: [
              {
                ...newestPage,
                items: [...newestPage.items, newMessage],
              },
              ...olderPages,
            ],
          };
        },
      );

      if (!hasLoadedPages) {
        void queryClient.invalidateQueries({
          queryKey: chatQueryKeys.messages(newMessage.conversationId),
        });
      }

      // 2. Update conversation list preview & order in cache
      let foundConversation = false;
      queryClient.setQueryData<Conversation[]>(
        chatQueryKeys.conversations(),
        (oldConversations) => {
          if (!oldConversations) return oldConversations;

          const updated = oldConversations.map((conv) => {
            if (conv.id === newMessage.conversationId) {
              foundConversation = true;
              return {
                ...conv,
                lastMessage: newMessage,
                lastMessageAt: newMessage.createdAt,
              };
            }
            return conv;
          });

          if (!foundConversation) {
            return oldConversations;
          }

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

      if (!foundConversation) {
        void queryClient.invalidateQueries({
          queryKey: chatQueryKeys.conversations(),
        });
      }
    });

    socket.on('messageUpdated', (updatedMessage: Message) => {
      queryClient.setQueryData<InfiniteData<PaginatedMessages>>(
        chatQueryKeys.messages(updatedMessage.conversationId),
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === updatedMessage.id ? updatedMessage : item,
              ),
            })),
          };
        },
      );

      queryClient.setQueryData<Conversation[]>(
        chatQueryKeys.conversations(),
        (oldConversations) => {
          if (!oldConversations) return oldConversations;
          return oldConversations.map((conv) =>
            conv.lastMessage?.id === updatedMessage.id
              ? { ...conv, lastMessage: updatedMessage }
              : conv,
          );
        },
      );
    });

    socket.on('messageDeleted', (payload: MessageDeletedPayload) => {
      queryClient.setQueryData<InfiniteData<PaginatedMessages>>(
        chatQueryKeys.messages(payload.conversationId),
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === payload.messageId
                  ? {
                      ...item,
                      isDeleted: payload.isDeleted,
                      content: 'This message was deleted',
                    }
                  : item,
              ),
            })),
          };
        },
      );

      queryClient.setQueryData<Conversation[]>(
        chatQueryKeys.conversations(),
        (oldConversations) => {
          if (!oldConversations) return oldConversations;
          return oldConversations.map((conv) =>
            conv.lastMessage?.id === payload.messageId && conv.lastMessage
              ? {
                  ...conv,
                  lastMessage: {
                    ...conv.lastMessage,
                    isDeleted: payload.isDeleted,
                    content: 'This message was deleted',
                  },
                }
              : conv,
          );
        },
      );
    });

    return () => {
      isDisposed = true;
      window.removeEventListener(
        AUTH_TOKEN_REFRESHED_EVENT,
        handleTokenRefreshed,
      );
      socket.disconnect();
      socketRef.current = null;
      hasConnectedOnceRef.current = false;
      setIsConnected(false);
    };
  }, [queryClient]);

  // Handle room joining/leaving when conversationId or connection state changes
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !isConnected || !conversationId) return;

    socket.emit('joinConversation', { conversationId });

    return () => {
      if (socket.connected) {
        socket.emit('leaveConversation', { conversationId });
      }
    };
  }, [conversationId, isConnected]);

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

      let settled = false;

      const cleanup = () => {
        clearTimeout(timeoutId);
        socket.off('error', handleWsError);
      };

      const handleWsError = (err: WsErrorPayload) => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error(extractWsErrorMessage(err)));
      };

      const timeoutId = setTimeout(() => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error('Message send timed out. Please try again.'));
      }, SEND_MESSAGE_TIMEOUT_MS);

      socket.on('error', handleWsError);

      const payload: SendMessagePayload = {
        conversationId: activeConversationIdRef.current,
        content: content.trim(),
      };

      socket.emit(
        'sendMessage',
        payload,
        (response: Message | { error: string }) => {
          if (settled) return;
          settled = true;
          cleanup();
          if (response && typeof response === 'object' && 'error' in response) {
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
