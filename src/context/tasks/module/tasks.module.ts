import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskOrmEntity } from '../infrastructure/persistence/task.orm-entity';
import { TaskController } from '../infrastructure/controllers/tasks.controller';
import { TaskService } from '../application/services/task.service';
import { TaskTypeOrmRepository } from '../infrastructure/persistence/task.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TaskOrmEntity])],
  controllers: [TaskController],
  providers: [
    TaskService,
    {
      provide: 'TaskRepository',
      useClass: TaskTypeOrmRepository,
    },
  ],
})
export class TasksModule {}
