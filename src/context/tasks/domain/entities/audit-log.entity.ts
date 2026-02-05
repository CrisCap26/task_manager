export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW';

export class AuditLog {
  constructor(
    public readonly id: number | null,
    public readonly userId: string,
    public readonly action: AuditAction,
    public readonly entityType: string,
    public readonly entityId: number,
    public readonly oldValue: string | null,
    public readonly newValue: string | null,
    public readonly ipAddress?: string,
    public readonly userAgent?: string,
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(params: {
    userId: string;
    action: AuditAction;
    entityType: string;
    entityId: number;
    oldValue?: Record<string, unknown>;
    newValue?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  }): AuditLog {
    return new AuditLog(
      null,
      params.userId,
      params.action,
      params.entityType,
      params.entityId,
      params.oldValue ? JSON.stringify(params.oldValue) : null,
      params.newValue ? JSON.stringify(params.newValue) : null,
      params.ipAddress,
      params.userAgent,
    );
  }
}
