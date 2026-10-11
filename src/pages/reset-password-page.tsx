import { useSearchParams } from 'react-router';
import { Text } from '@/components/text';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <Text variant="h1">Invalid reset link</Text>
          <Text variant="body-sm" className="mt-2">
            The reset token is missing from the URL.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <ResetPasswordForm />
    </div>
  );
}
