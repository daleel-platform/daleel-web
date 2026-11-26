import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Copy, Check, MessageSquarePlus } from 'lucide-react';
import { Modal } from '@/components/modal';
import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import { useToast } from '@/hooks/use-toast';
import {
  createConversationSchema,
  type CreateConversationFormData,
} from '../schemas/chat.schemas';
import { useCreateConversation } from '../hooks/use-create-conversation';

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
  const [copied, setCopied] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const createConversationMutation = useCreateConversation();
  const toast = useToast();

  const schema = useMemo(
    () => createConversationSchema(currentUserId),
    [currentUserId],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateConversationFormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      recipientId: '',
    },
  });

  const handleClose = () => {
    reset();
    setServerError(null);
    onClose();
  };

  const handleCopyMyId = async () => {
    if (!currentUserId) return;
    try {
      await navigator.clipboard.writeText(currentUserId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Unable to copy User ID to clipboard.');
    }
  };

  const onSubmit = (data: CreateConversationFormData) => {
    setServerError(null);
    createConversationMutation.mutate(data.recipientId, {
      onSuccess: (conversation) => {
        onConversationCreated(conversation.id);
        handleClose();
      },
      onError: (err) => {
        setServerError(
          err.message ||
            'Failed to start conversation. Please verify the User ID.',
        );
      },
    });
  };

  const isPending = isSubmitting || createConversationMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Start New Conversation"
      description="Connect and chat directly with another user or mentor."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        {/* Current User ID Reference */}
        <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-3">
          <p className="text-[11px] font-semibold text-teal-800">
            Your User ID
          </p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <code className="text-xs font-mono text-teal-900 truncate">
              {currentUserId || 'Loading...'}
            </code>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => void handleCopyMyId()}
              disabled={!currentUserId}
              leftIcon={
                copied ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )
              }
              className="text-teal-700 hover:text-teal-900 hover:bg-teal-100/60 shrink-0"
            >
              {copied ? 'Copied' : 'Copy ID'}
            </Button>
          </div>
        </div>

        {/* Recipient ID Input */}
        <TextInput
          label="Recipient User ID (UUID)"
          required
          placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
          className="font-mono text-xs bg-slate-50"
          error={errors.recipientId?.message}
          {...register('recipientId', {
            onChange: () => {
              if (serverError) setServerError(null);
            },
          })}
        />

        {serverError && (
          <p
            role="alert"
            className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100"
          >
            {serverError}
          </p>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={isPending}
            leftIcon={<MessageSquarePlus className="h-3.5 w-3.5" />}
          >
            Start Chat
          </Button>
        </div>
      </form>
    </Modal>
  );
}
