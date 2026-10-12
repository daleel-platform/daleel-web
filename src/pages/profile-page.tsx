import { Text } from '@/components/text';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';

export function ProfilePage() {
  const { data: user } = useCurrentUser();

  return (
    <main className="mx-auto max-w-4xl px-8 py-10">
      <div>
        <Text variant="h1">My Profile</Text>
        <Text variant="muted" className="mt-1">
          Manage your account information and preferences.
        </Text>
      </div>

      <div className="border-border bg-surface mt-8 rounded-xl border p-6 space-y-4">
        <div>
          <Text variant="caption">Full Name</Text>
          <Text variant="body" className="font-medium mt-0.5">
            {user?.name || '—'}
          </Text>
        </div>

        <div>
          <Text variant="caption">Email Address</Text>
          <Text variant="body" className="font-medium mt-0.5">
            {user?.email || '—'}
          </Text>
        </div>

        {user?.bio && (
          <div>
            <Text variant="caption">Bio</Text>
            <Text variant="body" className="mt-0.5">
              {user.bio}
            </Text>
          </div>
        )}

        {user?.interests && user.interests.length > 0 && (
          <div>
            <Text variant="caption">Interests</Text>
            <div className="flex flex-wrap gap-2 mt-1">
              {user.interests.map((interest) => (
                <span
                  key={interest}
                  className="bg-secondary/10 text-secondary text-xs px-2.5 py-1 rounded-full font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
