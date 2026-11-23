import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

export const adminMw = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== 'admin') {
    next(createError(403, 'Forbidden: admin access required'));
    return;
  }
  next();
};
