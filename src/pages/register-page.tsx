import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import { ROUTES } from '@/routes/paths';
import { useRegister } from '@/features/auth/hooks/use-register';
import { PasswordRulesList } from '@/features/auth/components/password-rules-list';
import { isPasswordValid } from '@/features/auth/utils/password-validator';
import type { ApiError } from '@/api/errors';

export function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'mentee' | 'mentor'>('mentee');

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [globalError, setGlobalError] = useState('');

  const { mutate, isPending } = useRegister();

  // Pure live validation derived from state
  const errors = useMemo(() => {
    const errs = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!firstName.trim()) {
      errs.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      errs.lastName = 'Last name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

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
  }, [firstName, lastName, email, password, confirmPassword]);

  const isValid = !Object.values(errors).some(Boolean);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (isValid) {
      setGlobalError('');

      mutate(
        {
          name: `${firstName} ${lastName}`.trim(),
          email,
          password,
        },
        {
          onError: (error) => {
            const apiError = error as ApiError;
            setGlobalError(
              apiError.message ||
                'Something went wrong. Please try again later.',
            );
          },
        },
      );
    }
  };

  // Live confirm password error: show immediately if typed or blurred
  const confirmPasswordError =
    (touched.confirmPassword || confirmPassword.length > 0) &&
    errors.confirmPassword
      ? errors.confirmPassword
      : undefined;

  // Live password error: show after blur if invalid
  const passwordError =
    touched.password && errors.password ? errors.password : undefined;

  // Live email error: show if touched and invalid
  const emailError = touched.email && errors.email ? errors.email : undefined;

  const firstNameError =
    touched.firstName && errors.firstName ? errors.firstName : undefined;

  const lastNameError =
    touched.lastName && errors.lastName ? errors.lastName : undefined;

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
                <TextInput
                  label="First Name"
                  type="text"
                  id="firstName"
                  value={firstName}
                  error={firstNameError}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (globalError) setGlobalError('');
                  }}
                  onBlur={() => handleBlur('firstName')}
                  required
                />
              </div>
              <div className="w-1/2">
                <TextInput
                  label="Last Name"
                  type="text"
                  id="lastName"
                  value={lastName}
                  error={lastNameError}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (globalError) setGlobalError('');
                  }}
                  onBlur={() => handleBlur('lastName')}
                  required
                />
              </div>
            </div>

            <div>
              <TextInput
                label="Email Address"
                type="email"
                id="email"
                placeholder="name@example.com"
                value={email}
                error={emailError}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (globalError) setGlobalError('');
                }}
                onBlur={() => handleBlur('email')}
                required
              />
            </div>

            <div>
              <TextInput
                label="Password"
                type="password"
                id="password"
                value={password}
                error={passwordError}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (globalError) setGlobalError('');
                }}
                onBlur={() => handleBlur('password')}
                required
              />
              {password.length > 0 && <PasswordRulesList password={password} />}
            </div>

            <div>
              <TextInput
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                error={confirmPasswordError}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (globalError) setGlobalError('');
                }}
                onBlur={() => handleBlur('confirmPassword')}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className={`mt-4 w-full flex items-center justify-center ${
                isPending ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isPending ? (
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

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
