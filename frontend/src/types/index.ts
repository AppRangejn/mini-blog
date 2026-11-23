import { POST_SORT, ROLES } from '@/constants';

export type UserRole = (typeof ROLES)[keyof typeof ROLES];
export type PostSortOption = (typeof POST_SORT)[keyof typeof POST_SORT];

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface PostAuthor {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  title: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  authorId: number;
  author?: PostAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedPostsResponse {
  posts: Post[];
  pagination: PaginationMeta;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PostPayload {
  title: string;
  excerpt?: string | null;
  content: string;
  imageUrl?: string | null;
}
