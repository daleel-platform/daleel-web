import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import { ROUTES } from '@/routes/paths';
import { useRegister } from '@/features/auth/hooks/use-register';
import { PasswordRulesList } from '@/features/auth/components/password-rules-list';
import {
  registerSchema,
  type RegisterFormData,
} from '@/features/auth/schemas/auth.schemas';
import type { ApiError } from '@/api/errors';

export function RegisterPage() {
  const [globalError, setGlobalError] = useState('');
  const { mutate, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = useWatch({ control, name: 'password' }) ?? '';

  const onSubmit = (data: RegisterFormData) => {
    setGlobalError('');

    mutate(
      {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        password: data.password,
      },
      {
        onError: (error) => {
          const apiError = error as ApiError;
          setGlobalError(
            apiError.message || 'Something went wrong. Please try again later.',
          );
        },
      },
    );
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4">
              <div className="w-1/2">
                <TextInput
                  label="First Name"
                  type="text"
                  id="firstName"
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
              </div>
              <div className="w-1/2">
                <TextInput
                  label="Last Name"
                  type="text"
                  id="lastName"
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>
            </div>

            <div>
              <TextInput
                label="Email Address"
                type="email"
                id="email"
                placeholder="name@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div>
              <TextInput
                label="Password"
                type="password"
                id="password"
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
                id="confirmPassword"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>

            <Button type="submit" loading={isPending} className="mt-4 w-full">
              {isPending ? 'Creating Account...' : 'Create Account'}
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
