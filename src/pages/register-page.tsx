import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import { ROUTES } from '@/routes/paths';

export function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'mentee' | 'mentor'>('mentee');
  const navigate = useNavigate();

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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: connect to auth
              navigate(ROUTES.DASHBOARD);
            }}
            className="space-y-4"
          >
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
                onChange={(e) => setEmail(e.target.value)}
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
                type="password"
                id="password"
                value={password}
                minLength={8}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="mt-4 w-full">
              Create Account
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
              // TODO: connect to Google auth
              navigate(ROUTES.DASHBOARD);
            }}
            className="mt-6 flex w-full items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
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
