import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router';
import { Camera, Trash2, Sparkles, ArrowRight } from 'lucide-react';

import { Avatar } from '@/components/avatar';
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
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const updateProfileMutation = useUpdateMenteeProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<MenteeOnboardingFormData>({
    resolver: zodResolver(menteeOnboardingSchema),
    mode: 'onTouched',
    defaultValues: {
      interests: user?.interests ?? [],
      bio: user?.bio ?? '',
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const newUrl = URL.createObjectURL(file);
      setValue('file', file, { shouldValidate: true });
      setPreviewUrl(newUrl);
    }
  };

  const handleRemovePhoto = () => {
    setValue('file', undefined, { shouldValidate: true });
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const bioValue = useWatch({ control, name: 'bio' }) ?? '';
  const watchedInterests = useWatch({ control, name: 'interests' }) ?? [];

  const hasPhoto = Boolean(previewUrl || user?.avatarUrl);
  const hasInterests = watchedInterests.length > 0;
  const hasBio = Boolean(bioValue && bioValue.trim().length > 0);

  const completedSteps =
    (hasPhoto ? 1 : 0) + (hasInterests ? 1 : 0) + (hasBio ? 1 : 0);
  const strengthPercentage = Math.round((completedSteps / 3) * 100);

  const handleSkip = () => {
    markOnboardingDismissed(user?.id);
    navigate(ROUTES.MENTORS, { replace: true });
  };

  const onSubmit = (data: MenteeOnboardingFormData) => {
    if (!user?.id) {
      setSubmitError(
        'Unable to save: user profile is not loaded. Please refresh.',
      );
      return;
    }
    setSubmitError(null);

    updateProfileMutation.mutate(
      {
        userId: user.id,
        data: {
          file: data.file,
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
    <Card className="max-w-2xl w-full p-6 sm:p-8 shadow-sm border border-slate-200/90 rounded-3xl bg-white">
      <CardHeader className="text-center pb-6">
        {/* Brand Logo integrated inside the card crown */}
        <div className="mb-4 flex justify-center">
          <Link
            to={ROUTES.HOME}
            className="hover:opacity-90 transition-opacity"
            title="Daleel Home"
          >
            <DaleelLogo size="md" />
          </Link>
        </div>

        <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900">
          {user?.name
            ? `Welcome to Daleel, ${user.name.split(' ')[0]}!`
            : 'Welcome to Daleel!'}
        </CardTitle>
        <CardDescription className="text-sm text-slate-600 max-w-md mx-auto mt-1">
          Personalize your mentorship profile so our matching engine can connect
          you with the right mentors.
        </CardDescription>

        {/* Profile Strength Gamification Bar */}
        <div className="mt-5 max-w-md mx-auto w-full rounded-2xl bg-slate-50/90 border border-slate-200/70 p-3.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-teal-600 animate-pulse" />
              Profile Strength
            </span>
            <span className="text-teal-800 font-bold">
              {strengthPercentage}%
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-600 to-amber-500 transition-all duration-300 ease-out"
              style={{ width: `${strengthPercentage}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>{completedSteps} of 3 sections completed</span>
            <span>
              {hasInterests ? 'Ready to discover' : 'Topics required *'}
            </span>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Milestone 01: Profile Photo */}
          <div className="rounded-2xl border border-teal-100/90 bg-gradient-to-r from-teal-50/60 via-white to-amber-50/30 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-teal-100/60">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-extrabold text-white shadow-2xs">
                  01
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Profile Photo
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  (Optional)
                </span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/70 border border-amber-200/80 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                <Sparkles className="h-2.5 w-2.5 text-amber-600" />
                3× More Replies
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative group">
                <Avatar
                  name={user?.name}
                  src={previewUrl || user?.avatarUrl || undefined}
                  size="xl"
                  className="h-20 w-20 ring-4 ring-white shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-teal-700 text-white shadow-xs hover:bg-teal-800 transition-all active:scale-95 cursor-pointer"
                  title="Upload photo"
                  aria-label="Upload photo"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900">
                  Put a friendly face to your profile
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Mentors love knowing who they are speaking with. You can
                  change or remove this at any time.
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    leftIcon={<Camera className="h-3 w-3" />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {previewUrl ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  {previewUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={handleRemovePhoto}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      leftIcon={<Trash2 className="h-3 w-3 text-red-500" />}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {errors.file && (
                  <p className="text-xs text-red-600 font-medium pt-1">
                    {errors.file.message}
                  </p>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Milestone 02: Topics / Interests */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-extrabold text-white shadow-2xs">
                  02
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Learning Focus
                </span>
                <span className="text-red-500 font-bold text-xs">*</span>
              </div>
              <Badge
                variant={
                  watchedInterests.length === 5
                    ? 'accent'
                    : watchedInterests.length > 0
                      ? 'primary'
                      : 'default'
                }
                size="sm"
              >
                {watchedInterests.length}/5 topics selected
              </Badge>
            </div>

            <Controller
              name="interests"
              control={control}
              render={({ field }) => (
                <InterestSelector
                  selectedInterests={field.value}
                  onChange={field.onChange}
                  error={errors.interests?.message}
                  hideHeader
                />
              )}
            />
          </div>

          {/* Milestone 03: Short Bio */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-extrabold text-white shadow-2xs">
                  03
                </span>
                <label
                  htmlFor="bio"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700 cursor-pointer"
                >
                  Introduce Yourself
                </label>
                <span className="text-[11px] font-medium text-slate-400">
                  (Optional)
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-400">
                {bioValue.length}/500
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              A 1–2 sentence introduction displayed to mentors when you book
              guidance sessions.
            </p>

            <textarea
              id="bio"
              rows={3}
              {...register('bio')}
              aria-describedby={errors.bio ? 'bio-error' : undefined}
              aria-invalid={Boolean(errors.bio)}
              placeholder="e.g. Junior software developer passionate about cloud infrastructure, looking for career guidance and interview prep."
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all resize-none leading-relaxed"
            />
            {errors.bio && (
              <p id="bio-error" className="text-xs text-red-600 font-medium">
                {errors.bio.message}
              </p>
            )}
          </div>

          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {submitError}
            </div>
          )}

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
            disabled={
              !user?.id || isUserLoading || updateProfileMutation.isPending
            }
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
