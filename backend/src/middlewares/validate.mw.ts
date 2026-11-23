import { NextFunction, Request, Response } from 'express';
import { AnyObjectSchema } from 'yup';

export const validate =
  (schema: AnyObjectSchema) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      next();
    } catch (err) {
      next(err);
    }
  };
