import type { User } from '@/features/auth/types/auth';

export interface UpdateMenteeProfileDto {
  bio?: string;
  interests?: string[];
}

export interface MenteeOnboardingFormValues {
  interests: string[];
  bio: string;
}

export type MenteeProfileResponse = User;
