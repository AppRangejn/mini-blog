export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const AUTH_CONFIG = {
  SALT_ROUNDS: 10,
  JWT_EXPIRES_IN: '2h',
  JWT_ISSUER: 'mini-blog-api',
  JWT_AUDIENCE: 'mini-blog-client',
  JWT_TOKEN_TYPE: 'access',
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
