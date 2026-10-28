import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/button';
import { Modal } from '@/components/modal';
import { TextInput } from '@/components/text-input';
import { useToast } from '@/hooks/use-toast';
import {
  editProfileSchema,
  type EditProfileFormData,
} from '../schemas/profile.schemas';
import { useEditProfile } from '../hooks/use-edit-profile';
import type { UserProfile } from '../types/profile.types';

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export function EditProfileModal({
  isOpen,
  onClose,
  profile,
}: EditProfileModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const editProfileMutation = useEditProfile();
  const toast = useToast();

  const hasMentorProfile = Boolean(profile.mentorProfile);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onTouched',
    defaultValues: {
      name: profile.name,
      bio: profile.bio ?? '',
      headline: profile.mentorProfile?.headline ?? '',
      yearsOfExperience: profile.mentorProfile?.yearsOfExperience ?? undefined,
      about: profile.mentorProfile?.about ?? '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: profile.name,
        bio: profile.bio ?? '',
        headline: profile.mentorProfile?.headline ?? '',
        yearsOfExperience:
          profile.mentorProfile?.yearsOfExperience ?? undefined,
        about: profile.mentorProfile?.about ?? '',
      });
    }
  }, [isOpen, profile, reset]);

  const handleClose = () => {
    setSubmitError(null);
    onClose();
  };

  const onSubmit = (data: EditProfileFormData) => {
    setSubmitError(null);

    const userPayload = {
      name: data.name,
      bio: data.bio || undefined,
    };

    const mentorPayload = hasMentorProfile
      ? {
          headline: data.headline || undefined,
          yearsOfExperience:
            typeof data.yearsOfExperience === 'number' &&
            !Number.isNaN(data.yearsOfExperience)
              ? data.yearsOfExperience
              : undefined,
          about: data.about || undefined,
        }
      : undefined;

    editProfileMutation.mutate(
      { user: userPayload, mentor: mentorPayload },
      {
        onSuccess: () => {
          toast.success('Profile updated successfully!');
          handleClose();
        },
        onError: (err) => {
          const msg = err.message || 'Failed to update profile.';
          setSubmitError(msg);
          toast.error(msg);
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Profile"
      description="Update your personal details and mentor settings."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        {submitError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {submitError}
          </div>
        )}

        {/* User Personal Details */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Personal Information
          </h3>

          <TextInput
            label="Full Name"
            required
            placeholder="e.g. Sarah Mansour"
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-user-bio"
              className="text-xs font-semibold text-slate-700"
            >
              About Me (Mentee Bio)
            </label>
            <textarea
              id="edit-user-bio"
              rows={3}
              placeholder="Tell others a bit about yourself, your learning goals, or background..."
              className="w-full rounded-xl border border-slate-300/90 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all resize-none"
              {...register('bio')}
            />
            {errors.bio?.message && (
              <p className="text-xs font-medium text-red-600">
                {errors.bio.message}
              </p>
            )}
          </div>
        </div>

        {/* Mentor Specific Details if User is a Mentor */}
        {hasMentorProfile && (
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              Mentor Details
            </h3>

            <TextInput
              label="Professional Headline"
              placeholder="e.g. Senior Software Engineer at TechCorp"
              error={errors.headline?.message}
              {...register('headline')}
            />

            <TextInput
              label="Years of Experience"
              type="number"
              min={1}
              max={60}
              placeholder="e.g. 5"
              error={errors.yearsOfExperience?.message}
              {...register('yearsOfExperience', { valueAsNumber: true })}
            />

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit-mentor-about"
                className="text-xs font-semibold text-slate-700"
              >
                About Mentor (Mentorship Bio)
              </label>
              <textarea
                id="edit-mentor-about"
                rows={3}
                placeholder="Describe your mentorship style and background..."
                className="w-full rounded-xl border border-slate-300/90 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all resize-none"
                {...register('about')}
              />
              {errors.about?.message && (
                <p className="text-xs font-medium text-red-600">
                  {errors.about.message}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting || editProfileMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={isSubmitting || editProfileMutation.isPending}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
