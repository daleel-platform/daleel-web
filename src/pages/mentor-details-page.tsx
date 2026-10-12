import { useParams, Link } from 'react-router';
import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { ROUTES } from '@/routes/paths';

export function MentorDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <main className="mx-auto max-w-4xl px-8 py-10">
      <Link to={ROUTES.MENTORS} className="mb-6 inline-block">
        <Button variant="ghost" size="sm">
          ← Back to Mentors
        </Button>
      </Link>

      <div>
        <Text variant="h1">Mentor Profile</Text>
        <Text variant="muted" className="mt-1">
          Viewing mentor profile for ID: {id}
        </Text>
      </div>

      <div className="border-border bg-surface mt-8 rounded-xl border p-8 text-center">
        <Text variant="h3">Mentor Profile Details Coming Soon</Text>
        <Text variant="muted" className="mt-2">
          Experience, reviews, and availability will be displayed here.
        </Text>
      </div>
    </main>
  );
}
