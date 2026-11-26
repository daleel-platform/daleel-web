import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';
import {
  updateProfile,
  updateMentorProfile,
  uploadProfileAvatar,
} from '../api/profile.api';
import { profileQueryKeys } from './query-keys';
import { authQueryKeys } from '@/features/auth/hooks/query-keys';
import type {
  MentorProfile,
  UpdateUserProfileDto,
  UpdateMentorProfileDto,
  UserProfile,
} from '../types/profile.types';

export interface EditProfileVariables {
  user?: UpdateUserProfileDto;
  mentor?: UpdateMentorProfileDto;
}

export interface EditProfileResult {
  user: UserProfile | null;
  mentor: MentorProfile | null;
}

export function useEditProfile(): UseMutationResult<
  EditProfileResult,
  Error,
  EditProfileVariables
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, mentor }: EditProfileVariables) => {
      const updatedUser = user ? await updateProfile(user) : null;
      const updatedMentor = mentor ? await updateMentorProfile(mentor) : null;

      return { user: updatedUser, mentor: updatedMentor };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileQueryKeys.all });
      void queryClient.invalidateQueries({
        queryKey: authQueryKeys.currentUser(),
      });
      void queryClient.invalidateQueries({ queryKey: ['mentors'] });
    },
  });
}

export function useUploadProfileAvatar(): UseMutationResult<
  UserProfile,
  Error,
  File
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadProfileAvatar(file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileQueryKeys.all });
      void queryClient.invalidateQueries({
        queryKey: authQueryKeys.currentUser(),
      });
      void queryClient.invalidateQueries({ queryKey: ['mentors'] });
    },
  });
}
