import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { login } from '../api/auth.api';
import { ROUTES } from '@/routes/paths';
import { AUTH_TOKEN_STORAGE_KEY } from '@/config/constants';

export function useLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, data.accessToken);
      localStorage.setItem('userData', JSON.stringify(data.user));
      navigate(ROUTES.DASHBOARD);
    },
  });
}
