import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile, updateMentorProfile } from '../api/profile.api';
import { profileQueryKeys } from './query-keys';
import { authQueryKeys } from '@/features/auth/hooks/query-keys';
import type {
  UpdateUserProfileDto,
  UpdateMentorProfileDto,
} from '../types/profile.types';

export interface EditProfileVariables {
  user: UpdateUserProfileDto;
  mentor?: UpdateMentorProfileDto;
}

export function useEditProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, mentor }: EditProfileVariables) => {
      const updatedUser = await updateProfile(user);
      let updatedMentor = null;

      if (mentor) {
        updatedMentor = await updateMentorProfile(mentor);
      }

      return { user: updatedUser, mentor: updatedMentor };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser() });
    },
  });
}
