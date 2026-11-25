import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router';
import { ArrowRight, Briefcase, Link as LinkIcon } from 'lucide-react';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { DaleelLogo } from '@/components/logo';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/card';
import { TextInput } from '@/components/text-input';
import { useToast } from '@/hooks/use-toast';
import { ROUTES } from '@/routes/paths';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useCreateMentorProfile } from '../hooks/use-create-mentor-profile';
import {
  mentorOnboardingSchema,
  type MentorOnboardingFormData,
} from '../schemas/onboarding.schemas';
import { InterestSelector } from './interest-selector';

export function MentorOnboardingWizard() {
  const navigate = useNavigate();
  const toast = useToast();
  const { data: user } = useCurrentUser();
  const createMentorMutation = useCreateMentorProfile();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MentorOnboardingFormData>({
    resolver: zodResolver(mentorOnboardingSchema),
    mode: 'onTouched',
    defaultValues: {
      headline: '',
      skills: [],
      about: '',
      linkedinUrl: '',
    },
  });

  const aboutValue = useWatch({ control, name: 'about' }) ?? '';
  const watchedSkills = useWatch({ control, name: 'skills' }) ?? [];

  const onSubmit = (data: MentorOnboardingFormData) => {
    createMentorMutation.mutate(
      {
        headline: data.headline,
        yearsOfExperience: data.yearsOfExperience,
        skills: data.skills,
        about: data.about,
        linkedinUrl: data.linkedinUrl || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Your mentor profile is live!');
          navigate(ROUTES.PROFILE, { replace: true });
        },
      },
    );
  };

  return (
    <Card className="max-w-2xl w-full p-6 sm:p-8 shadow-sm border border-slate-200/90 rounded-3xl bg-white">
      <CardHeader className="text-center pb-6">
        <div className="mb-4 flex justify-center">
          <Link
            to={ROUTES.HOME}
            className="hover:opacity-90 transition-opacity"
            title="Daleel Home"
          >
            <DaleelLogo size="md" />
          </Link>
        </div>

        <Badge variant="accent" size="sm" className="mx-auto mb-3">
          Mentor Onboarding
        </Badge>
        <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900">
          {user?.name
            ? `Ready to guide others, ${user.name.split(' ')[0]}?`
            : 'Ready to guide others?'}
        </CardTitle>
        <CardDescription className="text-sm text-slate-600 max-w-md mx-auto mt-1">
          Tell mentees who you are and what you can help with. This becomes your
          public mentor profile.
        </CardDescription>
      </CardHeader>

      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Milestone 01: Professional Identity */}
          <div className="rounded-2xl border border-teal-100/90 bg-gradient-to-r from-teal-50/60 via-white to-amber-50/30 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-teal-100/60">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-extrabold text-white shadow-2xs">
                01
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Professional Identity
              </span>
              <span className="text-red-500 font-bold text-xs">*</span>
            </div>

            <TextInput
              label="Professional Headline"
              required
              placeholder="e.g. Senior Backend Engineer at Fawry"
              leftIcon={<Briefcase className="h-4 w-4" />}
              error={errors.headline?.message}
              {...register('headline')}
            />

            <TextInput
              label="Years of Experience"
              required
              type="number"
              min={1}
              max={60}
              placeholder="e.g. 5"
              error={errors.yearsOfExperience?.message}
              {...register('yearsOfExperience', { valueAsNumber: true })}
            />
          </div>

          {/* Milestone 02: Mentoring Topics */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-extrabold text-white shadow-2xs">
                  02
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Topics You Can Mentor On
                </span>
                <span className="text-red-500 font-bold text-xs">*</span>
              </div>
              <Badge
                variant={
                  watchedSkills.length === 5
                    ? 'accent'
                    : watchedSkills.length > 0
                      ? 'primary'
                      : 'default'
                }
                size="sm"
              >
                {watchedSkills.length}/5 topics selected
              </Badge>
            </div>

            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <InterestSelector
                  selectedInterests={field.value}
                  onChange={field.onChange}
                  error={errors.skills?.message}
                  hideHeader
                />
              )}
            />
          </div>

          {/* Milestone 03: About & LinkedIn */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-extrabold text-white shadow-2xs">
                  03
                </span>
                <label
                  htmlFor="mentor-about"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700 cursor-pointer"
                >
                  About You as a Mentor
                </label>
                <span className="text-red-500 font-bold text-xs">*</span>
              </div>
              <span className="text-[11px] font-medium text-slate-400">
                {aboutValue.length}/1000
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Share your background, how you like to mentor, and what mentees
              can expect from a session with you.
            </p>

            <textarea
              id="mentor-about"
              rows={4}
              {...register('about')}
              aria-describedby={errors.about ? 'mentor-about-error' : undefined}
              aria-invalid={Boolean(errors.about)}
              placeholder="e.g. 8 years building payment systems. I help engineers prepare for system design interviews and grow into senior roles."
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all resize-none leading-relaxed"
            />
            {errors.about && (
              <p
                id="mentor-about-error"
                className="text-xs text-red-600 font-medium"
              >
                {errors.about.message}
              </p>
            )}

            <TextInput
              label="LinkedIn Profile (Optional)"
              type="url"
              placeholder="https://www.linkedin.com/in/your-name"
              leftIcon={<LinkIcon className="h-4 w-4" />}
              error={errors.linkedinUrl?.message}
              {...register('linkedinUrl')}
            />
          </div>

          {createMentorMutation.isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {createMentorMutation.error?.message ||
                'Failed to create your mentor profile. Please try again.'}
            </div>
          )}
        </CardContent>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => navigate(ROUTES.MENTORS, { replace: true })}
            disabled={createMentorMutation.isPending}
            className="text-slate-500 hover:text-slate-800"
          >
            Maybe later
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={createMentorMutation.isPending}
            loading={createMentorMutation.isPending}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Publish Mentor Profile
          </Button>
        </div>
      </form>
    </Card>
  );
}
