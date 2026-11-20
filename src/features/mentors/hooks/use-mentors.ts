import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getMentorById,
  getMentors,
  getRecommendedMentors,
} from '../api/mentors.api';
import { mentorQueryKeys } from './query-keys';
import type {
  MentorItem,
  MentorQueryParams,
  MentorRecommendationsResponse,
  PaginatedMentorsResponse,
} from '../types/mentor.types';

export function useMentors(params: MentorQueryParams = {}) {
  return useQuery<PaginatedMentorsResponse, Error>({
    queryKey: mentorQueryKeys.list(params),
    queryFn: () => getMentors(params),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
}

export function useMentor(id: string) {
  return useQuery<MentorItem, Error>({
    queryKey: mentorQueryKeys.detail(id),
    queryFn: () => getMentorById(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecommendedMentors(limit: number = 6) {
  return useQuery<MentorRecommendationsResponse, Error>({
    queryKey: mentorQueryKeys.recommendations(limit),
    queryFn: () => getRecommendedMentors(limit),
    staleTime: 5 * 60 * 1000,
  });
}
