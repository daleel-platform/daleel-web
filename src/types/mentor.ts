export type MentorStatus = 'ACTIVE' | 'PENDING' | 'INACTIVE';

export interface MentorExperience {
  id?: string;
  title: string;
  company: string;
  startYear: number;
  endYear: number | null;
  summary: string;
}

export interface MentorProfile {
  id: string;
  userId: string;
  headline: string;
  about: string;
  skills: string[];
  yearsOfExperience: number;
  linkedinUrl?: string | null;
  isActive: boolean;
  status?: MentorStatus;
  experiences?: MentorExperience[];
  createdAt?: string;
  updatedAt?: string;
}

export function getMentorStatus(
  mentorProfile?: { status?: string; isActive?: boolean } | null,
): MentorStatus | null {
  if (!mentorProfile) return null;
  if (mentorProfile.status === 'PENDING') return 'PENDING';
  if (mentorProfile.status === 'INACTIVE' || mentorProfile.isActive === false) {
    return 'INACTIVE';
  }
  if (mentorProfile.status === 'ACTIVE' || mentorProfile.isActive === true) {
    return 'ACTIVE';
  }
  return 'ACTIVE';
}
