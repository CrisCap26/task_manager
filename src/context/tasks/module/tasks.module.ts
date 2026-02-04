import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Application
import { TaskService } from '../application/services/task.service';

// Infrastructure
import { TaskController } from '../infrastructure/controllers/task.controller';
import { TaskOrmEntity } from '../infrastructure/persistence/task.orm-entity';
import { TaskTypeOrmRepository } from '../infrastructure/persistence/task.typeorm.repository';

// Domain
import { TaskRepository } from '../domain/repositories/task.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TaskOrmEntity])],
  controllers: [TaskController],
  providers: [
    // Caso de uso
    {
      provide: TaskService,
      useFactory: (repository: TaskRepository) => {
        return new TaskService(repository);
      },
      inject: ['TaskRepository'],
    },

    // Implementación del repositorio
    {
      provide: 'TaskRepository',
      useClass: TaskTypeOrmRepository,
    },
  ],
})
export class TasksModule {}
