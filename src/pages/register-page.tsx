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

export function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'mentee' | 'mentor'>('mentee');

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [globalError, setGlobalError] = useState('');

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (userData: any) =>
      apiClient.post<AuthResponse>('/auth/register', userData),
    onSuccess: (data) => {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, data.accessToken);
      localStorage.setItem('userData', JSON.stringify(data.user));
      navigate(ROUTES.DASHBOARD);
    },
    onError: (error: any) => {
      setGlobalError(
        error.message || 'Something went wrong. Please try again later.',
      );
    },
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '', confirmPassword: '' };

    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'name@example.com';
      isValid = false;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|;:,.<>?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password =
        'At least 8 characters, 1 uppercase, 1 number, and 1 special character';
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true, confirmPassword: true });

    if (validateForm()) {
      setGlobalError('');

      mutation.mutate({
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      <div className="hidden w-1/2 flex-col items-center justify-center bg-gray-50 p-12 lg:flex">
        <div className="max-w-md text-center">
          <Text variant="h1" className="mb-6 text-primary">
            Start Your Journey Today
          </Text>
          <Text variant="body" className="text-gray-600">
            Whether you're ready to share your expertise as a Mentor or eager to
            learn as a Mentee, your next career chapter starts here.
          </Text>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <Text variant="h1">Create an Account</Text>
            <Text variant="body-sm" className="mt-2 text-gray-500">
              Sign up now to start connecting.
            </Text>
          </div>

          {globalError && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                I want to join as a:
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="mentee"
                    checked={role === 'mentee'}
                    onChange={(e) =>
                      setRole(e.target.value as 'mentee' | 'mentor')
                    }
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Mentee</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="mentor"
                    checked={role === 'mentor'}
                    onChange={(e) =>
                      setRole(e.target.value as 'mentee' | 'mentor')
                    }
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Mentor</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label
                  htmlFor="firstName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <TextInput
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="lastName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <TextInput
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <TextInput
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateForm();
                }}
                onBlur={() => handleBlur('email')}
                required
              />
              {touched.email && errors.email && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.email}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <TextInput
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validateForm();
                }}
                onBlur={() => handleBlur('password')}
                required
              />
              {touched.password && errors.password && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.password}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <TextInput
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateForm();
                }}
                onBlur={() => handleBlur('confirmPassword')}
                required
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className={`mt-4 w-full flex items-center justify-center ${mutation.isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {mutation.isPending ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center space-x-4">
            <span className="h-px w-full bg-gray-200"></span>
            <span className="text-sm text-gray-500">or</span>
            <span className="h-px w-full bg-gray-200"></span>
          </div>

          <Button
            type="button"
            disabled={mutation.isPending}
            onClick={() => {
              navigate(ROUTES.DASHBOARD);
            }}
            className="mt-6 flex w-full items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="h-5 w-5"
            />
            Sign up with Google
          </Button>

          <div className="mt-8 text-center">
            <Text variant="body-sm" className="text-gray-600">
              Already have an account?{' '}
              <Link
                to={ROUTES.LOGIN}
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
