import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from '@/components/button';
import { MessageBubble } from './message-bubble';
import type { Message } from '../types/chat.types';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

export function MessageList({
  messages,
  currentUserId,
  isLoading,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  isError = false,
  errorMessage,
  onRetry,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number | null>(null);
  const prevFirstMessageIdRef = useRef<string | null>(null);
  const prevLastMessageIdRef = useRef<string | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  const [isInitialScrolled, setIsInitialScrolled] = useState(false);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useLayoutEffect(() => {
    if (messages.length === 0) {
      prevScrollHeightRef.current = null;
      prevFirstMessageIdRef.current = null;
      prevLastMessageIdRef.current = null;
      return;
    }

    const firstId = messages[0]?.id ?? null;
    const lastId = messages[messages.length - 1]?.id ?? null;
    let rafId: number | null = null;

    if (
      prevScrollHeightRef.current !== null &&
      firstId !== prevFirstMessageIdRef.current &&
      containerRef.current
    ) {
      const heightDiff =
        containerRef.current.scrollHeight - prevScrollHeightRef.current;
      containerRef.current.scrollTop += heightDiff;
      prevScrollHeightRef.current = null;
    } else if (lastId !== prevLastMessageIdRef.current) {
      const isInitialLoad = prevLastMessageIdRef.current === null;
      if (isInitialLoad && containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
        rafId = requestAnimationFrame(() => {
          setIsInitialScrolled(true);
        });
      } else {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }

    prevFirstMessageIdRef.current = firstId;
    prevLastMessageIdRef.current = lastId;

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [messages]);

  useEffect(() => {
    const container = containerRef.current;
    const sentinel = topSentinelRef.current;
    if (
      !container ||
      !sentinel ||
      !hasNextPage ||
      !isInitialScrolled ||
      isFetchingNextPage
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && onLoadMoreRef.current) {
          prevScrollHeightRef.current = container.scrollHeight;
          onLoadMoreRef.current();
        }
      },
      {
        root: container,
        rootMargin: '80px 0px 0px 0px',
        threshold: 0,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, isInitialScrolled]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50/30">
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
          <span className="text-xs">Loading messages...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50/30 space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Failed to load messages
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            {errorMessage || 'Unable to load this conversation right now.'}
          </p>
        </div>
        {onRetry && (
          <Button type="button" variant="outline" size="xs" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50/30">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200/90 text-teal-700 shadow-2xs mb-3">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-900">No messages yet</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Send a message below to start the conversation!
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30"
    >
      <div ref={topSentinelRef} className="h-1 w-full" aria-hidden="true" />
      {isFetchingNextPage && (
        <div className="flex items-center justify-center gap-2 py-2 text-xs text-slate-500">
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
          <span>Loading older messages...</span>
        </div>
      )}
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isCurrentUser={msg.senderId === currentUserId}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
