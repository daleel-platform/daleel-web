import { apiClient } from '@/api/client';
import type {
  UserProfile,
  UpdateUserProfileDto,
  MentorApplicationDto,
  UpdateMentorProfileDto,
  MentorProfile,
} from '../types/profile.types';

export function getProfile(): Promise<UserProfile> {
  return apiClient.get<UserProfile>('/users/me');
}

export function updateProfile(dto: UpdateUserProfileDto): Promise<UserProfile> {
  return apiClient.patch<UserProfile>('/users/me', dto);
}

export function applyForMentor(
  dto: MentorApplicationDto,
): Promise<MentorProfile> {
  return apiClient.post<MentorProfile>('/mentors', dto);
}

export function updateMentorProfile(
  dto: UpdateMentorProfileDto,
): Promise<MentorProfile> {
  return apiClient.patch<MentorProfile>('/mentors/me', dto);
}
