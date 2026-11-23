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

export const VALIDATION_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 50,
  PASSWORD_MIN: 6,
  PASSWORD_MAX: 64,
  TITLE_MIN: 3,
  TITLE_MAX: 150,
  EXCERPT_MAX: 300,
  CONTENT_MIN: 10,
  IMAGE_URL_MAX: 500,
} as const;
