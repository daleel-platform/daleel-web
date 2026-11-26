import { ArrowLeft } from 'lucide-react';
import { Avatar } from '@/components/avatar';
import { cn } from '@/utils/cn';
import type { UserSummary } from '../types/chat.types';

interface ChatHeaderProps {
  otherUser: UserSummary | null;
  onBack?: () => void;
  isConnected?: boolean;
}

export function ChatHeader({
  otherUser,
  onBack,
  isConnected = true,
}: ChatHeaderProps) {
  const displayName = otherUser?.name || 'Direct Message';
  const displayAvatar = otherUser?.avatarUrl ?? undefined;

  return (
    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 bg-white">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className={cn(
              'md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer',
              'transition-all duration-150 active:scale-[0.985]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700',
            )}
            aria-label="Back to conversations"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <Avatar name={displayName} src={displayAvatar} size="md" />
        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-none">
            {displayName}
          </h3>
          {!isConnected && (
            <p className="text-[11px] text-amber-600 mt-1 leading-none flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Reconnecting to chat...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
