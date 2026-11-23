import { VALIDATION_LIMITS } from '@/constants';
import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(
      VALIDATION_LIMITS.PASSWORD_MIN,
      `Minimum ${VALIDATION_LIMITS.PASSWORD_MIN} characters`,
    )
    .max(
      VALIDATION_LIMITS.PASSWORD_MAX,
      `Maximum ${VALIDATION_LIMITS.PASSWORD_MAX} characters`,
    )
    .required('Password is required'),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(
      VALIDATION_LIMITS.NAME_MIN,
      `Minimum ${VALIDATION_LIMITS.NAME_MIN} characters`,
    )
    .max(
      VALIDATION_LIMITS.NAME_MAX,
      `Maximum ${VALIDATION_LIMITS.NAME_MAX} characters`,
    )
    .required('Name is required'),
  email: yup
    .string()
    .trim()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(
      VALIDATION_LIMITS.PASSWORD_MIN,
      `Minimum ${VALIDATION_LIMITS.PASSWORD_MIN} characters`,
    )
    .max(
      VALIDATION_LIMITS.PASSWORD_MAX,
      `Maximum ${VALIDATION_LIMITS.PASSWORD_MAX} characters`,
    )
    .required('Password is required'),
});

export const postSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(
      VALIDATION_LIMITS.TITLE_MIN,
      `Minimum ${VALIDATION_LIMITS.TITLE_MIN} characters`,
    )
    .max(
      VALIDATION_LIMITS.TITLE_MAX,
      `Maximum ${VALIDATION_LIMITS.TITLE_MAX} characters`,
    )
    .required('Title is required'),
  excerpt: yup
    .string()
    .trim()
    .max(
      VALIDATION_LIMITS.EXCERPT_MAX,
      `Excerpt cannot exceed ${VALIDATION_LIMITS.EXCERPT_MAX} characters`,
    )
    .optional(),
  content: yup
    .string()
    .trim()
    .min(
      VALIDATION_LIMITS.CONTENT_MIN,
      `Content must be at least ${VALIDATION_LIMITS.CONTENT_MIN} characters`,
    )
    .required('Content is required'),
  imageUrl: yup
    .string()
    .trim()
    .max(
      VALIDATION_LIMITS.IMAGE_URL_MAX,
      `URL cannot exceed ${VALIDATION_LIMITS.IMAGE_URL_MAX} characters`,
    )
    .test(
      'valid-url',
      'Enter a valid image URL (http:// or https://)',
      (value) => {
        if (!value) return true;
        return yup.string().url().isValidSync(value);
      },
    )
    .optional(),
});
