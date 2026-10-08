import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { forgotPassword } from '@/features/auth/api/auth.api';
import type {
  ForgotPasswordDto,
  MessageResponse,
} from '@/features/auth/types/auth';

export function useForgotPassword(): UseMutationResult<
  MessageResponse,
  Error,
  ForgotPasswordDto
> {
  return useMutation<MessageResponse, Error, ForgotPasswordDto>({
    mutationFn: forgotPassword,
  });
}
