import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { Camera, Trash2, ArrowRight } from 'lucide-react';

import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
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
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const updateProfileMutation = useUpdateMenteeProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <Card className="max-w-2xl w-full p-6 sm:p-8 shadow-xs border border-slate-200/80 rounded-2xl bg-white">
      <CardHeader className="pb-5 border-b border-slate-100">
        <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900">
          {user?.name
            ? `Welcome to Daleel, ${user.name.split(' ')[0]}`
            : 'Welcome to Daleel'}
        </CardTitle>
        <CardDescription className="text-sm text-slate-500 mt-1">
          Set your learning focus so Daleel can match you with the right
          mentors.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-5 pt-6">
          {/* Step 01: Profile Photo */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
                01
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Profile Photo
              </h2>
              <span className="text-[11px] font-medium text-slate-400">
                (Optional)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative shrink-0">
                <Avatar
                  name={user?.name}
                  src={previewUrl || user?.avatarUrl || undefined}
                  size="xl"
                  className="rounded-full ring-4 ring-slate-100"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-teal-700 text-white shadow-xs hover:bg-teal-800 transition-colors cursor-pointer"
                  title="Upload photo"
                  aria-label="Upload photo"
                >
                  <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <p className="text-xs font-semibold text-slate-900">
                  Add a profile picture
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  JPEG, PNG, or WebP up to 5 MB. You can update or change this
                  anytime from your profile.
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    leftIcon={<Camera className="h-3 w-3" aria-hidden="true" />}
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
                      leftIcon={
                        <Trash2
                          className="h-3 w-3 text-red-500"
                          aria-hidden="true"
                        />
                      }
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {errors.file && (
                  <p role="alert" className="text-xs text-red-600 font-medium">
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
          </section>

          {/* Step 02: Learning Focus */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
                  02
                </span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Learning Focus
                </h2>
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
                {watchedInterests.length}/5 selected
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
          </section>

          {/* Step 03: Short Bio */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
                  03
                </span>
                <label
                  htmlFor="bio"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700 cursor-pointer"
                >
                  Short Bio
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
              A brief introduction shown to mentors when you connect.
            </p>

            <textarea
              id="bio"
              rows={3}
              {...register('bio')}
              aria-describedby={errors.bio ? 'bio-error' : undefined}
              aria-invalid={Boolean(errors.bio)}
              placeholder="e.g. Software developer focused on backend systems, looking for architecture guidance and interview prep."
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all resize-none leading-relaxed"
            />
            {errors.bio && (
              <p
                id="bio-error"
                role="alert"
                className="text-xs text-red-600 font-medium"
              >
                {errors.bio.message}
              </p>
            )}
          </section>

          {submitError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
            >
              {submitError}
            </div>
          )}

          {updateProfileMutation.isError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
            >
              {updateProfileMutation.error?.message ||
                'Failed to update profile. Please try again.'}
            </div>
          )}
        </CardContent>

        {/* Action Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
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
            rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
          >
            Complete &amp; Discover Mentors
          </Button>
        </div>
      </form>
    </Card>
  );
}
