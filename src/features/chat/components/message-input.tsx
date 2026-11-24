import { useState, useRef, type FormEvent, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/button';

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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSending || disabled) return;

    try {
      setIsSending(true);
      await onSendMessage(trimmed);
      setText('');
      inputRef.current?.focus();
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit();
    }
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="border-t border-slate-200 p-3 sm:p-4 bg-white flex items-center gap-2"
    >
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
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
  );
}
