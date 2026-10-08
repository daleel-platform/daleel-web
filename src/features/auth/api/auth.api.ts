import { apiClient } from '@/api/client';
import type {
  ForgotPasswordDto,
  ResetPasswordDto,
  MessageResponse,
} from '@/features/auth/types/auth';

export function forgotPassword(
  dto: ForgotPasswordDto,
): Promise<MessageResponse> {
  return apiClient.post<MessageResponse>('/auth/forgot-password', dto);
}

export function resetPassword(dto: ResetPasswordDto): Promise<MessageResponse> {
  return apiClient.post<MessageResponse>('/auth/reset-password', dto);
}
