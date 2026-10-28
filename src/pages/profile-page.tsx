import { useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { useProfile } from '@/features/profile/hooks/use-profile';
import { ProfileHeader } from '@/features/profile/components/profile-header';
import { FinishOnboardingBanner } from '@/features/profile/components/finish-onboarding-banner';
import { ProfileInfoCard } from '@/features/profile/components/profile-info-card';
import { MenteeInterestsCard } from '@/features/profile/components/mentee-interests-card';
import { MentorDetailsCard } from '@/features/profile/components/mentor-details-card';
import { MentorActivationBanner } from '@/features/profile/components/mentor-activation-banner';
import { EditProfileModal } from '@/features/profile/components/edit-profile-modal';
import { ApplyMentorModal } from '@/features/profile/components/apply-mentor-modal';
import { AddTopicModal } from '@/features/profile/components/add-topic-modal';
import { AddSkillModal } from '@/features/profile/components/add-skill-modal';

export function ProfilePage() {
  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useProfile();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center space-y-4 border border-slate-200/90 shadow-sm rounded-2xl bg-white">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-8 ring-red-50/50">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Failed to load profile
            </h2>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              {error?.message ||
                'Unable to retrieve your profile information. Please verify your connection.'}
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => refetch()}
              loading={isFetching}
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            >
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const hasMentorProfile = Boolean(profile.mentorProfile);
  const menteeInterests = profile.interests ?? [];
  const mentorSkills = profile.mentorProfile?.skills ?? [];

  return (
    <div className="min-h-screen bg-slate-50/50 px-4 py-8 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Onboarding Incompletion CTA Banner */}
        <FinishOnboardingBanner profile={profile} />

        {/* Top Profile Header Hero */}
        <ProfileHeader
          profile={profile}
          onEditClick={() => setIsEditModalOpen(true)}
        />

        {/* Mentee Profile Data: Personal Details & Learning Interests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileInfoCard profile={profile} />

          <MenteeInterestsCard
            interests={menteeInterests}
            onAddTopicClick={() => setIsTopicModalOpen(true)}
          />
        </div>

        {/* Mentor Section: Either Full Mentor Details or Activation CTA */}
        {hasMentorProfile && profile.mentorProfile ? (
          <MentorDetailsCard
            mentorProfile={profile.mentorProfile}
            onAddSkillClick={() => setIsSkillModalOpen(true)}
          />
        ) : (
          <MentorActivationBanner
            onApplyClick={() => setIsMentorModalOpen(true)}
          />
        )}
      </div>

      {/* Feature Modals */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
      />

      <ApplyMentorModal
        isOpen={isMentorModalOpen}
        onClose={() => setIsMentorModalOpen(false)}
      />

      <AddTopicModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        currentInterests={menteeInterests}
      />

      {hasMentorProfile && (
        <AddSkillModal
          isOpen={isSkillModalOpen}
          onClose={() => setIsSkillModalOpen(false)}
          currentSkills={mentorSkills}
        />
      )}
    </div>
  );
}

export default ProfilePage;
