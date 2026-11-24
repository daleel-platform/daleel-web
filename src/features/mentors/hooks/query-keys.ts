import type { MentorQueryParams } from '../types/mentor.types';

export const mentorQueryKeys = {
  all: ['mentors'] as const,
  list: (params?: MentorQueryParams) =>
    [...mentorQueryKeys.all, 'list', params ?? {}] as const,
  detail: (id: string) => [...mentorQueryKeys.all, 'detail', id] as const,
  recommendations: (limit?: number) =>
    [...mentorQueryKeys.all, 'recommendations', limit] as const,
};
