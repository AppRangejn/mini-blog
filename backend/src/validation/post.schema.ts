import * as yup from 'yup';
import { VALIDATION_LIMITS } from '../constants';

const optionalString = yup
  .string()
  .trim()
  .transform((val) => (val === '' ? null : val))
  .nullable()
  .optional();

const optionalImageUrl = optionalString
  .max(
    VALIDATION_LIMITS.IMAGE_URL_MAX,
    `Image URL must be at most ${VALIDATION_LIMITS.IMAGE_URL_MAX} characters`,
  )
  .url('Image URL must be a valid URL')
  .matches(/^https?:\/\/.+/, 'Image URL must start with http:// or https://');

export const createPostSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(
      VALIDATION_LIMITS.TITLE_MIN,
      `Title must be at least ${VALIDATION_LIMITS.TITLE_MIN} characters`,
    )
    .max(VALIDATION_LIMITS.TITLE_MAX)
    .required('Title is required'),
  excerpt: optionalString.max(
    VALIDATION_LIMITS.EXCERPT_MAX,
    `Excerpt must be at most ${VALIDATION_LIMITS.EXCERPT_MAX} characters`,
  ),
  content: yup
    .string()
    .trim()
    .min(
      VALIDATION_LIMITS.CONTENT_MIN,
      `Content must be at least ${VALIDATION_LIMITS.CONTENT_MIN} characters`,
    )
    .required('Content is required'),
  imageUrl: optionalImageUrl,
});

export const updatePostSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(
      VALIDATION_LIMITS.TITLE_MIN,
      `Title must be at least ${VALIDATION_LIMITS.TITLE_MIN} characters`,
    )
    .max(VALIDATION_LIMITS.TITLE_MAX)
    .optional(),
  excerpt: optionalString.max(
    VALIDATION_LIMITS.EXCERPT_MAX,
    `Excerpt must be at most ${VALIDATION_LIMITS.EXCERPT_MAX} characters`,
  ),
  content: yup
    .string()
    .trim()
    .min(
      VALIDATION_LIMITS.CONTENT_MIN,
      `Content must be at least ${VALIDATION_LIMITS.CONTENT_MIN} characters`,
    )
    .optional(),
  imageUrl: optionalImageUrl,
});
