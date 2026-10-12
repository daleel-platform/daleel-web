import { Text } from '@/components/text';

export function SessionsPage() {
  return (
    <main className="mx-auto max-w-4xl px-8 py-10">
      <div>
        <Text variant="h1">My Sessions</Text>
        <Text variant="muted" className="mt-1">
          Manage your upcoming and past mentorship sessions.
        </Text>
      </div>

      <div className="border-border bg-surface mt-8 rounded-xl border p-8 text-center">
        <Text variant="h3">No upcoming sessions yet</Text>
        <Text variant="muted" className="mt-2">
          Browse mentors and book your first session to get personalized
          guidance.
        </Text>
      </div>
    </main>
  );
}
