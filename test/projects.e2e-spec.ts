import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

describe('Projects (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userToken: string;
  let adminToken: string;
  let userId: string;
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

    const user = await prisma.user.create({
      data: {
        email: 'user@nexus.dev',
        password: hashedPassword,
        name: 'Test User',
        role: Role.USER,
      },
    });
    userId = user.id;

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

  describe('POST /api/v1/projects', () => {
    it('should create project for authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Test Project',
          description: 'Test Description',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Project');
      expect(response.body.data.ownerId).toBe(userId);
      expect(response.body.data.status).toBe('ACTIVE');
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/projects')
        .send({
          name: 'Test Project',
        })
        .expect(401);
    });
  });

  describe('GET /api/v1/projects', () => {
    beforeEach(async () => {
      await prisma.project.create({
        data: {
          name: 'User Project',
          ownerId: userId,
        },
      });

      await prisma.project.create({
        data: {
          name: 'Admin Project',
          ownerId: adminId,
        },
      });
    });

    it('should return only own projects for USER role', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/projects')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('User Project');
      expect(response.body.meta).toBeDefined();
    });

    it('should return all projects for ADMIN role', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/projects')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should filter by status', async () => {
      await prisma.project.create({
        data: {
          name: 'Archived Project',
          ownerId: userId,
          status: 'ARCHIVED',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/projects?status=ACTIVE')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe('ACTIVE');
    });

    it('should search by name', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/projects?search=user')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toContain('User');
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    let projectId: string;

    beforeEach(async () => {
      const project = await prisma.project.create({
        data: {
          name: 'User Project',
          ownerId: userId,
        },
      });
      projectId = project.id;
    });

    it('should return project for owner', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(projectId);
    });

    it('should return 403 for non-owner USER', async () => {
      const otherUser = await prisma.user.create({
        data: {
          email: 'other@nexus.dev',
          password: await bcrypt.hash('Test@123', 12),
          name: 'Other User',
        },
      });

      const otherLoginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'other@nexus.dev',
          password: 'Test@123',
        });

      await request(app.getHttpServer())
        .get(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${otherLoginResponse.body.data.accessToken}`)
        .expect(403);
    });

    it('should allow ADMIN to access any project', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/projects/:id', () => {
    let projectId: string;

    beforeEach(async () => {
      const project = await prisma.project.create({
        data: {
          name: 'User Project',
          ownerId: userId,
        },
      });
      projectId = project.id;

      await prisma.task.create({
        data: {
          title: 'Test Task',
          projectId: projectId,
        },
      });
    });

    it('should delete project and cascade tasks', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(204);

      const project = await prisma.project.findUnique({ where: { id: projectId } });
      const tasks = await prisma.task.findMany({ where: { projectId } });

      expect(project).toBeNull();
      expect(tasks).toHaveLength(0);
    });
  });
});
