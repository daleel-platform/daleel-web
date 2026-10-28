import { Edit, Mail, Sparkles } from 'lucide-react';
import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import type { UserProfile } from '../types/profile.types';
import { getMentorStatus } from '@/types/mentor';

export interface ProfileHeaderProps {
  profile: UserProfile;
  onEditClick: () => void;
}

export function ProfileHeader({ profile, onEditClick }: ProfileHeaderProps) {
  const mentorStatus = getMentorStatus(profile.mentorProfile);

  const headline =
    profile.mentorProfile?.headline ||
    profile.bio ||
    'Passionate learner actively exploring new skills and growing through Daleel community.';

  return (
    <Card className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
        <Avatar
          name={profile.name}
          src={profile.avatarUrl ?? undefined}
          size="xl"
          status="online"
          className="ring-4 ring-teal-50"
        />

        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {profile.name}
            </h1>

            {mentorStatus === 'ACTIVE' && (
              <Badge variant="accent" size="sm" className="gap-1">
                <Sparkles className="h-3 w-3 text-amber-600" />
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

          <p className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Mail className="h-3.5 w-3.5 text-slate-400" />
            <span>{profile.email}</span>
          </p>

          <p className="text-xs text-slate-600 max-w-xl leading-relaxed pt-1">
            {headline}
          </p>
        </div>
      </div>

      <div className="shrink-0 self-stretch sm:self-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onEditClick}
          leftIcon={<Edit className="h-3.5 w-3.5" />}
          className="w-full sm:w-auto"
        >
          Edit Profile
        </Button>
      </div>
    </Card>
  );
}
