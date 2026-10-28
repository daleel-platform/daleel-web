import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api/profile.api';
import { profileQueryKeys } from './query-keys';
import type { UserProfile } from '../types/profile.types';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function useProfile() {
  const { token } = useAuth();

  return useQuery<UserProfile, Error>({
    queryKey: profileQueryKeys.userProfile(),
    queryFn: getProfile,
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
  });
}
