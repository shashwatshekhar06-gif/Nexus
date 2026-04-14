import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import * as bcrypt from 'bcryptjs';
import { Role, ProjectStatus } from '@prisma/client';

describe('Tasks (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userToken: string;
  let adminToken: string;
  let userId: string;
  let projectId: string;

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

    await prisma.user.create({
      data: {
        email: 'admin@nexus.dev',
        password: hashedPassword,
        name: 'Admin User',
        role: Role.ADMIN,
      },
    });

    const project = await prisma.project.create({
      data: {
        name: 'Test Project',
        ownerId: userId,
      },
    });
    projectId = project.id;

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

  describe('POST /api/v1/projects/:projectId/tasks', () => {
    it('should create task in own project', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/v1/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Test Task',
          description: 'Test Description',
          priority: 'HIGH',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Test Task');
      expect(response.body.data.status).toBe('TODO');
      expect(response.body.data.priority).toBe('HIGH');
    });

    it('should return 403 when creating task in ARCHIVED project', async () => {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: ProjectStatus.ARCHIVED },
      });

      await request(app.getHttpServer())
        .post(`/api/v1/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Test Task',
        })
        .expect(403);
    });

    it('should return 404 for invalid assigneeId', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Test Task',
          assigneeId: '123e4567-e89b-12d3-a456-426614174000',
        })
        .expect(404);
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
        .post(`/api/v1/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${otherLoginResponse.body.data.accessToken}`)
        .send({
          title: 'Test Task',
        })
        .expect(403);
    });
  });

  describe('GET /api/v1/projects/:projectId/tasks/:id', () => {
    let taskId: string;

    beforeEach(async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Test Task',
          projectId: projectId,
        },
      });
      taskId = task.id;
    });

    it('should retrieve task from own project', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/projects/${projectId}/tasks/${taskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(taskId);
    });
  });

  describe('PATCH /api/v1/projects/:projectId/tasks/:id', () => {
    let taskId: string;

    beforeEach(async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Test Task',
          projectId: projectId,
        },
      });
      taskId = task.id;
    });

    it('should update task status to DONE', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/projects/${projectId}/tasks/${taskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          status: 'DONE',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('DONE');
    });

    it('should return 403 when updating task in ARCHIVED project', async () => {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: ProjectStatus.ARCHIVED },
      });

      await request(app.getHttpServer())
        .patch(`/api/v1/projects/${projectId}/tasks/${taskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Updated Title',
        })
        .expect(403);
    });
  });

  describe('DELETE /api/v1/projects/:projectId/tasks/:id', () => {
    let taskId: string;

    beforeEach(async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Test Task',
          projectId: projectId,
        },
      });
      taskId = task.id;
    });

    it('should delete task', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/projects/${projectId}/tasks/${taskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(204);

      const task = await prisma.task.findUnique({ where: { id: taskId } });
      expect(task).toBeNull();
    });
  });

  describe('Admin access to tasks', () => {
    let taskId: string;

    beforeEach(async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Test Task',
          projectId: projectId,
        },
      });
      taskId = task.id;
    });

    it('should allow ADMIN to access any task', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/projects/${projectId}/tasks/${taskId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
