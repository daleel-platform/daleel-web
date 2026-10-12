import { Link } from 'react-router';
import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { ROUTES } from '@/routes/paths';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Text variant="h1" className="text-6xl font-bold">
        404
      </Text>
      <Text variant="h3" className="mt-4">
        Page Not Found
      </Text>
      <Text variant="muted" className="mt-2 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </Text>
      <Link to={ROUTES.HOME} className="mt-6">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
