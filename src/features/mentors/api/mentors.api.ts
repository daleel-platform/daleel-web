import { apiClient } from '@/api/client';
import type {
  MentorItem,
  MentorQueryParams,
  MentorRecommendationsResponse,
  PaginatedMentorsResponse,
} from '../types/mentor.types';

function expandSkillCaseVariants(skill: string): string[] {
  const trimmed = skill.trim();
  if (!trimmed) return [];

  const titleCased = trimmed
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return Array.from(
    new Set([
      trimmed,
      trimmed.toLowerCase(),
      trimmed.toUpperCase(),
      titleCased,
    ]),
  );
}

export async function getMentors(
  params: MentorQueryParams = {},
): Promise<PaginatedMentorsResponse> {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set('page', String(params.page));
  }
  if (params.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }
  if (params.search?.trim()) {
    searchParams.set('search', params.search.trim());
  }
  if (params.minExperience !== undefined) {
    searchParams.set('minExperience', String(params.minExperience));
  }
  if (params.skills && params.skills.length > 0) {
    const expandedSkills = Array.from(
      new Set(params.skills.flatMap(expandSkillCaseVariants)),
    );
    for (const skill of expandedSkills) {
      searchParams.append('skills', skill);
    }
  }

  const query = searchParams.toString();
  const endpoint = query ? `mentors?${query}` : 'mentors';

  return apiClient.get<PaginatedMentorsResponse>(endpoint);
}

export async function getMentorById(id: string): Promise<MentorItem> {
  return apiClient.get<MentorItem>(`mentors/${id}`);
}

export async function getRecommendedMentors(
  limit: number = 6,
): Promise<MentorRecommendationsResponse> {
  return apiClient.get<MentorRecommendationsResponse>(
    `mentors/recommendations?limit=${limit}`,
  );
}
