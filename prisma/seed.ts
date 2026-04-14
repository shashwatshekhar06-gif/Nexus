import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const { Role, ProjectStatus, TaskStatus, TaskPriority } = {
  Role: { USER: 'USER', ADMIN: 'ADMIN' },
  ProjectStatus: { ACTIVE: 'ACTIVE', ARCHIVED: 'ARCHIVED' },
  TaskStatus: { TODO: 'TODO', IN_PROGRESS: 'IN_PROGRESS', IN_REVIEW: 'IN_REVIEW', DONE: 'DONE' },
  TaskPriority: { LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH', URGENT: 'URGENT' },
} as const;

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin@123', 12);
  const hashedUserPassword = await bcrypt.hash('User@123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@nexus.dev' },
    update: {},
    create: {
      email: 'admin@nexus.dev',
      password: hashedPassword,
      name: 'Admin User',
      role: Role.ADMIN,
    },
  });

  const alice = await prisma.user.upsert({
    where: { email: 'alice@nexus.dev' },
    update: {},
    create: {
      email: 'alice@nexus.dev',
      password: hashedUserPassword,
      name: 'Alice Johnson',
      role: Role.USER,
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@nexus.dev' },
    update: {},
    create: {
      email: 'bob@nexus.dev',
      password: hashedUserPassword,
      name: 'Bob Smith',
      role: Role.USER,
    },
  });

  const aliceProjects = [
    { name: 'Mobile App Redesign', description: 'Complete UI/UX overhaul' },
    { name: 'API Integration', description: 'Integrate third-party APIs' },
    { name: 'Database Migration', description: 'Migrate to PostgreSQL' },
  ];

  for (const projectData of aliceProjects) {
    const project = await prisma.project.upsert({
      where: { id: `${alice.id}-${projectData.name}` },
      update: {},
      create: {
        id: `${alice.id}-${projectData.name}`,
        name: projectData.name,
        description: projectData.description,
        status: ProjectStatus.ACTIVE,
        ownerId: alice.id,
      },
    });

    const tasks = [
      {
        title: `${projectData.name} - Task 1`,
        description: 'First task',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
      },
      {
        title: `${projectData.name} - Task 2`,
        description: 'Second task',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
      },
      {
        title: `${projectData.name} - Task 3`,
        description: 'Third task',
        status: TaskStatus.IN_REVIEW,
        priority: TaskPriority.LOW,
      },
      {
        title: `${projectData.name} - Task 4`,
        description: 'Fourth task',
        status: TaskStatus.DONE,
        priority: TaskPriority.URGENT,
      },
    ];

    for (const taskData of tasks) {
      await prisma.task.upsert({
        where: { id: `${project.id}-${taskData.title}` },
        update: {},
        create: {
          id: `${project.id}-${taskData.title}`,
          ...taskData,
          projectId: project.id,
          assigneeId: alice.id,
        },
      });
    }
  }

  const bobProjects = [
    { name: 'E-commerce Platform', description: 'Build online store' },
    { name: 'Analytics Dashboard', description: 'Real-time analytics' },
  ];

  for (const projectData of bobProjects) {
    const project = await prisma.project.upsert({
      where: { id: `${bob.id}-${projectData.name}` },
      update: {},
      create: {
        id: `${bob.id}-${projectData.name}`,
        name: projectData.name,
        description: projectData.description,
        status: ProjectStatus.ACTIVE,
        ownerId: bob.id,
      },
    });

    const tasks = [
      {
        title: `${projectData.name} - Task 1`,
        description: 'First task',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
      },
      {
        title: `${projectData.name} - Task 2`,
        description: 'Second task',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
      },
      {
        title: `${projectData.name} - Task 3`,
        description: 'Third task',
        status: TaskStatus.DONE,
        priority: TaskPriority.LOW,
      },
      {
        title: `${projectData.name} - Task 4`,
        description: 'Fourth task',
        status: TaskStatus.TODO,
        priority: TaskPriority.URGENT,
      },
    ];

    for (const taskData of tasks) {
      await prisma.task.upsert({
        where: { id: `${project.id}-${taskData.title}` },
        update: {},
        create: {
          id: `${project.id}-${taskData.title}`,
          ...taskData,
          projectId: project.id,
          assigneeId: bob.id,
        },
      });
    }
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
