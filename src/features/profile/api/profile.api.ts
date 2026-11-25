import { apiClient } from '@/api/client';
import type {
  UserProfile,
  UpdateUserProfileDto,
  UpdateMentorProfileDto,
  MentorProfile,
} from '../types/profile.types';

export function getProfile(): Promise<UserProfile> {
  return apiClient.get<UserProfile>('/users/me');
}

export function updateProfile(dto: UpdateUserProfileDto): Promise<UserProfile> {
  return apiClient.patch<UserProfile>('/users/me', dto);
}

export function updateMentorProfile(
  dto: UpdateMentorProfileDto,
): Promise<MentorProfile> {
  return apiClient.patch<MentorProfile>('/mentors/me', dto);
}
