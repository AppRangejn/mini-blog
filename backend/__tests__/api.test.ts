import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AUTH_CONFIG, ROLES } from '../src/constants';

process.env.JWT_SECRET = 'test-jwt-secret-key';

const { mockUserModel, mockPostModel } = vi.hoisted(() => ({
  mockUserModel: {
    findOne: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
  },
  mockPostModel: {
    findAll: vi.fn(),
    findAndCountAll: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock('../src/database/models', () => ({
  User: mockUserModel,
  Post: mockPostModel,
}));

import app from '../src/app';

const signTestToken = (payload: {
  id: number;
  email: string;
  role: 'user' | 'admin';
}) =>
  jwt.sign(
    { ...payload, type: AUTH_CONFIG.JWT_TOKEN_TYPE },
    process.env.JWT_SECRET!,
    {
      expiresIn: '1h',
      issuer: AUTH_CONFIG.JWT_ISSUER,
      audience: AUTH_CONFIG.JWT_AUDIENCE,
    },
  );

describe('Mini-Blog API integration tests', () => {
  let passwordHash = '';

  beforeAll(async () => {
    passwordHash = await bcrypt.hash('StrongPass123!', 4);
  });

  describe('Auth endpoints', () => {
    it('registers a new user with normalized email and returns JWT', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue({
        id: 1,
        name: 'Kiril',
        email: 'kiril@example.com',
        role: ROLES.USER,
      });

      const res = await request(app).post('/api/auth/register').send({
        name: 'Kiril',
        email: '  KIRIL@Example.COM ',
        password: 'StrongPass123!',
      });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeTypeOf('string');
      expect(res.body.user.email).toBe('kiril@example.com');
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: { email: 'kiril@example.com' },
      });
    });

    it('rejects duplicate email registration with 409', async () => {
      mockUserModel.findOne.mockResolvedValue({
        id: 1,
        email: 'kiril@example.com',
      });

      const res = await request(app).post('/api/auth/register').send({
        name: 'Kiril',
        email: 'kiril@example.com',
        password: 'StrongPass123!',
      });

      expect(res.status).toBe(409);
    });

    it('logs in valid user and rejects wrong password', async () => {
      mockUserModel.findOne.mockResolvedValue({
        id: 1,
        name: 'Kiril',
        email: 'kiril@example.com',
        password: passwordHash,
        role: ROLES.USER,
      });

      const okRes = await request(app).post('/api/auth/login').send({
        email: 'kiril@example.com',
        password: 'StrongPass123!',
      });
      expect(okRes.status).toBe(200);
      expect(okRes.body.token).toBeTypeOf('string');

      const badRes = await request(app).post('/api/auth/login').send({
        email: 'kiril@example.com',
        password: 'WrongPassword!',
      });
      expect(badRes.status).toBe(401);
    });

    it('rejects invalid or malformed JWT on /api/auth/me', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.jwt.token');

      expect(res.status).toBe(401);
    });
  });

  describe('Posts CRUD, RBAC and filtering', () => {
    it('forbids regular user from creating a post (403)', async () => {
      const userToken = signTestToken({
        id: 2,
        email: 'user@example.com',
        role: ROLES.USER,
      });

      mockUserModel.findByPk.mockResolvedValue({
        id: 2,
        email: 'user@example.com',
        role: ROLES.USER,
      });

      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Unauthorized Post',
          content: 'Regular user should not pass admin middleware',
        });

      expect(res.status).toBe(403);
    });

    it('allows admin to create, update and delete a post', async () => {
      const adminToken = signTestToken({
        id: 1,
        email: 'admin@example.com',
        role: ROLES.ADMIN,
      });

      mockUserModel.findByPk.mockResolvedValue({
        id: 1,
        email: 'admin@example.com',
        role: ROLES.ADMIN,
      });

      const createdRecord = {
        id: 10,
        title: 'Test Post',
        excerpt: 'Summary',
        content: 'Detailed content for testing post creation',
        imageUrl: null,
        authorId: 1,
      };

      mockPostModel.create.mockResolvedValue(createdRecord);
      mockPostModel.findByPk.mockResolvedValue({
        ...createdRecord,
        update: vi.fn().mockResolvedValue(true),
        destroy: vi.fn().mockResolvedValue(true),
      });

      const createRes = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Test Post',
          excerpt: 'Summary',
          content: 'Detailed content for testing post creation',
        });
      expect(createRes.status).toBe(201);

      const updateRes = await request(app)
        .put('/api/posts/10')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Updated Title' });
      expect(updateRes.status).toBe(200);

      const deleteRes = await request(app)
        .delete('/api/posts/10')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(deleteRes.status).toBe(200);
    });

    it('returns paginated, sorted and searched posts', async () => {
      mockPostModel.findAndCountAll.mockResolvedValue({
        rows: [{ id: 1, title: 'Weekend Trip' }],
        count: 1,
      });

      const res = await request(app).get(
        '/api/posts?page=1&limit=6&sort=title&search=weekend',
      );

      expect(res.status).toBe(200);
      expect(res.body.posts).toHaveLength(1);
      expect(res.body.pagination).toEqual({
        page: 1,
        limit: 6,
        total: 1,
        totalPages: 1,
      });
    });

    it('returns 404 when deleting a non-existent post', async () => {
      const adminToken = signTestToken({
        id: 1,
        email: 'admin@example.com',
        role: ROLES.ADMIN,
      });

      mockUserModel.findByPk.mockResolvedValue({
        id: 1,
        email: 'admin@example.com',
        role: ROLES.ADMIN,
      });
      mockPostModel.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/posts/9999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });
});
