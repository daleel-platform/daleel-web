import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applyForMentor } from '../api/profile.api';
import { profileQueryKeys } from './query-keys';
import { authQueryKeys } from '@/features/auth/hooks/query-keys';
import type { MentorApplicationDto } from '../types/profile.types';

export function useMentorApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: MentorApplicationDto) => applyForMentor(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser() });
    },
  });
}
