import { apiClient } from '@/api/client';
import type { User } from '@/features/auth/types/auth';
import type { UpdateMenteeProfileDto } from '../types/onboarding';

export function updateMenteeProfile(
  _userId: string,
  dto: UpdateMenteeProfileDto,
): Promise<User> {
  if (dto.file) {
    const formData = new FormData();
    formData.append('file', dto.file);
    if (dto.bio) {
      formData.append('bio', dto.bio);
    }
    if (dto.interests) {
      dto.interests.forEach((interest) =>
        formData.append('interests', interest),
      );
    }
    return apiClient.patch<User>(`/users/me`, formData);
  }
  return apiClient.patch<User>(`/users/me`, {
    bio: dto.bio,
    interests: dto.interests,
  });
}
