import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { ArrowLeft, CheckCircle2, KeyRound, Mail } from 'lucide-react';

import { ApiError } from '@/api/errors';
import { useForgotPassword } from '@/features/auth/hooks/use-forgot-password';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/features/auth/schemas/auth.schemas';
import { Button } from '@/components/button';
import { DaleelLogo } from '@/components/logo';
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
      <div className="w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-lg shadow-slate-200/50 text-center animate-in fade-in">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 border border-teal-200/80">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <Text variant="h2">Check your email</Text>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          We sent a password reset link to your email address. Please follow the
          instructions to choose a new password.
        </p>

        <div className="mt-8">
          <Link to={ROUTES.LOGIN} className="block">
            <Button variant="primary" className="w-full">
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-lg shadow-slate-200/50 animate-in fade-in">
      <div className="mb-6 flex justify-center">
        <DaleelLogo size="md" />
      </div>

      <div className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
          <KeyRound className="h-6 w-6" />
        </div>
        <Text variant="h2">Forgot password?</Text>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          Enter your registered email address and we will send you a secure link
          to reset your credentials.
        </p>
      </div>

      {submitError && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <TextInput
            label="Email Address"
            type="email"
            id="email"
            placeholder="name@company.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <Button
          type="submit"
          className="mt-6 w-full"
          variant="primary"
          loading={isPending}
          disabled={isPending}
        >
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 text-center border-t border-slate-100 pt-6">
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to sign in</span>
        </Link>
      </div>
    </div>
  );
}
