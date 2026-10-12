import { Text } from '@/components/text';

export function MentorsPage() {
  return (
    <main className="mx-auto max-w-4xl px-8 py-10">
      <div>
        <Text variant="h1">Mentors</Text>
        <Text variant="muted" className="mt-1">
          Explore and connect with experienced mentors across tech, business,
          and design.
        </Text>
      </div>

      <div className="border-border bg-surface mt-8 rounded-xl border p-8 text-center">
        <Text variant="h3">Mentor Discovery Coming Soon</Text>
        <Text variant="muted" className="mt-2">
          Search, filter, and booking features are under construction.
        </Text>
      </div>
    </main>
  );
}
