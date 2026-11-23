import * as yup from 'yup';

export const validateForm = async <S extends yup.ObjectSchema<yup.AnyObject>>(
  schema: S,
  data: unknown,
): Promise<{ data?: yup.InferType<S>; errors?: Record<string, string> }> => {
  try {
    const validated = await schema.validate(data, { abortEarly: false });
    return { data: validated };
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      err.inner.forEach((item) => {
        if (item.path && !errors[item.path]) {
          errors[item.path] = item.message;
        }
      });
      return { errors };
    }
    throw err;
  }
};
