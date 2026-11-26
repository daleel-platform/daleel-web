import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import {
  ArrowRight,
  Briefcase,
  Building2,
  Camera,
  Link as LinkIcon,
  Plus,
  Trash2,
} from 'lucide-react';

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

const CURRENT_YEAR = new Date().getFullYear();

export function MentorOnboardingWizard() {
  const navigate = useNavigate();
  const toast = useToast();
  const { data: user } = useCurrentUser();
  const createMentorMutation = useCreateMentorProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoRequiredError, setPhotoRequiredError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<MentorOnboardingFormData>({
    resolver: zodResolver(mentorOnboardingSchema),
    mode: 'onTouched',
    defaultValues: {
      headline: '',
      skills: [],
      about: '',
      linkedinUrl: '',
      experiences: [
        {
          title: '',
          company: '',
          startYear: CURRENT_YEAR - 2,
          isCurrent: true,
          endYear: null,
          summary: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experiences',
  });

  const aboutValue = useWatch({ control, name: 'about' }) ?? '';
  const watchedSkills = useWatch({ control, name: 'skills' }) ?? [];
  const watchedExperiences = useWatch({ control, name: 'experiences' }) ?? [];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
      setValue('file', file, { shouldValidate: true });
      setPhotoRequiredError(null);
    }
  };

  const handleRemoveSelectedPhoto = () => {
    setValue('file', undefined, { shouldValidate: true });
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (data: MentorOnboardingFormData) => {
    const hasPhoto = Boolean(data.file || user?.avatarUrl);
    if (!hasPhoto) {
      setPhotoRequiredError(
        'A profile picture is required to publish your mentor profile.',
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setPhotoRequiredError(null);
    createMentorMutation.mutate(
      {
        file: data.file,
        headline: data.headline,
        yearsOfExperience: data.yearsOfExperience,
        skills: data.skills,
        about: data.about,
        linkedinUrl: data.linkedinUrl || undefined,
        experiences: data.experiences.map((exp) => ({
          title: exp.title,
          company: exp.company,
          startYear: exp.startYear,
          endYear: exp.isCurrent ? null : (exp.endYear ?? null),
          summary: exp.summary,
        })),
      },
      {
        onSuccess: () => {
          toast.success('Your mentor profile is live!');
          navigate(ROUTES.PROFILE, { replace: true });
        },
      },
    );
  };

  const displayedPhoto = previewUrl || user?.avatarUrl || undefined;

  return (
    <Card className="max-w-2xl w-full p-6 sm:p-8 shadow-xs border border-slate-200/80 rounded-2xl bg-white">
      <CardHeader className="pb-5 border-b border-slate-100">
        <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900">
          {user?.name
            ? `Ready to guide others, ${user.name.split(' ')[0]}?`
            : 'Ready to guide others?'}
        </CardTitle>
        <CardDescription className="text-sm text-slate-500 mt-1">
          Share your experience and the topics you can help with. This powers
          both your public mentor profile and AI mentor matching.
        </CardDescription>
      </CardHeader>

      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-5 pt-6">
          {/* Step 01: Required Profile Photo */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
                  01
                </span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Profile Photo
                </h2>
                <span className="text-red-500 font-bold text-xs">*</span>
              </div>
              {displayedPhoto && (
                <Badge variant="success" size="sm">
                  Ready
                </Badge>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative shrink-0">
                <Avatar
                  name={user?.name}
                  src={displayedPhoto}
                  size="xl"
                  className="rounded-full ring-4 ring-slate-100"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-teal-700 text-white shadow-xs hover:bg-teal-800 transition-colors cursor-pointer"
                  aria-label="Upload profile photo"
                  title="Upload profile photo"
                >
                  <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <p className="text-xs font-semibold text-slate-900">
                  {displayedPhoto
                    ? 'Looking great! You can keep this photo or upload a new one.'
                    : 'Upload a clear headshot'}
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Mentees rely on seeing who they will be speaking with. JPEG,
                  PNG, or WebP up to 5 MB.
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    leftIcon={<Camera className="h-3 w-3" aria-hidden="true" />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {displayedPhoto ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  {previewUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={handleRemoveSelectedPhoto}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      leftIcon={
                        <Trash2 className="h-3 w-3" aria-hidden="true" />
                      }
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {(errors.file?.message || photoRequiredError) && (
                  <p role="alert" className="text-xs text-red-600 font-medium">
                    {errors.file?.message || photoRequiredError}
                  </p>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </section>

          {/* Step 02: Professional Identity */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
                02
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Professional Identity
              </h2>
              <span className="text-red-500 font-bold text-xs">*</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-7">
                <TextInput
                  id="mentor-headline"
                  label="Professional Headline"
                  required
                  placeholder="e.g. Senior Backend Engineer"
                  leftIcon={
                    <Briefcase className="h-4 w-4" aria-hidden="true" />
                  }
                  error={errors.headline?.message}
                  {...register('headline')}
                />
              </div>
              <div className="sm:col-span-5">
                <TextInput
                  id="mentor-years"
                  label="Total Years of Experience"
                  helperText="Across all companies"
                  required
                  type="number"
                  min={1}
                  max={60}
                  placeholder="e.g. 5"
                  error={errors.yearsOfExperience?.message}
                  {...register('yearsOfExperience', { valueAsNumber: true })}
                />
              </div>
            </div>
          </section>

          {/* Step 03: Work Experience */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-5 space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
                  03
                </span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Work Experience
                </h2>
                <span className="text-red-500 font-bold text-xs">*</span>
              </div>

              {fields.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() =>
                    append({
                      title: '',
                      company: '',
                      startYear: CURRENT_YEAR - 3,
                      isCurrent: false,
                      endYear: CURRENT_YEAR - 1,
                      summary: '',
                    })
                  }
                  leftIcon={<Plus className="h-3 w-3" aria-hidden="true" />}
                >
                  Add Role
                </Button>
              )}
            </div>

            <p className="text-[11px] text-slate-500">
              Add your current and past roles. Summaries help mentees understand
              your background and improve AI recommendations.
            </p>

            <div className="space-y-4">
              {fields.map((field, index) => {
                const isCurrent = watchedExperiences[index]?.isCurrent ?? false;
                const expErrors = errors.experiences?.[index];

                return (
                  <div
                    key={field.id}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        Role {index + 1}
                      </span>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" aria-hidden="true" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <TextInput
                        id={`exp-title-${index}`}
                        label="Job Title"
                        required
                        placeholder="e.g. Staff Software Engineer"
                        leftIcon={
                          <Briefcase
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        }
                        error={expErrors?.title?.message}
                        {...register(`experiences.${index}.title`)}
                      />
                      <TextInput
                        id={`exp-company-${index}`}
                        label="Company"
                        required
                        placeholder="e.g. Stripe"
                        leftIcon={
                          <Building2
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        }
                        error={expErrors?.company?.message}
                        {...register(`experiences.${index}.company`)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                      <div className="sm:col-span-4">
                        <TextInput
                          id={`exp-start-${index}`}
                          label="Start Year"
                          required
                          type="number"
                          min={1960}
                          max={CURRENT_YEAR}
                          placeholder="2021"
                          error={expErrors?.startYear?.message}
                          {...register(`experiences.${index}.startYear`, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <TextInput
                          id={`exp-end-${index}`}
                          label="End Year"
                          type="number"
                          min={1960}
                          max={CURRENT_YEAR + 1}
                          placeholder={isCurrent ? 'Present' : '2024'}
                          disabled={isCurrent}
                          error={
                            isCurrent ? undefined : expErrors?.endYear?.message
                          }
                          {...register(`experiences.${index}.endYear`, {
                            setValueAs: (v: string) =>
                              v === '' || v === null || v === undefined
                                ? null
                                : Number(v),
                          })}
                        />
                      </div>

                      <div className="sm:col-span-4 sm:pt-7">
                        <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                            {...register(`experiences.${index}.isCurrent`, {
                              onChange: (e: ChangeEvent<HTMLInputElement>) => {
                                if (e.target.checked) {
                                  setValue(
                                    `experiences.${index}.endYear`,
                                    null,
                                  );
                                }
                              },
                            })}
                          />
                          <span>Current role</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor={`exp-summary-${index}`}
                        className="text-xs font-semibold text-slate-700 block"
                      >
                        Summary of Impact{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id={`exp-summary-${index}`}
                        rows={2}
                        placeholder="e.g. Led payment ledger architecture, scaled throughput 5×, and mentored 6 backend engineers."
                        {...register(`experiences.${index}.summary`)}
                        className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all resize-none leading-relaxed"
                      />
                      {expErrors?.summary && (
                        <p
                          role="alert"
                          className="text-xs text-red-600 font-medium"
                        >
                          {expErrors.summary.message}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {errors.experiences?.root?.message && (
              <p role="alert" className="text-xs text-red-600 font-medium">
                {errors.experiences.root.message}
              </p>
            )}
          </section>

          {/* Step 04: Mentoring Topics */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
                  04
                </span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Topics You Can Mentor On
                </h2>
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
                {watchedSkills.length}/5 selected
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
                  placeholder="Search or add skills (e.g. System Design, React)..."
                  hideHeader
                />
              )}
            />
          </section>

          {/* Step 05: About & LinkedIn */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
                  05
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

            <div className="space-y-2">
              <p className="text-[11px] text-slate-500">
                Share your mentoring style and what mentees can expect from a
                session with you.
              </p>

              <textarea
                id="mentor-about"
                rows={4}
                {...register('about')}
                aria-describedby={
                  errors.about ? 'mentor-about-error' : undefined
                }
                aria-invalid={Boolean(errors.about)}
                placeholder="e.g. 8 years building payment systems. I help engineers prepare for system design interviews and grow into senior roles."
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all resize-none leading-relaxed"
              />
              {errors.about && (
                <p
                  id="mentor-about-error"
                  role="alert"
                  className="text-xs text-red-600 font-medium"
                >
                  {errors.about.message}
                </p>
              )}
            </div>

            <TextInput
              id="mentor-linkedin"
              label="LinkedIn Profile (Optional)"
              type="url"
              placeholder="https://www.linkedin.com/in/your-name"
              leftIcon={<LinkIcon className="h-4 w-4" aria-hidden="true" />}
              error={errors.linkedinUrl?.message}
              {...register('linkedinUrl')}
            />
          </section>

          {createMentorMutation.isError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
            >
              {createMentorMutation.error?.message ||
                'Failed to create your mentor profile. Please try again.'}
            </div>
          )}
        </CardContent>

        {/* Action Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
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
            rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
          >
            Publish Mentor Profile
          </Button>
        </div>
      </form>
    </Card>
  );
}
