import { apiClient } from '@/api/client';
import type {
  MentorItem,
  MentorQueryParams,
  MentorRecommendationsResponse,
  PaginatedMentorsResponse,
} from '../types/mentor.types';

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
    for (const skill of params.skills) {
      if (skill.trim()) {
        searchParams.append('skills', skill.trim());
      }
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
