import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router';
import { ArrowRight, Lock, Mail, Star, User } from 'lucide-react';

import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { DaleelLogo } from '@/components/logo';
import { Text } from '@/components/text';
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
  const [searchParams] = useSearchParams();
  const isMentorIntent = searchParams.get('intent') === 'mentor';
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
      name: '',
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
        name: data.name.trim(),
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
      {/* Left Column: Brand & Value Showcase */}
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
            {isMentorIntent ? 'Mentor Community' : 'Join 10,000+ Professionals'}
          </Badge>
          <blockquote className="text-2xl font-semibold text-white/95 leading-relaxed tracking-tight">
            {isMentorIntent
              ? '"The most rewarding aspect of leadership is seeing someone you guided make breakthroughs they didn\'t think were possible."'
              : '"Mentorship is not about having all the answers — it\'s about asking the right questions and learning from someone who walked the road before."'}
          </blockquote>

          <div className="mt-8 flex items-center gap-4">
            <Avatar
              name={isMentorIntent ? 'Sarah Mansour' : 'Nourhan Magdy'}
              size="lg"
              className="ring-2 ring-white/20"
            />
            <div>
              <p className="font-bold text-white text-sm">
                {isMentorIntent ? 'Sarah Mansour' : 'Nourhan Magdy'}
              </p>
              <p className="text-xs text-teal-200">
                {isMentorIntent
                  ? 'Staff Engineer at Stripe'
                  : 'Product Manager at Fawry'}
              </p>
              <div className="mt-1 flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Checklist */}
        <div className="relative z-10 space-y-2 border-t border-white/10 pt-6 text-xs text-teal-200">
          {isMentorIntent ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Give back and sharpen your leadership skills</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Set your own availability and session rates</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Connect with driven talent across the region</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Free to browse and match with vetted mentors</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">✓</span>
                <span>One account for both learning and mentoring</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Structured 1-on-1 private video sessions</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile brand logo */}
          <div className="mb-8 lg:hidden">
            <Link to={ROUTES.HOME}>
              <DaleelLogo size="md" />
            </Link>
          </div>

          <div className="mb-8">
            <Text variant="h1">
              {isMentorIntent ? 'Apply as a Mentor' : 'Start your journey'}
            </Text>
            <p className="mt-2 text-sm text-slate-500">
              {isMentorIntent
                ? 'Create your account to share your expertise and guide aspiring professionals.'
                : 'Create your account to start discovering mentors tailored to your goals.'}
            </p>
            {/* Subtle intent switcher */}
            <p className="mt-2 text-xs text-slate-500">
              {isMentorIntent ? (
                <>
                  Looking to find a mentor instead?{' '}
                  <Link
                    to={`${ROUTES.REGISTER}?intent=mentee`}
                    replace
                    className="font-medium text-teal-700 hover:text-teal-800 hover:underline transition-colors"
                  >
                    Sign up as mentee
                  </Link>
                </>
              ) : (
                <>
                  Want to share your expertise?{' '}
                  <Link
                    to={`${ROUTES.REGISTER}?intent=mentor`}
                    replace
                    className="font-medium text-teal-700 hover:text-teal-800 hover:underline transition-colors"
                  >
                    Apply as a mentor
                  </Link>
                </>
              )}
            </p>
          </div>

          {globalError && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700 animate-in fade-in">
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <TextInput
                label="Full Name"
                type="text"
                id="name"
                placeholder={
                  isMentorIntent ? 'e.g. Sarah Mansour' : 'e.g. Ali Hassan'
                }
                leftIcon={<User className="h-4 w-4" />}
                error={errors.name?.message}
                {...register('name')}
              />
            </div>

            <div>
              <TextInput
                label="Email Address"
                type="email"
                id="email"
                placeholder="ali@example.com"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div>
              <TextInput
                label="Password"
                type="password"
                id="password"
                placeholder="Create a strong password"
                leftIcon={<Lock className="h-4 w-4" />}
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
                placeholder="Confirm your password"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
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
              {isMentorIntent ? 'Join as Mentor' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link
                to={ROUTES.LOGIN}
                className="font-semibold text-teal-700 hover:text-teal-800 hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
