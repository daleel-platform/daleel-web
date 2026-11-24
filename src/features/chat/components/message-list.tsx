import { useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import { MessageBubble } from './message-bubble';
import type { Message } from '../types/chat.types';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isLoading: boolean;
}

export function MessageList({
  messages,
  currentUserId,
  isLoading,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
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
