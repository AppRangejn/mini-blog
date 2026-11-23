import { Router } from 'express';
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from '../controllers/post.controller';
import { adminMw } from '../middlewares/admin.mw';
import { authMw } from '../middlewares/auth.mw';
import { validate } from '../middlewares/validate.mw';
import { createPostSchema, updatePostSchema } from '../validation/post.schema';

const router = Router();

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', authMw, adminMw, validate(createPostSchema), createPost);
router.put('/:id', authMw, adminMw, validate(updatePostSchema), updatePost);
router.delete('/:id', authMw, adminMw, deletePost);

export default router;
