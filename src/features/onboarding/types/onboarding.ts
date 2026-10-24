import type { User } from '@/features/auth/types/auth';

export interface UpdateMenteeProfileDto {
  bio?: string;
  interests?: string[];
  file?: File;
  avatarUrl?: string;
}

export interface MenteeOnboardingFormValues {
  file?: File;
  interests: string[];
  bio: string;
}

export type MenteeProfileResponse = User;
