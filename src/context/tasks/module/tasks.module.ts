import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { TaskOrmEntity } from '../infrastructure/persistence/task.orm-entity';
import { AuditLogOrmEntity } from '../infrastructure/persistence/audit-log.orm-entity';
import { TaskController } from '../infrastructure/controllers/tasks.controller';
import { TaskService } from '../application/services/task.service';
import { AuditLogService } from '../application/services/audit-log.service';
import { TaskTypeOrmRepository } from '../infrastructure/persistence/task.typeorm.repository';
import { AuditLogTypeOrmRepository } from '../infrastructure/persistence/audit-log.typeorm.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskOrmEntity, AuditLogOrmEntity]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [TaskController],
  providers: [
    TaskService,
    AuditLogService,
    {
      provide: 'TaskRepository',
      useClass: TaskTypeOrmRepository,
    },
    {
      provide: 'AuditLogRepository',
      useClass: AuditLogTypeOrmRepository,
    },
  ],
})
export class TasksModule {}
