import { Router } from 'express';
import { getMe, login, register } from '../controllers/auth.controller';
import { authMw } from '../middlewares/auth.mw';
import { validate } from '../middlewares/validate.mw';
import { loginSchema, registerSchema } from '../validation/auth.schema';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authMw, getMe);

export default router;
