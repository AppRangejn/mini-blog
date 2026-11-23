import * as yup from 'yup';

const optionalString = yup
  .string()
  .trim()
  .transform((val) => (val === '' ? null : val))
  .nullable()
  .optional();

export const createPostSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(200)
    .required('Title is required'),
  excerpt: optionalString.max(300, 'Excerpt must be at most 300 characters'),
  content: yup
    .string()
    .trim()
    .min(10, 'Content must be at least 10 characters')
    .required('Content is required'),
  imageUrl: optionalString.url('Image URL must be a valid URL'),
});

export const updatePostSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(200)
    .optional(),
  excerpt: optionalString.max(300, 'Excerpt must be at most 300 characters'),
  content: yup
    .string()
    .trim()
    .min(10, 'Content must be at least 10 characters')
    .optional(),
  imageUrl: optionalString.url('Image URL must be a valid URL'),
});
