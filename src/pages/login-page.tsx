import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import { ROUTES } from '@/routes/paths';
import { apiClient } from '@/api/client';
import { AUTH_TOKEN_STORAGE_KEY } from '@/config/constants';

interface AuthResponse {
  accessToken: string;
  user: any;
}

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      apiClient.post<AuthResponse>('/auth/login', credentials),
    onSuccess: (data) => {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, data.accessToken);
      localStorage.setItem('userData', JSON.stringify(data.user));
      navigate(ROUTES.DASHBOARD);
    },
    onError: (error: any) => {
      setEmailError(error.message || 'Invalid email or password');
    },
  });

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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEmailError('');

              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(email)) {
                setEmailError('Please enter a valid email address');
                return;
              }

              mutation.mutate({ email, password });
            }}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <TextInput
                id="email"
                type="email"
                value={email}
                placeholder="name@example.com"
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <TextInput
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="mt-6 w-full"
            >
              {mutation.isPending ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center space-x-4">
            <span className="h-px w-full bg-gray-200"></span>
            <span className="text-sm text-gray-500">or</span>
            <span className="h-px w-full bg-gray-200"></span>
          </div>

          <Button
            type="button"
            onClick={() => {
              navigate(ROUTES.DASHBOARD);
            }}
            className="mt-6 flex w-full items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="h-5 w-5"
            />
            Sign in with Google
          </Button>

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
