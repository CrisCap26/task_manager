import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Función para parsear la URL de PostgreSQL de Railway
function parsePostgresUrl(url: string | undefined): {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
} | null {
  if (!url) return null;

  try {
    // Formato: postgresql://user:password@host:port/database
    const regex = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
    const match = url.match(regex);

    if (match) {
      return {
        username: match[1],
        password: match[2],
        host: match[3],
        port: parseInt(match[4], 10),
        database: match[5],
      };
    }
  } catch {
    // Ignorar errores de parsing
  }

  return null;
}

//优先使用 Railway 的 DATABASE_URL
const pgUrl = parsePostgresUrl(
  process.env.DATABASE_URL || process.env.POSTGRES_URL,
);

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: pgUrl?.host || process.env.DATABASE_HOST || 'localhost',
  port: pgUrl?.port || parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: pgUrl?.username || process.env.DATABASE_USER || 'postgres',
  password: pgUrl?.password || process.env.DATABASE_PASSWORD || '',
  database: pgUrl?.database || process.env.DATABASE_NAME || 'task_manager',
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV !== 'production',
  // SSL es necesario para Railway PostgreSQL
  ssl:
    process.env.DATABASE_SSL === 'true' || process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
};
