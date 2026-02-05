import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { AuditLogRepository } from '../../domain/repositories/audit-log.repository';
import { AuditLog, AuditAction } from '../../domain/entities/audit-log.entity';
import {
  AuditLogOrmEntity,
  AuditAction as AuditActionEnum,
} from './audit-log.orm-entity';

export class AuditLogTypeOrmRepository implements AuditLogRepository {
  constructor(
    @InjectRepository(AuditLogOrmEntity)
    private readonly repository: Repository<AuditLogOrmEntity>,
  ) {}

  async log(auditLog: AuditLog): Promise<AuditLog> {
    const ormLog = this.repository.create({
      userId: auditLog.userId,
      action: auditLog.action as AuditActionEnum,
      entityType: auditLog.entityType,
      entityId: auditLog.entityId,
      oldValue: auditLog.oldValue ? JSON.parse(auditLog.oldValue) : null,
      newValue: auditLog.newValue ? JSON.parse(auditLog.newValue) : null,
      ipAddress: auditLog.ipAddress,
      userAgent: auditLog.userAgent,
    });

    const saved = await this.repository.save(ormLog);

    return new AuditLog(
      saved.id,
      saved.userId,
      saved.action,
      saved.entityType,
      saved.entityId,
      saved.oldValue ? JSON.stringify(saved.oldValue) : null,
      saved.newValue ? JSON.stringify(saved.newValue) : null,
      saved.ipAddress,
      saved.userAgent,
      saved.createdAt,
    );
  }

  async findByUser(
    userId: string,
    limit = 100,
    offset = 0,
  ): Promise<AuditLog[]> {
    const logs = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return logs.map(
      (log) =>
        new AuditLog(
          log.id,
          log.userId,
          log.action,
          log.entityType,
          log.entityId,
          log.oldValue ? JSON.stringify(log.oldValue) : null,
          log.newValue ? JSON.stringify(log.newValue) : null,
          log.ipAddress,
          log.userAgent,
          log.createdAt,
        ),
    );
  }

  async findByEntity(
    entityType: string,
    entityId: number,
  ): Promise<AuditLog[]> {
    const logs = await this.repository.find({
      where: { entityType, entityId },
      order: { createdAt: 'DESC' },
    });

    return logs.map(
      (log) =>
        new AuditLog(
          log.id,
          log.userId,
          log.action,
          log.entityType,
          log.entityId,
          log.oldValue ? JSON.stringify(log.oldValue) : null,
          log.newValue ? JSON.stringify(log.newValue) : null,
          log.ipAddress,
          log.userAgent,
          log.createdAt,
        ),
    );
  }

  async findByAction(action: AuditAction): Promise<AuditLog[]> {
    const logs = await this.repository.find({
      where: { action: action as AuditActionEnum },
      order: { createdAt: 'DESC' },
    });

    return logs.map(
      (log) =>
        new AuditLog(
          log.id,
          log.userId,
          log.action,
          log.entityType,
          log.entityId,
          log.oldValue ? JSON.stringify(log.oldValue) : null,
          log.newValue ? JSON.stringify(log.newValue) : null,
          log.ipAddress,
          log.userAgent,
          log.createdAt,
        ),
    );
  }

  async count(userId?: string): Promise<number> {
    if (userId) {
      return this.repository.count({ where: { userId } });
    }
    return this.repository.count();
  }
}
