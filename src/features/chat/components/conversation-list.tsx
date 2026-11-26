import { useState, useMemo } from 'react';
import { Search, MessageSquare, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/button';
import { ConversationItem } from './conversation-item';
import { getOtherParticipant } from '../utils/get-other-participant';
import type { Conversation } from '../types/chat.types';

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: string;
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChatClick?: () => void;
  isLoading: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

export function ConversationList({
  conversations,
  currentUserId,
  selectedConversationId,
  onSelectConversation,
  onNewChatClick,
  isLoading,
  isError = false,
  errorMessage,
  onRetry,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase().trim();

    return conversations.filter((conv) => {
      const otherUser = getOtherParticipant(conv, currentUserId);
      const name = otherUser?.name?.toLowerCase() || '';
      const lastMsg = conv.lastMessage?.content?.toLowerCase() || '';
      return name.includes(query) || lastMsg.includes(query);
    });
  }, [conversations, currentUserId, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Search Header */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Direct Messages
          </h2>
          {onNewChatClick && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={onNewChatClick}
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              className="font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100/80"
              title="Start New Conversation"
            >
              New Chat
            </Button>
          )}
        </div>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-600/10"
          />
        </div>
      </div>

      {/* List Body */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
            <span className="text-xs">Loading conversations...</span>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">
                Failed to load conversations
              </p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[220px]">
                {errorMessage || 'Please check your connection and try again.'}
              </p>
            </div>
            {onRetry && (
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={onRetry}
              >
                Try Again
              </Button>
            )}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <MessageSquare className="h-5 w-5" />
            </div>
            <p className="text-xs font-medium text-slate-600">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
            <p className="text-[11px] text-slate-400 max-w-[200px]">
              {searchQuery
                ? 'Try a different search term'
                : 'Connect with a mentor or mentee to start a chat.'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              currentUserId={currentUserId}
              isSelected={conv.id === selectedConversationId}
              onSelect={() => onSelectConversation(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
