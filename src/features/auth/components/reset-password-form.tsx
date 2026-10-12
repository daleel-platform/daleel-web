import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useResetPassword } from '@/features/auth/hooks/use-reset-password';
import { PasswordRulesList } from '@/features/auth/components/password-rules-list';
import { isPasswordValid } from '@/features/auth/utils/password-validator';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { TextInput } from '@/components/text-input';
import { ROUTES } from '@/routes/paths';

export function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });
  const [searchParams] = useSearchParams();
  const [tokenError, setTokenError] = useState('');
  const navigate = useNavigate();

  const {
    mutate: submitResetPassword,
    isPending,
    isSuccess,
    error,
  } = useResetPassword();

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
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

  // Live validation
  const errors = useMemo(() => {
    const errs = { password: '', confirmPassword: '' };

    if (!password) {
      errs.password = 'Password is required';
    } else if (!isPasswordValid(password)) {
      errs.password = 'Password does not meet all requirements';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    return errs;
  }, [password, confirmPassword]);

  const confirmPasswordError =
    (touched.confirmPassword || confirmPassword.length > 0) &&
    errors.confirmPassword
      ? errors.confirmPassword
      : undefined;

  const passwordError =
    touched.password && errors.password ? errors.password : undefined;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    setTokenError('');

    if (!token) {
      setTokenError('Reset token is missing from the URL.');
      return;
    }

    if (!isPasswordValid(password) || password !== confirmPassword) {
      return;
    }

    submitResetPassword({ password, token });
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <Text variant="h1">Password reset successfully</Text>
        <Text variant="body-sm" className="mt-2 text-gray-600">
          Your password has been updated. Redirecting to sign in...
        </Text>
        <div className="mt-6">
          <Link to={ROUTES.LOGIN}>
            <Button className="w-full">Proceed to Sign In Now</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <Text variant="h1">Reset your password</Text>
      <Text variant="body-sm" className="mt-2 text-gray-500">
        Enter your new password below.
      </Text>

      {submitError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <TextInput
            label="New Password"
            type="password"
            placeholder="Enter your new password"
            value={password}
            error={passwordError}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, password: true }))}
            required
          />
          {password.length > 0 && <PasswordRulesList password={password} />}
        </div>

        <div>
          <TextInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            error={confirmPasswordError}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, confirmPassword: true }))}
            required
          />
        </div>

        <Button type="submit" className="mt-6 w-full" disabled={isPending}>
          {isPending ? 'Resetting Password...' : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
}
