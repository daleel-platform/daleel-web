import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Pencil, User, X } from 'lucide-react';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { TextInput } from '@/components/text-input';
import { useToast } from '@/hooks/use-toast';
import { getMentorStatus } from '@/types/mentor';
import { useEditProfile } from '../hooks/use-edit-profile';
import {
  editPersonalInfoSchema,
  type EditPersonalInfoFormData,
} from '../schemas/profile.schemas';
import type { UserProfile } from '../types/profile.types';

export interface ProfileInfoCardProps {
  profile: UserProfile;
}

export function ProfileInfoCard({ profile }: ProfileInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const editProfileMutation = useEditProfile();
  const toast = useToast();
  const mentorStatus = getMentorStatus(profile.mentorProfile);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EditPersonalInfoFormData>({
    resolver: zodResolver(editPersonalInfoSchema),
    mode: 'onTouched',
    defaultValues: {
      name: profile.name,
      bio: profile.bio ?? '',
    },
  });

  const bioValue = useWatch({ control, name: 'bio' }) ?? '';

  const getAccountTypeLabel = () => {
    switch (mentorStatus) {
      case 'ACTIVE':
        return 'Mentor (Active)';
      case 'PENDING':
        return 'Mentor (Application Pending)';
      case 'INACTIVE':
        return 'Mentor (Inactive)';
      default:
        return 'Standard Member (Mentee)';
    }
  };

  const handleStartEdit = () => {
    reset({
      name: profile.name,
      bio: profile.bio ?? '',
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset({
      name: profile.name,
      bio: profile.bio ?? '',
    });
    setIsEditing(false);
  };

  const onSubmit = (data: EditPersonalInfoFormData) => {
    editProfileMutation.mutate(
      {
        user: {
          name: data.name,
          bio: data.bio,
        },
      },
      {
        onSuccess: () => {
          toast.success('Personal information updated.');
          setIsEditing(false);
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to save changes.');
        },
      },
    );
  };

  return (
    <Card className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-teal-600" aria-hidden="true" />
          <span>Personal Information</span>
        </h2>

        {!isEditing && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleStartEdit}
            leftIcon={<Pencil className="h-3 w-3" aria-hidden="true" />}
          >
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 flex-1 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <TextInput
              id="profile-inline-name"
              label="Full Name"
              required
              maxLength={100}
              error={errors.name?.message}
              {...register('name')}
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="profile-inline-bio"
                  className="text-xs font-semibold text-slate-700"
                >
                  About Me
                </label>
                <span className="text-[11px] font-medium text-slate-400">
                  {bioValue.length}/500
                </span>
              </div>
              <textarea
                id="profile-inline-bio"
                rows={4}
                maxLength={500}
                aria-invalid={Boolean(errors.bio)}
                placeholder="Tell mentors a bit about your background and career goals..."
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-600/10 transition-all resize-none leading-relaxed"
                {...register('bio')}
              />
              {errors.bio?.message && (
                <p role="alert" className="text-xs text-red-600 font-medium">
                  {errors.bio.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={handleCancel}
              disabled={editProfileMutation.isPending}
              leftIcon={<X className="h-3 w-3" aria-hidden="true" />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="xs"
              loading={editProfileMutation.isPending}
              leftIcon={<Check className="h-3 w-3" aria-hidden="true" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      ) : (
        <dl className="space-y-4 flex-1">
          <div>
            <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Full Name
            </dt>
            <dd className="text-xs font-semibold text-slate-800">
              {profile.name}
            </dd>
          </div>

          <div>
            <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Email Address
            </dt>
            <dd className="text-xs font-semibold text-slate-800">
              {profile.email}
            </dd>
          </div>

          <div>
            <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Account Type
            </dt>
            <dd className="text-xs font-semibold text-teal-700">
              {getAccountTypeLabel()}
            </dd>
          </div>

          <div>
            <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              About Me
            </dt>
            <dd className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {profile.bio || (
                <span className="italic text-slate-400">No bio added yet.</span>
              )}
            </dd>
          </div>
        </dl>
      )}
    </Card>
  );
}
