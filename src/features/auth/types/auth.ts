export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}
export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: string;
}
export interface LoginDto {
  email: string;
  password: string;
}
export interface AuthResponse {
  accessToken: string;
  user: User;
}
export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  password: string;
  token: string;
}

export interface MessageResponse {
  message: string;
}
