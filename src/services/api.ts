import { getStoredAccessToken } from './auth-storage';
import { attemptSessionRefresh } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';
const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY;

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export interface ApiRequestInit extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export const apiRequest = async <T>(path: string, init: ApiRequestInit = {}): Promise<T> => {
  const performRequest = async (): Promise<Response> => {
    const headers = new Headers(init.headers);

    const isAdminRequest = path === '/admin' || path.startsWith('/admin/');
    const adminKey = localStorage.getItem('admin_api_key') ?? ADMIN_API_KEY;
    if (isAdminRequest && adminKey) {
      headers.set('X-Admin-API-Key', adminKey);
    }

    const accessToken = getStoredAccessToken();
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    if (init.body !== undefined && !(init.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    return fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      body:
        init.body === undefined || init.body instanceof FormData
          ? init.body
          : JSON.stringify(init.body),
    });
  };

  let response = await performRequest();

  if (response.status === 401 && getStoredAccessToken()) {
    const refreshed = await attemptSessionRefresh();
    if (refreshed) {
      response = await performRequest();
    }
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      payload?.error?.message ?? 'Request failed',
      response.status,
      payload?.error?.code,
    );
  }

  return payload.data as T;
};