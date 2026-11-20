export interface MentorPublicUser {
  name: string;
  avatarUrl: string | null;
  bio: string | null;
}

export interface MentorItem {
  id: string;
  headline: string;
  about: string;
  skills: string[];
  yearsOfExperience: number | null;
  linkedinUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: MentorPublicUser;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedMentorsResponse {
  items: MentorItem[];
  meta: PaginationMeta;
}

export interface MentorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  skills?: string[];
  minExperience?: number;
}

export interface MentorRecommendation {
  mentor: MentorItem;
  matchScore: number | null;
  matchedSkills: string[];
  rationale: string;
}

export interface MentorRecommendationsResponse {
  items: MentorRecommendation[];
  isFallback: boolean;
  semanticScoring: boolean;
}
