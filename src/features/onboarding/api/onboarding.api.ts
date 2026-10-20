import { apiClient } from '@/api/client';
import type { User } from '@/features/auth/types/auth';
import type { UpdateMenteeProfileDto } from '../types/onboarding';

export function updateMenteeProfile(
  userId: string,
  dto: UpdateMenteeProfileDto,
): Promise<User> {
  return apiClient.patch<User>(`/users/${userId}`, dto);
}
