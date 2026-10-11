import { apiClient } from '@/api/client';
import type { AuthResponse, LoginDto, RegisterDto } from '../types/auth';
import type {
  ForgotPasswordDto,
  ResetPasswordDto,
  MessageResponse,
} from '@/features/auth/types/auth';

export const login = (data: LoginDto) => {
  return apiClient.post<AuthResponse>('/auth/login', data);
};

export const register = (data: RegisterDto) => {
  return apiClient.post<AuthResponse>('/auth/register', data);
};

export function forgotPassword(
  dto: ForgotPasswordDto,
): Promise<MessageResponse> {
  return apiClient.post<MessageResponse>('/auth/forgot-password', dto);
}

export function resetPassword(dto: ResetPasswordDto): Promise<MessageResponse> {
  return apiClient.post<MessageResponse>('/auth/reset-password', dto);
}
