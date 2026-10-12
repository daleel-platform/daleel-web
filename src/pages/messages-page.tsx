import { Text } from '@/components/text';

export function MessagesPage() {
  return (
    <main className="mx-auto max-w-4xl px-8 py-10">
      <div>
        <Text variant="h1">Messages</Text>
        <Text variant="muted" className="mt-1">
          Chat directly with your mentors and mentees.
        </Text>
      </div>

      <div className="border-border bg-surface mt-8 rounded-xl border p-8 text-center">
        <Text variant="h3">Inbox</Text>
        <Text variant="muted" className="mt-2">
          Direct messaging is currently under development.
        </Text>
      </div>
    </main>
  );
}
