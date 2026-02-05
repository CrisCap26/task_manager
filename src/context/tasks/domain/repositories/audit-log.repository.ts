import { AuditLog, AuditAction } from '../entities/audit-log.entity';

export interface AuditLogRepository {
  log(auditLog: AuditLog): Promise<AuditLog>;
  findByUser(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<AuditLog[]>;
  findByEntity(entityType: string, entityId: number): Promise<AuditLog[]>;
  findByAction(action: AuditAction): Promise<AuditLog[]>;
  count(userId?: string): Promise<number>;
}
