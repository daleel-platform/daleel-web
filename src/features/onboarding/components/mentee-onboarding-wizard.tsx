import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { Sparkles, ArrowRight, User as UserIcon } from 'lucide-react';

import { Button } from '@/components/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/card';
import { ROUTES } from '@/routes/paths';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useUpdateMenteeProfile } from '../hooks/use-update-mentee-profile';
import {
  menteeOnboardingSchema,
  type MenteeOnboardingFormData,
} from '../schemas/onboarding.schemas';
import { markOnboardingDismissed } from '../utils/onboarding-storage';
import { InterestSelector } from './interest-selector';

export function MenteeOnboardingWizard() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const updateProfileMutation = useUpdateMenteeProfile();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MenteeOnboardingFormData>({
    resolver: zodResolver(menteeOnboardingSchema),
    mode: 'onTouched',
    defaultValues: {
      interests: user?.interests ?? [],
      bio: user?.bio ?? '',
    },
  });

  const bioValue = useWatch({ control, name: 'bio' }) ?? '';

  const handleSkip = () => {
    markOnboardingDismissed(user?.id);
    navigate(ROUTES.MENTORS, { replace: true });
  };

  const onSubmit = (data: MenteeOnboardingFormData) => {
    if (!user?.id) return;

    updateProfileMutation.mutate(
      {
        userId: user.id,
        data: {
          interests: data.interests,
          bio: data.bio.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          markOnboardingDismissed(user.id);
          navigate(ROUTES.MENTORS, { replace: true });
        },
      },
    );
  };

  return (
    <Card className="max-w-2xl w-full p-8 shadow-sm border border-slate-200/90 rounded-3xl bg-white">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-8 ring-teal-50/50">
          <Sparkles className="h-6 w-6 text-amber-500" />
        </div>
        <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900">
          {user?.name
            ? `Welcome to Daleel, ${user.name.split(' ')[0]}!`
            : 'Welcome to Daleel!'}
        </CardTitle>
        <CardDescription className="text-sm text-slate-600 max-w-md mx-auto mt-1">
          Personalize your learning journey so our matching engine can connect
          you with the right mentors.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Interests multi-select chips */}
          <Controller
            name="interests"
            control={control}
            render={({ field }) => (
              <InterestSelector
                selectedInterests={field.value}
                onChange={field.onChange}
                error={errors.interests?.message}
              />
            )}
          />

          {/* Short Bio */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="bio"
                className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"
              >
                <UserIcon className="h-3.5 w-3.5 text-teal-700" />
                <span>Short Bio (optional)</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {bioValue.length}/500
              </span>
            </div>
            <textarea
              id="bio"
              rows={3}
              {...register('bio')}
              placeholder="e.g. Junior software developer looking to master distributed systems and prepare for system design interviews."
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors resize-none leading-relaxed"
            />
            {errors.bio && (
              <p className="text-xs text-red-600 font-medium">
                {errors.bio.message}
              </p>
            )}
            <p className="text-[11px] text-slate-500">
              Brief introduction displayed to mentors when you request guidance
              sessions.
            </p>
          </div>

          {updateProfileMutation.isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {updateProfileMutation.error?.message ||
                'Failed to update profile. Please try again.'}
            </div>
          )}
        </CardContent>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handleSkip}
            disabled={updateProfileMutation.isPending}
            className="text-slate-500 hover:text-slate-800"
          >
            Skip for now
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={updateProfileMutation.isPending}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Complete & Discover Mentors
          </Button>
        </div>
      </form>
    </Card>
  );
}
