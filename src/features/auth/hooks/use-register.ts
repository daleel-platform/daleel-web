import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { register } from '../api/auth.api';
import { ROUTES } from '@/routes/paths';
import { useAuth } from './use-auth';
import { authQueryKeys } from './query-keys';

export function useRegister() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login: setAuthToken } = useAuth();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setAuthToken(data.accessToken);
      queryClient.setQueryData(authQueryKeys.currentUser(), data.user);
      navigate(ROUTES.MENTORS);
    },
  });
}
