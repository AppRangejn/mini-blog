export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'mini_blog_token',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN: '/admin',
  postDetails: (id: number | string) => `/posts/${id}`,
} as const;

export const UI_LIMITS = {
  POST_PREVIEW_LENGTH: 140,
} as const;

export const VALIDATION_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 50,
  PASSWORD_MIN: 6,
  PASSWORD_MAX: 100,
  TITLE_MIN: 3,
  TITLE_MAX: 200,
  EXCERPT_MAX: 300,
  CONTENT_MIN: 10,
  IMAGE_URL_MAX: 255,
} as const;

export const POST_SORT = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  TITLE: 'title',
} as const;

export type PostSortOption = (typeof POST_SORT)[keyof typeof POST_SORT];

export const POST_SORT_OPTIONS: { value: PostSortOption; label: string }[] = [
  { value: POST_SORT.NEWEST, label: 'Newest' },
  { value: POST_SORT.OLDEST, label: 'Oldest' },
  { value: POST_SORT.TITLE, label: 'A–Z' },
];

export const PAGINATION_CONFIG = {
  FEED_LIMIT: 6,
  ADMIN_LIMIT: 5,
} as const;
