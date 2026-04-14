import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

describe('Admin (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userToken: string;
  let adminToken: string;
  let adminId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('Test@123', 12);

    await prisma.user.create({
      data: {
        email: 'user@nexus.dev',
        password: hashedPassword,
        name: 'Test User',
        role: Role.USER,
      },
    });

    const admin = await prisma.user.create({
      data: {
        email: 'admin@nexus.dev',
        password: hashedPassword,
        name: 'Admin User',
        role: Role.ADMIN,
      },
    });
    adminId = admin.id;

    const userLoginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'user@nexus.dev',
        password: 'Test@123',
      });
    userToken = userLoginResponse.body.data.accessToken;

    const adminLoginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@nexus.dev',
        password: 'Test@123',
      });
    adminToken = adminLoginResponse.body.data.accessToken;
  });

  describe('GET /api/v1/admin/users', () => {
    it('should return all users for ADMIN', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].password).toBeUndefined();
      expect(response.body.meta).toBeDefined();
    });

    it('should return 403 for USER role', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('GET /api/v1/admin/stats', () => {
    beforeEach(async () => {
      const user = await prisma.user.findFirst({ where: { role: Role.USER } });
      const project = await prisma.project.create({
        data: {
          name: 'Test Project',
          ownerId: user!.id,
        },
      });

      await prisma.task.createMany({
        data: [
          { title: 'Task 1', projectId: project.id, status: 'TODO', priority: 'HIGH' },
          { title: 'Task 2', projectId: project.id, status: 'DONE', priority: 'LOW' },
        ],
      });
    });

    it('should return accurate statistics for ADMIN', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalUsers).toBe(2);
      expect(response.body.data.totalProjects).toBe(1);
      expect(response.body.data.totalTasks).toBe(2);
      expect(response.body.data.tasksByStatus).toBeDefined();
      expect(response.body.data.tasksByPriority).toBeDefined();
    });

    it('should return 403 for USER role', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/stats')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('PATCH /api/v1/admin/users/:id/role', () => {
    let targetUserId: string;

    beforeEach(async () => {
      const user = await prisma.user.findFirst({ where: { role: Role.USER } });
      targetUserId = user!.id;
    });

    it('should update user role for ADMIN', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/admin/users/${targetUserId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'ADMIN' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.role).toBe('ADMIN');
    });

    it('should prevent demoting last admin', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/admin/users/${adminId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'USER' })
        .expect(403);
    });

    it('should return 403 for USER role', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/admin/users/${targetUserId}/role`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ role: 'ADMIN' })
        .expect(403);
    });
  });

  describe('GET /api/v1/admin/projects', () => {
    beforeEach(async () => {
      const user = await prisma.user.findFirst({ where: { role: Role.USER } });
      await prisma.project.create({
        data: {
          name: 'Test Project',
          ownerId: user!.id,
        },
      });
    });

    it('should return all projects for ADMIN', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/projects')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].owner).toBeDefined();
      expect(response.body.meta).toBeDefined();
    });

    it('should return 403 for USER role', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/projects')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });
});
