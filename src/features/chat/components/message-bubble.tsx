import { formatMessageTime } from '../utils/format-time';
import type { Message } from '../types/chat.types';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  const formattedTime = formatMessageTime(message.createdAt);

  return (
    <div
      className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
    >
      <div
        className={`max-w-[80%] sm:max-w-md rounded-2xl px-4 py-2.5 text-xs leading-relaxed break-words ${
          isCurrentUser
            ? 'bg-teal-700 text-white rounded-br-xs shadow-xs'
            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
        } ${message.isDeleted ? 'italic opacity-70' : ''}`}
      >
        {message.isDeleted ? 'This message was deleted' : message.content}
      </div>

      <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-slate-400">
        <span>{formattedTime}</span>
        {message.isEdited && !message.isDeleted && (
          <span className="text-slate-400 font-normal">(edited)</span>
        )}
      </div>
    </div>
  );
}
