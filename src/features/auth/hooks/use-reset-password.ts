import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { resetPassword } from '@/features/auth/api/auth.api';
import type {
  ResetPasswordDto,
  MessageResponse,
} from '@/features/auth/types/auth';

export function useResetPassword(): UseMutationResult<
  MessageResponse,
  Error,
  ResetPasswordDto
> {
  return useMutation<MessageResponse, Error, ResetPasswordDto>({
    mutationFn: resetPassword,
  });
}
