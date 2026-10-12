import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../api/auth.api';
import { authQueryKeys } from './query-keys';
import { useAuth } from './use-auth';
import type { User } from '../types/auth';
import { ApiError } from '@/api/errors';

export function useCurrentUser() {
  const { token, logout } = useAuth();

  const query = useQuery<User, Error>({
    queryKey: authQueryKeys.currentUser(),
    queryFn: getCurrentUser,
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.statusCode === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });

  useEffect(() => {
    if (
      query.error instanceof ApiError &&
      query.error.statusCode === 401 &&
      token
    ) {
      logout();
    }
  }, [query.error, token, logout]);

  return query;
}
