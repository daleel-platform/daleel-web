import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useResetPassword } from '@/features/auth/hooks/use-reset-password';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { TextInput } from '@/components/text-input';

export function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [searchParams] = useSearchParams();
  const [tokenError, setTokenError] = useState('');

  const {
    mutate: submitResetPassword,
    isPending,
    isSuccess,
    error,
  } = useResetPassword();

  const apiError =
    error instanceof ApiError
      ? error.statusCode === 400 || error.statusCode === 401
        ? 'This reset link is invalid, expired, or has already been used.'
        : error.message
      : error
        ? 'Something went wrong. Please try again.'
        : '';

  const submitError = tokenError || apiError;
  const token = searchParams.get('token');
  function handleSubmit() {
    setPasswordError('');
    setConfirmPasswordError('');
    setTokenError('');

    if (!token) {
      setTokenError('Reset token is missing from the URL.');
      return;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must be at least 8 characters and include 1 uppercase letter, 1 number, and 1 special character',
      );
      return;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Confirm Password is required');
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    submitResetPassword({ password, token });
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md">
        <Text variant="h1">Password reset successfully</Text>
        <Text variant="body-sm" className="mt-2">
          Your password has been reset. You can now log in with your new
          password.
        </Text>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <Text variant="h1">Reset your password</Text>
      <Text variant="body-sm" className="mt-2">
        Enter your new password below.
      </Text>
      <div className="mt-6 space-y-4">
        <TextInput
          label="New Password"
          type="password"
          placeholder="Enter your new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
        />
        <TextInput
          label="Confirm Password"
          type="password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={confirmPasswordError}
        />
      </div>
      {submitError && (
        <div className="mt-4 rounded-lg border border-error px-4 py-3">
          <Text variant="body-sm" className="text-error">
            {submitError}
          </Text>
        </div>
      )}

      <Button
        className="mt-4 w-full"
        loading={isPending}
        onClick={handleSubmit}
      >
        Reset Password
      </Button>
    </div>
  );
}
