import type { MentorProfile, MentorStatus } from '@/types/mentor';

export type { MentorProfile, MentorStatus };

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  interests?: string[];
  mentorProfile?: MentorProfile | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserProfileDto {
  name?: string;
  bio?: string;
  interests?: string[];
}

export interface MentorApplicationDto {
  headline: string;
  yearsOfExperience: number;
  about: string;
  skills: string[];
}

export interface UpdateMentorProfileDto {
  headline?: string;
  yearsOfExperience?: number;
  about?: string;
  skills?: string[];
  isActive?: boolean;
  linkedinUrl?: string | null;
}
