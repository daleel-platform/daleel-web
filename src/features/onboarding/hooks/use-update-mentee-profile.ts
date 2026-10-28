import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMenteeProfile } from '../api/onboarding.api';
import { authQueryKeys } from '@/features/auth/hooks/query-keys';
import type { UpdateMenteeProfileDto } from '../types/onboarding';
import type { User } from '@/features/auth/types/auth';

export interface UpdateMenteeProfileParams {
  userId: string;
  data: UpdateMenteeProfileDto;
}

export function useUpdateMenteeProfile() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, UpdateMenteeProfileParams>({
    mutationFn: ({ userId, data }) => updateMenteeProfile(userId, data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(authQueryKeys.currentUser(), updatedUser);
      queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser() });
    },
  });
}
