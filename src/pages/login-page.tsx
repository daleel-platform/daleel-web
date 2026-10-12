import { useState } from 'react';
import { Link } from 'react-router';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import { ROUTES } from '@/routes/paths';
import { useLogin } from '@/features/auth/hooks/use-login';
import type { ApiError } from '@/api/errors';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });

  const { mutate, isPending } = useLogin();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (formError) setFormError('');
    if (touched.email) {
      if (!value.trim()) {
        setEmailError('Email address is required');
      } else if (!emailRegex.test(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (formError) setFormError('');
    if (touched.password) {
      if (!value) {
        setPasswordError('Password is required');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    if (!email.trim()) {
      setEmailError('Email address is required');
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
    if (!password) {
      setPasswordError('Password is required');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setFormError('');

    let hasError = false;

    if (!email.trim()) {
      setEmailError('Email address is required');
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) return;

    mutate(
      { email, password },
      {
        onError: (error) => {
          const apiError = error as ApiError;
          setFormError(apiError.message || 'Invalid email or password');
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      <div className="hidden w-1/2 flex-col items-center justify-center bg-gray-50 p-12 lg:flex">
        <div className="max-w-md text-center">
          <Text variant="h1" className="mb-6 text-primary">
            Daleel Platform
          </Text>
          <Text variant="body" className="text-gray-600">
            Grow faster with someone who's been where you want to go.
          </Text>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <Text variant="h1">Welcome Back!</Text>
            <Text variant="body-sm" className="mt-2 text-gray-500">
              Please enter your details to sign in.
            </Text>
          </div>

          {formError && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <TextInput
                id="email"
                label="Email Address"
                type="email"
                value={email}
                placeholder="name@example.com"
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={handleEmailBlur}
                error={emailError}
                required
              />
            </div>

            <div>
              <TextInput
                id="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onBlur={handlePasswordBlur}
                error={passwordError}
                required
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" disabled={isPending} className="mt-6 w-full">
              {isPending ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Text variant="body-sm" className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to={ROUTES.REGISTER}
                className="font-semibold text-primary hover:underline"
              >
                Sign up
              </Link>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
