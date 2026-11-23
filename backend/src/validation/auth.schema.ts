import * as yup from 'yup';
import { VALIDATION_LIMITS } from '../constants';

export const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(
      VALIDATION_LIMITS.NAME_MIN,
      `Name must be at least ${VALIDATION_LIMITS.NAME_MIN} characters`,
    )
    .max(VALIDATION_LIMITS.NAME_MAX)
    .required('Name is required'),
  email: yup
    .string()
    .trim()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(
      VALIDATION_LIMITS.PASSWORD_MIN,
      `Password must be at least ${VALIDATION_LIMITS.PASSWORD_MIN} characters`,
    )
    .max(VALIDATION_LIMITS.PASSWORD_MAX)
    .required('Password is required'),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});
