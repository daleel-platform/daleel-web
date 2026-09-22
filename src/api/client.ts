import { AUTH_TOKEN_STORAGE_KEY } from '@/config/constants';
import { env } from '@/config/env';
import type { ApiResponse, ErrorResponseBody } from '@/types/api';
import { ApiError } from './errors';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, params, headers = {}, ...restOptions } = options;

  let url = endpoint.startsWith('http')
    ? endpoint
    : `${env.apiBaseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
      : null;

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...restOptions,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let responseData: unknown = null;
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    responseData = await response.json();
  }

  if (!response.ok) {
    const errorBody = responseData as Partial<ErrorResponseBody> | null;
    throw new ApiError({
      statusCode: response.status,
      message:
        errorBody?.message ?? `Request failed with status ${response.status}`,
      error: errorBody?.error,
      timestamp: errorBody?.timestamp,
      path: errorBody?.path,
    });
  }

  // If response wraps data in Daleel backend's ApiResponse<T> envelope, unwrap it
  if (
    responseData &&
    typeof responseData === 'object' &&
    'success' in responseData &&
    'data' in responseData
  ) {
    const apiEnvelope = responseData as ApiResponse<T>;
    return apiEnvelope.data;
  }

  return responseData as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),
  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),
  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
