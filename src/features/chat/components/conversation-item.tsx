import { Avatar } from '@/components/avatar';
import { formatConversationTime } from '../utils/format-time';
import type { Conversation } from '../types/chat.types';

interface ConversationItemProps {
  conversation: Conversation;
  currentUserId: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function ConversationItem({
  conversation,
  currentUserId,
  isSelected,
  onSelect,
}: ConversationItemProps) {
  const otherUser =
    conversation.participant1Id === currentUserId
      ? conversation.participant2
      : conversation.participant1;

  const displayName = otherUser?.name || 'User';
  const displayAvatar = otherUser?.avatarUrl ?? undefined;
  const lastMessageText = conversation.lastMessage
    ? conversation.lastMessage.isDeleted
      ? 'This message was deleted'
      : conversation.lastMessage.content
    : 'No messages yet';

  const formattedTime = formatConversationTime(
    conversation.lastMessageAt || conversation.updatedAt,
  );

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left p-4 transition-colors flex items-start gap-3 cursor-pointer ${
        isSelected
          ? 'bg-teal-50/70 border-l-4 border-teal-700'
          : 'hover:bg-slate-50/80 bg-white'
      }`}
    >
      <Avatar name={displayName} src={displayAvatar} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 truncate">
            {displayName}
          </span>
          {formattedTime && (
            <span className="text-[10px] text-slate-400 shrink-0 ml-1">
              {formattedTime}
            </span>
          )}
        </div>
        <p
          className={`text-xs truncate mt-1 ${
            conversation.lastMessage?.isDeleted
              ? 'text-slate-400 italic'
              : 'text-slate-600'
          }`}
        >
          {lastMessageText}
        </p>
      </div>
    </button>
  );
}
