import { Injectable, ForbiddenException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from './dto/pagination.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private prisma: PrismaService) {}

  async getAllUsers(query: PaginationDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStats() {
    const [totalUsers, totalProjects, totalTasks, tasksByStatus, tasksByPriority] =
      await this.prisma.$transaction([
        this.prisma.user.count(),
        this.prisma.project.count(),
        this.prisma.task.count(),
        this.prisma.task.groupBy({
          by: ['status'],
          _count: {
            status: true,
          },
          orderBy: {
            status: 'asc',
          },
        }),
        this.prisma.task.groupBy({
          by: ['priority'],
          _count: {
            priority: true,
          },
          orderBy: {
            priority: 'asc',
          },
        }),
      ]);

    const statusCounts: Record<string, number> = {
      TODO: 0,
      IN_PROGRESS: 0,
      IN_REVIEW: 0,
      DONE: 0,
    };

    for (const group of tasksByStatus) {
      if (group._count && typeof group._count === 'object' && 'status' in group._count) {
        statusCounts[group.status] = group._count.status as number;
      }
    }

    const priorityCounts: Record<string, number> = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      URGENT: 0,
    };

    for (const group of tasksByPriority) {
      if (group._count && typeof group._count === 'object' && 'priority' in group._count) {
        priorityCounts[group.priority] = group._count.priority as number;
      }
    }

    return {
      totalUsers,
      totalProjects,
      totalTasks,
      tasksByStatus: statusCounts,
      tasksByPriority: priorityCounts,
    };
  }

  async updateUserRole(userId: string, role: Role) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === Role.ADMIN && role === Role.USER) {
      const adminCount = await this.prisma.user.count({
        where: { role: Role.ADMIN },
      });

      if (adminCount <= 1) {
        throw new ForbiddenException('Cannot demote last admin user');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async getAllProjects(query: PaginationDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [projects, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        skip,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.project.count(),
    ]);

    return {
      data: projects,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
