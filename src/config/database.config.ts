import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: (process.env.DB_TYPE as 'mysql' | 'postgres') || 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306', 10),
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'task_manager',
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV !== 'production',
  // SSL es necesario para Railway PostgreSQL
  ssl:
    process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  // Para MySQL local
  extra:
    process.env.DB_TYPE === 'mysql'
      ? {
          supportBigNumbers: true,
          bigNumberStrings: false,
        }
      : undefined,
};
