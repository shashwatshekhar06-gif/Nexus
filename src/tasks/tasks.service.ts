import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus, TaskPriority, ProjectStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private prisma: PrismaService) {}

  async validateProjectAccess(projectId: string, user: { id: string; role: string }) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        ownerId: true,
        status: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (user.role === 'USER' && project.ownerId !== user.id) {
      throw new ForbiddenException('Access denied to this project');
    }

    return project;
  }

  async create(projectId: string, dto: CreateTaskDto, user: { id: string; role: string }) {
    const project = await this.validateProjectAccess(projectId, user);

    if (project.status === ProjectStatus.ARCHIVED) {
      throw new ForbiddenException('Cannot create tasks in archived projects');
    }

    if (dto.assigneeId) {
      const assignee = await this.prisma.user.findUnique({
        where: { id: dto.assigneeId },
        select: { id: true },
      });

      if (!assignee) {
        throw new NotFoundException('Assignee user not found');
      }
    }

    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status || TaskStatus.TODO,
        priority: dto.priority || TaskPriority.MEDIUM,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        projectId: projectId,
        assigneeId: dto.assigneeId,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return task;
  }

  async findOne(projectId: string, taskId: string, user: { id: string; role: string }) {
    await this.validateProjectAccess(projectId, user);

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.projectId !== projectId) {
      throw new NotFoundException('Task not found in this project');
    }

    return task;
  }

  async update(
    projectId: string,
    taskId: string,
    dto: UpdateTaskDto,
    user: { id: string; role: string },
  ) {
    const project = await this.validateProjectAccess(projectId, user);

    if (project.status === ProjectStatus.ARCHIVED) {
      throw new ForbiddenException('Cannot update tasks in archived projects');
    }

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.projectId !== projectId) {
      throw new NotFoundException('Task not found in this project');
    }

    if (dto.assigneeId) {
      const assignee = await this.prisma.user.findUnique({
        where: { id: dto.assigneeId },
        select: { id: true },
      });

      if (!assignee) {
        throw new NotFoundException('Assignee user not found');
      }
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        assigneeId: dto.assigneeId,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updatedTask;
  }

  async remove(projectId: string, taskId: string, user: { id: string; role: string }) {
    await this.validateProjectAccess(projectId, user);

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.projectId !== projectId) {
      throw new NotFoundException('Task not found in this project');
    }

    await this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}
