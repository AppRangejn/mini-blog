import { STORAGE_KEYS } from '@/constants';
import { AuthResponse, Post, PostPayload, User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const setStoredToken = (token: string | null): void => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
};

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.errors?.join(', ') ||
      data?.message ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export const authApi = {
  register: (payload: { name: string; email: string; password: string }) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: () => request<User>('/auth/me'),
};

export const postsApi = {
  getAll: () => request<Post[]>('/posts', { cache: 'no-store' }),

  getById: (id: number | string) =>
    request<Post>(`/posts/${id}`, { cache: 'no-store' }),

  create: (payload: PostPayload) =>
    request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: number, payload: Partial<PostPayload>) =>
    request<Post>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  delete: (id: number) =>
    request<{ message: string }>(`/posts/${id}`, {
      method: 'DELETE',
    }),
};
