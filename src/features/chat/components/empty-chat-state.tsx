import { MessageSquareDashed } from 'lucide-react';

export function EmptyChatState() {
  return (
    <div className="flex-1 hidden md:flex flex-col items-center justify-center p-8 text-center bg-slate-50/20">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-teal-50 text-teal-700 ring-8 ring-teal-50/50 mb-4">
        <MessageSquareDashed className="h-8 w-8" />
      </div>
      <h3 className="text-base font-bold text-slate-900">Your Messages</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">
        Select a conversation from the left to view messages and chat in
        real-time.
      </p>
    </div>
  );
}
