import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { register } from '../api/auth.api';
import { ROUTES } from '@/routes/paths';
import { AUTH_TOKEN_STORAGE_KEY } from '@/config/constants';

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, data.accessToken);
      localStorage.setItem('userData', JSON.stringify(data.user));
      navigate(ROUTES.DASHBOARD);
    },
  });
}
