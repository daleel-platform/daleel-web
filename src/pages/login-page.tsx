import { Link } from 'react-router';
import { Text } from '@/components/text';
import { ROUTES } from '@/routes/paths';

// Temporary login page until the login feature is implemented.
export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <Text variant="h1">Login</Text>

        <Text variant="body-sm" className="mt-2">
          Login UI will be implemented in the login/signup task.
        </Text>

        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="mt-6 block text-sm text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
