import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { login } from '../api/auth.api';
import { ROUTES } from '@/routes/paths';
import { useAuth } from './use-auth';
import { authQueryKeys } from './query-keys';

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login: setAuthToken } = useAuth();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuthToken(data.accessToken);
      queryClient.setQueryData(authQueryKeys.currentUser(), data.user);
      navigate(ROUTES.DASHBOARD);
    },
  });
}
