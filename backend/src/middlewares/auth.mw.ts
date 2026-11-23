import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG, UserRole } from '../constants';
import { User } from '../database/models';

interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
  type?: string;
}

export const authMw = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    next(createError(401, 'Unauthorized: token missing'));
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret, {
      issuer: AUTH_CONFIG.JWT_ISSUER,
      audience: AUTH_CONFIG.JWT_AUDIENCE,
    }) as JwtPayload;

    if (decoded.type !== AUTH_CONFIG.JWT_TOKEN_TYPE || !decoded.id) {
      next(createError(401, 'Invalid token type'));
      return;
    }

    const dbUser = await User.findByPk(decoded.id, {
      attributes: ['id', 'email', 'role'],
    });

    if (!dbUser) {
      next(createError(401, 'User no longer exists'));
      return;
    }

    req.user = {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
    };
    next();
  } catch {
    next(createError(401, 'Invalid or expired token'));
  }
};
