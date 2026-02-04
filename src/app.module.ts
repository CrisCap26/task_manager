import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { TasksModule } from './context/tasks/module/tasks.module';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), TasksModule],
})
export class AppModule {}
