import type { User } from '@/features/auth/types/auth';
import type { MentorExperience } from '@/types/mentor';

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

export interface CreateMentorProfileDto {
  file?: File;
  headline: string;
  yearsOfExperience: number;
  skills: string[];
  about: string;
  linkedinUrl?: string;
  experiences: Omit<MentorExperience, 'id'>[];
}
