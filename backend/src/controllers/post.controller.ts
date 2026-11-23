import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { Post, User } from '../database/models';

const authorInclude = {
  model: User,
  as: 'author',
  attributes: ['id', 'name'],
};

const parsePostId = (rawId: string | string[] | undefined): number => {
  const id = Number(rawId);
  if (!rawId || !Number.isInteger(id) || id <= 0) {
    throw createError(400, 'Invalid post ID');
  }
  return id;
};

export const getAllPosts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const posts = await Post.findAll({
      include: [authorInclude],
      order: [['createdAt', 'DESC']],
    });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parsePostId(req.params.id);

    const post = await Post.findByPk(id, {
      include: [authorInclude],
    });
    if (!post) {
      throw createError(404, 'Post not found');
    }

    res.json(post);
  } catch (err) {
    next(err);
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, excerpt, content, imageUrl } = req.body;

    const post = await Post.create({
      title,
      excerpt: excerpt || null,
      content,
      imageUrl: imageUrl || null,
      authorId: req.user!.id,
    });

    const createdPost = await Post.findByPk(post.id, {
      include: [authorInclude],
    });

    res.status(201).json(createdPost);
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, excerpt, content, imageUrl } = req.body;
    const id = parsePostId(req.params.id);

    const post = await Post.findByPk(id);
    if (!post) {
      throw createError(404, 'Post not found');
    }

    await post.update({ title, excerpt, content, imageUrl });

    const updatedPost = await Post.findByPk(post.id, {
      include: [authorInclude],
    });

    res.json(updatedPost);
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parsePostId(req.params.id);

    const post = await Post.findByPk(id);
    if (!post) {
      throw createError(404, 'Post not found');
    }

    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
};
