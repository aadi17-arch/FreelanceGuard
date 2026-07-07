import { describe, it, expect, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app, server } from '../server.js';
import prisma from '../config/database.js';

describe('Escrow Endpoints Integration Tests', () => {
  let clientUser;
  let freelancerUser;
  let project;
  let contract;
  let clientToken;

  beforeAll(async () => {
    // 1. Create client & freelancer
    clientUser = await prisma.user.create({
      data: {
        name: 'Test Client',
        email: `client_${Date.now()}@example.com`,
        password: 'hashedpassword',
        role: 'CLIENT',
        walletBalance: 0,
        heldAmount: 500,
      },
    });

    freelancerUser = await prisma.user.create({
      data: {
        name: 'Test Freelancer',
        email: `freelancer_${Date.now()}@example.com`,
        password: 'hashedpassword',
        role: 'FREELANCER',
        walletBalance: 0,
        heldAmount: 0,
      },
    });

    // 2. Create project
    project = await prisma.project.create({
      data: {
        title: 'Integration Test Project',
        description: 'Testing escrow releasing operations.',
        clientId: clientUser.id,
        budget: 500,
        status: 'IN_PROGRESS',
      },
    });

    // 3. Create contract
    contract = await prisma.contract.create({
      data: {
        projectId: project.id,
        freelancerId: freelancerUser.id,
        totalAmount: 500,
        heldAmount: 500,
        status: 'ACTIVE',
      },
    });

    // 4. Sign JWT for client
    clientToken = jwt.sign(
      { id: clientUser.id, role: clientUser.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Clean up database
    if (contract) await prisma.contract.deleteMany({ where: { id: contract.id } });
    if (project) await prisma.project.deleteMany({ where: { id: project.id } });
    if (clientUser) await prisma.user.deleteMany({ where: { id: clientUser.id } });
    if (freelancerUser) await prisma.user.deleteMany({ where: { id: freelancerUser.id } });
    
    await new Promise((resolve) => server.close(resolve));
  });

  describe('POST /api/escrow/release/:contractId', () => {
    it('should successfully release contract funds atomically using prisma transactions', async () => {
      const res = await request(app)
        .post(`/api/escrow/release/${contract.id}`)
        .set('Authorization', `Bearer ${clientToken}`)
        .send();

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Success');

      // Verify DB updates
      const updatedClient = await prisma.user.findUnique({ where: { id: clientUser.id } });
      const updatedFreelancer = await prisma.user.findUnique({ where: { id: freelancerUser.id } });
      const updatedContract = await prisma.contract.findUnique({ where: { id: contract.id } });

      // Held amount should be decremented to 0
      expect(Number(updatedClient.heldAmount)).toBe(0);
      // Freelancer wallet balance should be incremented to 500
      expect(Number(updatedFreelancer.walletBalance)).toBe(500);
      // Contract status should be COMPLETED
      expect(updatedContract.status).toBe('COMPLETED');
    });
  });
});
