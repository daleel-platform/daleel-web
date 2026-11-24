import { useState } from 'react';
import { Copy, Check, MessageSquarePlus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Modal } from '@/components/modal';
import { Button } from '@/components/button';
import { createConversation } from '../api/chat.api';
import { chatQueryKeys } from '../hooks/query-keys';
import type { Conversation } from '../types/chat.types';

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  onConversationCreated: (conversationId: string) => void;
}

export function NewConversationModal({
  isOpen,
  onClose,
  currentUserId,
  onConversationCreated,
}: NewConversationModalProps) {
  const queryClient = useQueryClient();
  const [recipientId, setRecipientId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyMyId = async () => {
    if (!currentUserId) return;
    await navigator.clipboard.writeText(currentUserId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = recipientId.trim();
    if (!trimmedId) return;

    if (trimmedId === currentUserId) {
      setErrorMessage('You cannot start a conversation with yourself.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      const conversation = await createConversation(trimmedId);

      // Add to conversation list cache if not exists
      queryClient.setQueryData<Conversation[]>(
        chatQueryKeys.conversations(),
        (oldData) => {
          if (!oldData) return [conversation];
          if (oldData.some((c) => c.id === conversation.id)) return oldData;
          return [conversation, ...oldData];
        },
      );

      onConversationCreated(conversation.id);
      onClose();
      setRecipientId('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(
          'Failed to start conversation. Please verify the User ID.',
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Start New Conversation"
      description="Connect and chat directly with another user or mentor."
      maxWidth="md"
    >
      <form onSubmit={handleStartChat} className="space-y-4 pt-2">
        {/* Current User ID Reference */}
        <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-3">
          <p className="text-[11px] font-semibold text-teal-800">
            Your User ID (Share this with other test accounts):
          </p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <code className="text-xs font-mono text-teal-900 truncate">
              {currentUserId || 'Loading...'}
            </code>
            <button
              type="button"
              onClick={handleCopyMyId}
              disabled={!currentUserId}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 hover:text-teal-900 cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copy ID
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recipient ID Input */}
        <div>
          <label
            htmlFor="recipientId"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Recipient User ID (UUID)
          </label>
          <input
            id="recipientId"
            type="text"
            value={recipientId}
            onChange={(e) => {
              setRecipientId(e.target.value);
              setErrorMessage('');
            }}
            placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-600/10 font-mono"
            required
          />
        </div>

        {errorMessage && (
          <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100">
            {errorMessage}
          </p>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={isLoading}
            disabled={!recipientId.trim()}
            leftIcon={<MessageSquarePlus className="h-3.5 w-3.5" />}
          >
            Start Chat
          </Button>
        </div>
      </form>
    </Modal>
  );
}
