import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MentorProfile } from '@/types/mentor';
import { createMentorProfile } from '../api/onboarding.api';
import type { CreateMentorProfileDto } from '../types/onboarding';

export function useCreateMentorProfile() {
  const queryClient = useQueryClient();

  return useMutation<MentorProfile, Error, CreateMentorProfileDto>({
    mutationFn: createMentorProfile,
    onSuccess: () => {
      // Mentor status changes the current user, the profile page and the
      // header, which are cached under keys owned by other features.
      queryClient.invalidateQueries();
    },
  });
}
