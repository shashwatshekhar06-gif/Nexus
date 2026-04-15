import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { UserTasksController } from './user-tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController, UserTasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
