import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { CheckCircle2, KeyRound, Lock } from 'lucide-react';

import { useResetPassword } from '@/features/auth/hooks/use-reset-password';
import { PasswordRulesList } from '@/features/auth/components/password-rules-list';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '@/features/auth/schemas/auth.schemas';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/button';
import { DaleelLogo } from '@/components/logo';
import { Text } from '@/components/text';
import { TextInput } from '@/components/text-input';
import { ROUTES } from '@/routes/paths';

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const [tokenError, setTokenError] = useState('');
  const navigate = useNavigate();

  const {
    mutate: submitResetPassword,
    isPending,
    isSuccess,
    error,
  } = useResetPassword();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = useWatch({ control, name: 'password' }) ?? '';

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const token = searchParams.get('token');

  const apiError =
    error instanceof ApiError
      ? error.statusCode === 400 || error.statusCode === 401
        ? 'This reset link is invalid, expired, or has already been used.'
        : error.message
      : error
        ? 'Something went wrong. Please try again.'
        : '';

  const submitError = tokenError || apiError;

  function onSubmit(data: ResetPasswordFormData) {
    setTokenError('');

    if (!token) {
      setTokenError('Reset token is missing from the URL.');
      return;
    }

    submitResetPassword({ password: data.password, token });
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-lg shadow-slate-200/50 text-center animate-in fade-in">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 border border-teal-200/80">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <Text variant="h2">Password updated</Text>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          Your password has been successfully reset. Redirecting you to sign
          in...
        </p>
        <div className="mt-8">
          <Link to={ROUTES.LOGIN} className="block">
            <Button variant="primary" className="w-full">
              Proceed to Sign In
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
        <Text variant="h2">Set new password</Text>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          Choose a strong password with at least 8 characters.
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
            label="New Password"
            type="password"
            placeholder="Enter your new password"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register('password')}
          />
          {passwordValue.length > 0 && (
            <PasswordRulesList password={passwordValue} />
          )}
        </div>

        <div>
          <TextInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm your new password"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <Button
          type="submit"
          className="mt-6 w-full"
          variant="primary"
          loading={isPending}
          disabled={isPending}
        >
          Reset Password
        </Button>
      </form>

      <div className="mt-6 text-center border-t border-slate-100 pt-6">
        <Link
          to={ROUTES.LOGIN}
          className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline transition-colors"
        >
          Cancel and return to sign in
        </Link>
      </div>
    </div>
  );
}
