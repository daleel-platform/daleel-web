import { useState } from 'react';
import { MessageSquarePlus, Search } from 'lucide-react';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { Modal } from '@/components/modal';
import { useCreateConversation } from '../hooks/use-create-conversation';

export interface ConversationRecipientOption {
  userId: string;
  name: string;
  headline: string;
  avatarUrl: string | null;
}

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: readonly ConversationRecipientOption[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isSearching: boolean;
  hasSearched: boolean;
  totalMatches?: number;
  onConversationCreated: (conversationId: string) => void;
}

export function NewConversationModal({
  isOpen,
  onClose,
  recipients,
  searchQuery,
  onSearchChange,
  isSearching,
  hasSearched,
  totalMatches,
  onConversationCreated,
}: NewConversationModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const createConversationMutation = useCreateConversation();

  const hasSearchQuery = Boolean(searchQuery.trim());

  const handleClose = () => {
    setSelectedUserId(null);
    setServerError(null);
    onSearchChange('');
    onClose();
  };

  const handleSelectRecipient = (recipientUserId: string) => {
    if (createConversationMutation.isPending) return;
    setSelectedUserId(recipientUserId);
    setServerError(null);

    createConversationMutation.mutate(recipientUserId, {
      onSuccess: (conversation) => {
        onConversationCreated(conversation.id);
        handleClose();
      },
      onError: (err) => {
        setSelectedUserId(null);
        setServerError(
          err.message || 'Failed to start conversation. Please try again.',
        );
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Start New Conversation"
      description="Search for a mentor by name or headline to start messaging."
      maxWidth="md"
    >
      <div className="space-y-4 pt-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              if (serverError) setServerError(null);
            }}
            placeholder="Search mentors by name or role..."
            aria-label="Search mentors"
            autoFocus
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-600/10 transition-all"
          />
        </div>

        {serverError && (
          <p
            role="alert"
            className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100"
          >
            {serverError}
          </p>
        )}

        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 rounded-xl border border-slate-200/80 bg-white">
          {!hasSearchQuery || (!hasSearched && !isSearching) ? (
            <div className="py-10 px-4 text-center space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Search className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700">
                Search for a mentor
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Type a mentor&apos;s name, role, or company to start a
                conversation.
              </p>
            </div>
          ) : isSearching ? (
            <div className="flex items-center justify-center gap-2 py-10 text-xs text-slate-400">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
              <span>Searching mentors...</span>
            </div>
          ) : recipients.length === 0 ? (
            <div className="py-10 px-4 text-center">
              <p className="text-xs font-semibold text-slate-700">
                No matching mentors found
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Try a different name, company, or role keyword.
              </p>
            </div>
          ) : (
            recipients.map((recipient) => {
              const isRowPending =
                createConversationMutation.isPending &&
                selectedUserId === recipient.userId;

              return (
                <button
                  key={recipient.userId}
                  type="button"
                  onClick={() => handleSelectRecipient(recipient.userId)}
                  disabled={createConversationMutation.isPending}
                  className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left transition-colors hover:bg-teal-50/50 disabled:opacity-60 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      name={recipient.name}
                      src={recipient.avatarUrl ?? undefined}
                      size="md"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-900">
                        {recipient.name}
                      </p>
                      <p className="truncate text-[11px] text-slate-500">
                        {recipient.headline}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-700">
                    {isRowPending ? (
                      <>
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-teal-700 border-t-transparent" />
                        <span>Opening...</span>
                      </>
                    ) : (
                      <>
                        <MessageSquarePlus className="h-3.5 w-3.5" />
                        <span>Message</span>
                      </>
                    )}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {hasSearchQuery &&
          !isSearching &&
          totalMatches !== undefined &&
          totalMatches > recipients.length && (
            <p className="text-[11px] text-slate-400 text-center">
              Showing top {recipients.length} matches — refine your search to
              narrow results.
            </p>
          )}

        <div className="flex justify-end pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={createConversationMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
