import { useState } from 'react';
import { Link } from 'react-router';
import { apiClient } from '@/api/client';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { TextInput } from '@/components/text-input';
import { ROUTES } from '@/routes/paths';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  async function handleSubmit() {
    setEmailError('');
    setSubmitError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError('Invalid email address');
      return;
    }

    try {
      setIsLoading(true);

      await apiClient.post<{ message: string }>('/auth/forgot-password', {
        email: email.trim(),
      });

      setIsSuccess(true);
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
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
      <div className="mt-6">
        <TextInput
          label="Email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={emailError}
        />
      </div>
      {submitError && (
        <Text variant="body-sm" className="mt-4 text-red-600">
          {submitError}
        </Text>
      )}
      <Button
        className="mt-6 w-full"
        loading={isLoading}
        onClick={handleSubmit}
      >
        Send reset link
      </Button>
      <Link
        to={ROUTES.LOGIN}
        className="mt-4 block text-center text-sm text-primary hover:underline"
      >
        Back to login
      </Link>
    </div>
  );
}
