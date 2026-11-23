import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG, ROLES } from '../constants';
import { User } from '../database/models';

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const formatUserPayload = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const signToken = (user: User): string =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      type: AUTH_CONFIG.JWT_TOKEN_TYPE,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: AUTH_CONFIG.JWT_EXPIRES_IN,
      issuer: AUTH_CONFIG.JWT_ISSUER,
      audience: AUTH_CONFIG.JWT_AUDIENCE,
    },
  );

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const name = String(req.body.name).trim();
    const email = normalizeEmail(String(req.body.email));
    const password = String(req.body.password);

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw createError(409, 'Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, AUTH_CONFIG.SALT_ROUNDS);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: ROLES.USER,
    });

    const token = signToken(user);
    res.status(201).json({
      token,
      user: formatUserPayload(user),
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const email = normalizeEmail(String(req.body.email));
    const password = String(req.body.password);

    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw createError(401, 'Invalid email or password');
    }

    const token = signToken(user);
    res.json({
      token,
      user: formatUserPayload(user),
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await User.findByPk(req.user!.id, {
      attributes: ['id', 'name', 'email', 'role'],
    });
    if (!user) {
      throw createError(404, 'User not found');
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};
