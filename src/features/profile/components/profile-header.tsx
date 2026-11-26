import { useRef, type ChangeEvent } from 'react';
import { Camera, Mail, Sparkles } from 'lucide-react';
import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { useToast } from '@/hooks/use-toast';
import { getMentorStatus } from '@/types/mentor';
import { useUploadProfileAvatar } from '../hooks/use-edit-profile';
import type { UserProfile } from '../types/profile.types';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

export interface ProfileHeaderProps {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const uploadAvatarMutation = useUploadProfileAvatar();
  const mentorStatus = getMentorStatus(profile.mentorProfile);

  const headline =
    profile.mentorProfile?.headline ||
    profile.bio ||
    'Passionate learner actively exploring new skills and growing through Daleel.';

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Please select a JPEG, PNG, or WebP image.');
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      toast.error('Image must be 5 MB or smaller.');
      return;
    }

    uploadAvatarMutation.mutate(file, {
      onSuccess: () => {
        toast.success('Profile picture updated.');
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to update profile picture.');
      },
    });
  };

  return (
    <Card className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="relative shrink-0">
          <Avatar
            name={profile.name}
            src={profile.avatarUrl ?? undefined}
            size="xl"
            status="online"
            className="rounded-full ring-4 ring-teal-50"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadAvatarMutation.isPending}
            aria-label="Update profile picture"
            title="Update profile picture"
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-teal-700 text-white shadow-xs transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 disabled:opacity-60 cursor-pointer"
          >
            {uploadAvatarMutation.isPending ? (
              <span
                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />
            ) : (
              <Camera className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {profile.name}
            </h1>

            {mentorStatus === 'ACTIVE' && (
              <Badge variant="accent" size="sm" className="gap-1">
                <Sparkles
                  className="h-3 w-3 text-amber-600"
                  aria-hidden="true"
                />
                <span>Active Mentor</span>
              </Badge>
            )}

            {mentorStatus === 'PENDING' && (
              <Badge variant="warning" size="sm">
                Mentor Application Pending
              </Badge>
            )}

            {mentorStatus === 'INACTIVE' && (
              <Badge variant="default" size="sm">
                Inactive Mentor
              </Badge>
            )}

            {!mentorStatus && (
              <Badge variant="primary" size="sm">
                Active Mentee
              </Badge>
            )}
          </div>

          <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Mail
              className="h-3.5 w-3.5 text-slate-400 shrink-0"
              aria-hidden="true"
            />
            <span>{profile.email}</span>
          </p>

          <p className="text-xs text-slate-600 max-w-xl leading-relaxed pt-0.5">
            {headline}
          </p>
        </div>
      </div>

      <div className="shrink-0 self-stretch sm:self-auto">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          loading={uploadAvatarMutation.isPending}
          leftIcon={<Camera className="h-3.5 w-3.5" aria-hidden="true" />}
          className="w-full sm:w-auto"
        >
          {profile.avatarUrl ? 'Change Photo' : 'Upload Photo'}
        </Button>
      </div>
    </Card>
  );
}
