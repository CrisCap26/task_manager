import { Inject, Injectable } from '@nestjs/common';
import type { AuditLogRepository } from '../../domain/repositories/audit-log.repository';
import { AuditLog, AuditAction } from '../../domain/entities/audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @Inject('AuditLogRepository')
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async log(params: {
    userId: string;
    action: AuditAction;
    entityType: string;
    entityId: number;
    oldValue?: Record<string, unknown>;
    newValue?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLog> {
    const auditLog = AuditLog.create(params);
    return this.auditLogRepository.log(auditLog);
  }

  async logTaskCreate(
    userId: string,
    taskId: number,
    taskData: Record<string, unknown>,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuditLog> {
    return this.log({
      userId,
      action: 'CREATE',
      entityType: 'TASK',
      entityId: taskId,
      newValue: taskData,
      ipAddress,
      userAgent,
    });
  }

  async logTaskUpdate(
    userId: string,
    taskId: number,
    oldData: Record<string, unknown>,
    newData: Record<string, unknown>,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuditLog> {
    return this.log({
      userId,
      action: 'UPDATE',
      entityType: 'TASK',
      entityId: taskId,
      oldValue: oldData,
      newValue: newData,
      ipAddress,
      userAgent,
    });
  }

  async logTaskDelete(
    userId: string,
    taskId: number,
    taskData: Record<string, unknown>,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuditLog> {
    return this.log({
      userId,
      action: 'DELETE',
      entityType: 'TASK',
      entityId: taskId,
      oldValue: taskData,
      ipAddress,
      userAgent,
    });
  }

  async logTaskView(
    userId: string,
    taskId: number,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuditLog> {
    return this.log({
      userId,
      action: 'VIEW',
      entityType: 'TASK',
      entityId: taskId,
      ipAddress,
      userAgent,
    });
  }

  async getLogsByUser(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository.findByUser(userId, limit, offset);
  }

  async getLogsByEntity(
    entityType: string,
    entityId: number,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository.findByEntity(entityType, entityId);
  }
}
