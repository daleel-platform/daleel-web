import { useState, useMemo } from 'react';
import { Search, MessageSquare, Plus } from 'lucide-react';
import { ConversationItem } from './conversation-item';
import type { Conversation } from '../types/chat.types';

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: string;
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChatClick?: () => void;
  isLoading: boolean;
}

export function ConversationList({
  conversations,
  currentUserId,
  selectedConversationId,
  onSelectConversation,
  onNewChatClick,
  isLoading,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase().trim();

    return conversations.filter((conv) => {
      const otherUser =
        conv.participant1Id === currentUserId
          ? conv.participant2
          : conv.participant1;

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
            <button
              type="button"
              onClick={onNewChatClick}
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              title="Start New Conversation"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Chat</span>
            </button>
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
