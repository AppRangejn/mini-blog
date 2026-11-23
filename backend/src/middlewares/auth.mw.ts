import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { UserRole } from '../constants';

interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
}

export const authMw = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    next(createError(401, 'Unauthorized: token missing'));
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET!;
    req.user = jwt.verify(token, secret) as JwtPayload;
    next();
  } catch {
    next(createError(401, 'Invalid or expired token'));
  }
};
