import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile, updateMentorProfile } from '../api/profile.api';
import { profileQueryKeys } from './query-keys';
import { authQueryKeys } from '@/features/auth/hooks/query-keys';

export function useAddMenteeInterest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      newInterest,
      currentInterests,
    }: {
      newInterest: string;
      currentInterests: string[];
    }) => {
      const trimmed = newInterest.trim();
      const isDuplicate = currentInterests.some(
        (item) => item.toLowerCase() === trimmed.toLowerCase(),
      );
      if (isDuplicate) {
        throw new Error('This topic is already in your learning interests.');
      }

      return updateProfile({
        interests: [...currentInterests, trimmed],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser() });
    },
  });
}

export function useRemoveMenteeInterest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      interestToRemove,
      currentInterests,
    }: {
      interestToRemove: string;
      currentInterests: string[];
    }) => {
      return updateProfile({
        interests: currentInterests.filter((item) => item !== interestToRemove),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser() });
    },
  });
}

export function useAddMentorSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      newSkill,
      currentSkills,
    }: {
      newSkill: string;
      currentSkills: string[];
    }) => {
      const trimmed = newSkill.trim();
      const isDuplicate = currentSkills.some(
        (item) => item.toLowerCase() === trimmed.toLowerCase(),
      );
      if (isDuplicate) {
        throw new Error('This skill is already listed in your mentor profile.');
      }

      return updateMentorProfile({
        skills: [...currentSkills, trimmed],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser() });
    },
  });
}

export function useRemoveMentorSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      skillToRemove,
      currentSkills,
    }: {
      skillToRemove: string;
      currentSkills: string[];
    }) => {
      if (currentSkills.length <= 1) {
        throw new Error('A mentor must have at least one skill.');
      }

      return updateMentorProfile({
        skills: currentSkills.filter((item) => item !== skillToRemove),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser() });
    },
  });
}
