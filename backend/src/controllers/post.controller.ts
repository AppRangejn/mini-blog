import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { Op, Order, WhereOptions } from 'sequelize';
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

const resolvePostOrder = (rawSort: unknown): Order => {
  if (rawSort === 'oldest') return [['createdAt', 'ASC']];
  if (rawSort === 'title') return [['title', 'ASC']];
  return [['createdAt', 'DESC']];
};

const resolveSearchWhere = (rawSearch: unknown): WhereOptions => {
  const search = typeof rawSearch === 'string' ? rawSearch.trim() : '';
  if (!search) return {};

  const pattern = `%${search}%`;
  return {
    [Op.or]: [
      { title: { [Op.iLike]: pattern } },
      { excerpt: { [Op.iLike]: pattern } },
      { content: { [Op.iLike]: pattern } },
    ],
  };
};

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const order = resolvePostOrder(req.query.sort);
    const where = resolveSearchWhere(req.query.search);

    if (!req.query.page && !req.query.limit) {
      const posts = await Post.findAll({
        where,
        include: [authorInclude],
        order,
      });
      res.json(posts);
      return;
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 6));

    const { rows: posts, count: total } = await Post.findAndCountAll({
      where,
      include: [authorInclude],
      order,
      limit,
      offset: (page - 1) * limit,
    });

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
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
