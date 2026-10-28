import { User } from 'lucide-react';
import { Card } from '@/components/card';
import type { UserProfile } from '../types/profile.types';
import { getMentorStatus } from '@/types/mentor';

export interface ProfileInfoCardProps {
  profile: UserProfile;
}

export function ProfileInfoCard({ profile }: ProfileInfoCardProps) {
  const mentorStatus = getMentorStatus(profile.mentorProfile);

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

  return (
    <Card className="flex flex-col h-full p-6 sm:p-8">
      <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2 pb-3 border-b border-slate-100">
        <User className="w-4 h-4 text-slate-400" />
        <span>Personal Information</span>
      </h2>

      <div className="space-y-4 flex-1">
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Full Name
          </label>
          <p className="text-xs font-semibold text-slate-800">{profile.name}</p>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Email Address
          </label>
          <p className="text-xs font-semibold text-slate-800">
            {profile.email}
          </p>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Account Type
          </label>
          <p className="text-xs font-semibold text-teal-700">
            {getAccountTypeLabel()}
          </p>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            About Me
          </label>
          <p className="text-xs text-slate-600 leading-relaxed">
            {profile.bio || (
              <span className="italic text-slate-400">No bio added yet.</span>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
}
