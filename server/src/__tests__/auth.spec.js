import { describe, it, expect, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import { app, server } from '../server.js';
import prisma from '../config/database.js';

describe('Auth Endpoints Integration Tests', () => {
  const testEmail = 'jane_test@example.com';

  beforeAll(async () => {
    // Clean up leftovers
    await prisma.user.deleteMany({
      where: { email: testEmail },
    });
  });

  afterAll(async () => {
    // Clean up created user
    await prisma.user.deleteMany({
      where: { email: testEmail },
    });
    await new Promise((resolve) => server.close(resolve));
  });

  describe('POST /api/auth/register', () => {
    it('should block registration with invalid email format (Zod validation)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane',
          email: 'not-an-email',
          password: 'password123',
          role: 'CLIENT',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation Error');
      expect(res.body.errors[0].field).toBe('email');
    });

    it('should successfully register a user and return access token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: testEmail,
          password: 'password123',
          role: 'CLIENT',
        });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(testEmail);
      const cookies = res.headers['set-cookie'] || [];
      expect(cookies.some((c) => c.includes('refreshToken'))).toBe(true);
    });
  });
});
