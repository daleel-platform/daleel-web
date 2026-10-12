import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { ApiError } from '@/api/errors';
import { useForgotPassword } from '@/features/auth/hooks/use-forgot-password';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/features/auth/schemas/auth.schemas';
import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { TextInput } from '@/components/text-input';
import { ROUTES } from '@/routes/paths';

export function ForgotPasswordForm() {
  const {
    mutate: submitForgotPassword,
    isPending,
    isSuccess,
    error,
  } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
    },
  });

  const submitError =
    error instanceof ApiError
      ? error.message
      : error
        ? 'Something went wrong. Please try again.'
        : '';

  function onSubmit(data: ForgotPasswordFormData) {
    submitForgotPassword({ email: data.email.trim() });
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md">
        <Text variant="h1">Check your email</Text>
        <Text variant="body-sm" className="mt-2">
          We have sent a password reset link to your email address. Please check
          your inbox and follow the instructions to reset your password.
        </Text>
        <Link
          to={ROUTES.LOGIN}
          className="mt-4 block text-center text-sm text-primary hover:underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <Text variant="h1">Forgot your password?</Text>
      <Text variant="body-sm" className="mt-2">
        Enter your email address to reset your password.
      </Text>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <div>
          <TextInput
            label="Email"
            type="email"
            placeholder="name@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>
        {submitError && (
          <Text variant="body-sm" className="mt-4 text-red-600">
            {submitError}
          </Text>
        )}
        <Button type="submit" className="mt-6 w-full" loading={isPending}>
          Send reset link
        </Button>
      </form>
      <Link
        to={ROUTES.LOGIN}
        className="mt-4 block text-center text-sm text-primary hover:underline"
      >
        Back to login
      </Link>
    </div>
  );
}
