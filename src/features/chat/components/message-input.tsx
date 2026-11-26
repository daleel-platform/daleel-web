import { useState, useRef, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/button';

const MAX_MESSAGE_LENGTH = 5000;

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void> | void;
  disabled?: boolean;
}

export function MessageInput({
  onSendMessage,
  disabled = false,
}: MessageInputProps) {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSending || disabled) return;

    try {
      setIsSending(true);
      setSendError(null);
      await onSendMessage(trimmed);
      setText('');
      inputRef.current?.focus();
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'Failed to send message. Please try again.';
      setSendError(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="border-t border-slate-200 p-3 sm:p-4 bg-white">
      {sendError && (
        <p role="alert" className="text-xs text-red-600 mb-2 px-1">
          {sendError}
        </p>
      )}
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={text}
          maxLength={MAX_MESSAGE_LENGTH}
          onChange={(e) => {
            setText(e.target.value);
            if (sendError) setSendError(null);
          }}
          placeholder="Type your message..."
          disabled={disabled || isSending}
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-600/10 disabled:opacity-50"
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!text.trim() || disabled}
          loading={isSending}
          rightIcon={<Send className="h-3.5 w-3.5" />}
        >
          Send
        </Button>
      </form>
    </div>
  );
}
