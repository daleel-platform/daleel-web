import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { ArrowRight, Lock, Mail, Star } from 'lucide-react';

import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { DaleelLogo } from '@/components/logo';
import { Text } from '@/components/text';
import { TextInput } from '@/components/text-input';
import { ROUTES } from '@/routes/paths';
import { useLogin } from '@/features/auth/hooks/use-login';
import {
  loginSchema,
  type LoginFormData,
} from '@/features/auth/schemas/auth.schemas';
import type { ApiError } from '@/api/errors';

export function LoginPage() {
  const [formError, setFormError] = useState('');
  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setFormError('');
    mutate(data, {
      onError: (error) => {
        const apiError = error as ApiError;
        setFormError(apiError.message || 'Invalid email or password');
      },
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Column: Brand & Testimonial Showcase */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-teal-800 via-teal-900 to-slate-950 p-12 text-white lg:flex">
        {/* Ambient glow */}
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10">
          <Link to={ROUTES.HOME} className="inline-block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-xs">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-amber-400"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    className="opacity-40"
                    strokeWidth="1.5"
                  />
                  <polygon
                    points="12 4 15 12 12 10 9 12"
                    fill="#F59E0B"
                    stroke="#F59E0B"
                    strokeWidth="1"
                  />
                  <polygon
                    points="12 20 15 12 12 14 9 12"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="opacity-70 text-white"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white font-sans">
                  Daleel
                </span>
                <span className="text-[10px] text-teal-200">دليل</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Quote & Value Proposition */}
        <div className="relative z-10 my-auto max-w-lg">
          <Badge variant="accent" size="sm" className="mb-4">
            Mentee Success Story
          </Badge>
          <blockquote className="text-2xl font-semibold text-white/95 leading-relaxed tracking-tight">
            "Connecting with a Staff Engineer on Daleel helped me transition
            from individual contributor to tech lead in under six months."
          </blockquote>

          <div className="mt-8 flex items-center gap-4">
            <Avatar
              name="Karim Soliman"
              size="lg"
              className="ring-2 ring-white/20"
            />
            <div>
              <p className="font-bold text-white text-sm">Karim Soliman</p>
              <p className="text-xs text-teal-200">Tech Lead at Instabug</p>
              <div className="mt-1 flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Strip */}
        <div className="relative z-10 flex items-center gap-8 border-t border-white/10 pt-6 text-xs text-teal-100">
          <div>
            <span className="block text-lg font-bold text-white">500+</span>
            <span className="text-teal-300">Vetted Mentors</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <span className="block text-lg font-bold text-white">12,000+</span>
            <span className="text-teal-300">Sessions Booked</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <span className="block text-lg font-bold text-white">98%</span>
            <span className="text-teal-300">Satisfaction Rate</span>
          </div>
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile brand logo */}
          <div className="mb-8 lg:hidden">
            <Link to={ROUTES.HOME}>
              <DaleelLogo size="md" />
            </Link>
          </div>

          <div className="mb-8">
            <Text variant="h1">Welcome back</Text>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to your Daleel account to continue your mentorship
              journey.
            </p>
          </div>

          {formError && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700 animate-in fade-in">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <TextInput
                id="email"
                label="Email Address"
                type="email"
                placeholder="name@company.com"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div>
              <TextInput
                id="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded-md border-slate-300 text-teal-700 focus:ring-teal-600 cursor-pointer"
                />
                <span className="text-xs text-slate-600 font-medium">
                  Remember me
                </span>
              </label>

              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              loading={isPending}
              variant="primary"
              className="mt-6 w-full"
              rightIcon={
                !isPending ? <ArrowRight className="h-4 w-4" /> : undefined
              }
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <Link
                to={ROUTES.REGISTER}
                className="font-semibold text-teal-700 hover:text-teal-800 hover:underline transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
