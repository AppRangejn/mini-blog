import { VALIDATION_LIMITS } from '@/constants';
import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Введіть коректний email')
    .required("Email є обов'язковим"),
  password: yup
    .string()
    .min(
      VALIDATION_LIMITS.PASSWORD_MIN,
      `Мінімум ${VALIDATION_LIMITS.PASSWORD_MIN} символів`,
    )
    .max(
      VALIDATION_LIMITS.PASSWORD_MAX,
      `Максимум ${VALIDATION_LIMITS.PASSWORD_MAX} символів`,
    )
    .required("Пароль є обов'язковим"),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(
      VALIDATION_LIMITS.NAME_MIN,
      `Мінімум ${VALIDATION_LIMITS.NAME_MIN} символи`,
    )
    .max(
      VALIDATION_LIMITS.NAME_MAX,
      `Максимум ${VALIDATION_LIMITS.NAME_MAX} символів`,
    )
    .required("Ім'я є обов'язковим"),
  email: yup
    .string()
    .trim()
    .email('Введіть коректний email')
    .required("Email є обов'язковим"),
  password: yup
    .string()
    .min(
      VALIDATION_LIMITS.PASSWORD_MIN,
      `Мінімум ${VALIDATION_LIMITS.PASSWORD_MIN} символів`,
    )
    .max(
      VALIDATION_LIMITS.PASSWORD_MAX,
      `Максимум ${VALIDATION_LIMITS.PASSWORD_MAX} символів`,
    )
    .required("Пароль є обов'язковим"),
});

export const postSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(
      VALIDATION_LIMITS.TITLE_MIN,
      `Мінімум ${VALIDATION_LIMITS.TITLE_MIN} символи`,
    )
    .max(
      VALIDATION_LIMITS.TITLE_MAX,
      `Максимум ${VALIDATION_LIMITS.TITLE_MAX} символів`,
    )
    .required("Заголовок є обов'язковим"),
  excerpt: yup
    .string()
    .trim()
    .max(
      VALIDATION_LIMITS.EXCERPT_MAX,
      `Короткий опис не може перевищувати ${VALIDATION_LIMITS.EXCERPT_MAX} символів`,
    )
    .optional(),
  content: yup
    .string()
    .trim()
    .min(
      VALIDATION_LIMITS.CONTENT_MIN,
      `Текст поста має містити щонайменше ${VALIDATION_LIMITS.CONTENT_MIN} символів`,
    )
    .required("Текст поста є обов'язковим"),
  imageUrl: yup
    .string()
    .trim()
    .max(
      VALIDATION_LIMITS.IMAGE_URL_MAX,
      `Посилання не може перевищувати ${VALIDATION_LIMITS.IMAGE_URL_MAX} символів`,
    )
    .test(
      'valid-url',
      'Введіть коректний URL (http:// або https://)',
      (value) => {
        if (!value) return true;
        return /^https?:\/\/.+/.test(value);
      },
    )
    .optional(),
});
