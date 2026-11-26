import { AUTH_TOKEN_STORAGE_KEY } from '@/config/constants';
import { env } from '@/config/env';
import type { ApiResponse, ErrorResponseBody } from '@/types/api';
import { ApiError } from './errors';

export const AUTH_TOKEN_REFRESHED_EVENT = 'daleel:auth-token-refreshed';
export const AUTH_SESSION_EXPIRED_EVENT = 'daleel:auth-session-expired';

const AUTH_SKIP_REFRESH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/forgot-password',
  '/auth/reset-password',
];

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
}

let refreshPromise: Promise<string | null> | null = null;

function shouldSkipRefresh(endpoint: string): boolean {
  const normalized = endpoint.startsWith('http')
    ? new URL(endpoint).pathname
    : `/${endpoint.replace(/^\/+/, '')}`;
  return AUTH_SKIP_REFRESH_PATHS.some((path) => normalized.endsWith(path));
}

export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshUrl = `${env.apiBaseUrl.replace(/\/+$/, '')}/auth/refresh`;

  refreshPromise = (async () => {
    try {
      const response = await fetch(refreshUrl, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        return null;
      }

      const payload: unknown = await response.json();
      const unwrapped =
        payload &&
        typeof payload === 'object' &&
        'success' in payload &&
        'data' in payload
          ? (payload as ApiResponse<{ accessToken?: string }>).data
          : (payload as { accessToken?: string } | null);

      const newToken = unwrapped?.accessToken;
      if (typeof newToken !== 'string' || !newToken) {
        return null;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, newToken);
        window.dispatchEvent(
          new CustomEvent<string>(AUTH_TOKEN_REFRESHED_EVENT, {
            detail: newToken,
          }),
        );
      }

      return newToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
  hasRetried = false,
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

  const isFormData =
    typeof FormData !== 'undefined' && body instanceof FormData;

  const requestHeaders: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...restOptions,
    credentials: 'include',
    headers: requestHeaders,
    body: isFormData
      ? body
      : body !== undefined
        ? JSON.stringify(body)
        : undefined,
  });

  if (response.status === 401 && !hasRetried && !shouldSkipRefresh(endpoint)) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return request<T>(endpoint, options, true);
    }

    if (typeof window !== 'undefined' && token) {
      window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT));
    }
  }

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
