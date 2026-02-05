import { Inject, Injectable } from '@nestjs/common';
import type { TaskRepository } from '../../domain/repositories/task.repository';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';
import { Task } from '../../domain/entities/task.entity';
import { TaskSummary } from '../../domain/entities/task-summary';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TaskRepository')
    private readonly taskRepository: TaskRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(
    userId: string,
    dto: CreateTaskDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Task> {
    const task = Task.create({
      userId,
      title: dto.title,
      description: dto.description,
      completed: dto.completed,
      dueDate: new Date(dto.dueDate),
      isPublic: dto.isPublic,
      comments: dto.comments,
      responsible: dto.responsible,
      tags: dto.tags,
    });

    const createdTask = await this.taskRepository.create(task);

    // Log the creation
    await this.auditLogService.logTaskCreate(
      userId,
      createdTask.id!,
      {
        title: createdTask.title,
        description: createdTask.description,
        completed: createdTask.completed,
        dueDate: createdTask.dueDate.toISOString(),
        isPublic: createdTask.isPublic,
        comments: createdTask.comments,
        responsible: createdTask.responsible,
        tags: createdTask.tags,
      },
      ipAddress,
      userAgent,
    );

    return createdTask;
  }

  async getAll(
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<TaskSummary>> {
    const { tasks, total } = await this.taskRepository.findWithPagination(
      userId,
      paginationQuery,
    );

    return new PaginatedResponseDto<TaskSummary>(
      tasks,
      total,
      paginationQuery.page || 1,
      paginationQuery.limit || 10,
    );
  }

  async getPublicTasks(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<TaskSummary>> {
    const { tasks, total } =
      await this.taskRepository.findPublicTasks(paginationQuery);

    return new PaginatedResponseDto<TaskSummary>(
      tasks,
      total,
      paginationQuery.page || 1,
      paginationQuery.limit || 10,
    );
  }

  async getById(
    id: number,
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Task | null> {
    const task = await this.taskRepository.findByIdAccessible(id, userId);

    if (task) {
      // Log the view
      await this.auditLogService.logTaskView(userId, id, ipAddress, userAgent);
    }

    return task;
  }

  async update(
    id: number,
    userId: string,
    dto: UpdateTaskDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Task> {
    const existingTask = await this.taskRepository.findById(id, userId);

    if (!existingTask) {
      throw new Error('Task not found');
    }

    const updatedTask = new Task(
      existingTask.id,
      userId,
      dto.title ?? existingTask.title,
      dto.description ?? existingTask.description,
      dto.completed ?? existingTask.completed,
      dto.dueDate ? new Date(dto.dueDate) : existingTask.dueDate,
      dto.isPublic ?? existingTask.isPublic,
      dto.comments ?? existingTask.comments,
      dto.responsible ?? existingTask.responsible,
      dto.tags ?? existingTask.tags,
      existingTask.filePath,
      existingTask.fileName,
      existingTask.fileSize,
      existingTask.fileMimeType,
    );

    const savedTask = await this.taskRepository.update(updatedTask);

    // Log the update with old and new values
    await this.auditLogService.logTaskUpdate(
      userId,
      id,
      {
        title: existingTask.title,
        description: existingTask.description,
        completed: existingTask.completed,
        dueDate: existingTask.dueDate.toISOString(),
        isPublic: existingTask.isPublic,
        comments: existingTask.comments,
        responsible: existingTask.responsible,
        tags: existingTask.tags,
      },
      {
        title: savedTask.title,
        description: savedTask.description,
        completed: savedTask.completed,
        dueDate: savedTask.dueDate.toISOString(),
        isPublic: savedTask.isPublic,
        comments: savedTask.comments,
        responsible: savedTask.responsible,
        tags: savedTask.tags,
      },
      ipAddress,
      userAgent,
    );

    return savedTask;
  }

  async delete(
    id: number,
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    const existingTask = await this.taskRepository.findById(id, userId);

    if (!existingTask) {
      throw new Error('Task not found');
    }

    // Log before deletion
    await this.auditLogService.logTaskDelete(
      userId,
      id,
      {
        title: existingTask.title,
        description: existingTask.description,
        completed: existingTask.completed,
        dueDate: existingTask.dueDate.toISOString(),
        isPublic: existingTask.isPublic,
        comments: existingTask.comments,
        responsible: existingTask.responsible,
        tags: existingTask.tags,
      },
      ipAddress,
      userAgent,
    );

    return this.taskRepository.delete(id, userId);
  }

  async uploadFile(
    id: number,
    userId: string,
    file: Express.Multer.File,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Task> {
    const existingTask = await this.taskRepository.findById(id, userId);

    if (!existingTask) {
      throw new Error('Task not found');
    }

    const filePath = `uploads/tasks/${file.filename}`;
    const updatedTask = await this.taskRepository.updateFile(
      id,
      userId,
      filePath,
      file.originalname,
      file.size,
      file.mimetype,
    );

    // Log the file upload
    await this.auditLogService.logTaskUpdate(
      userId,
      id,
      {
        filePath: existingTask.filePath,
        fileName: existingTask.fileName,
        fileSize: existingTask.fileSize,
        fileMimeType: existingTask.fileMimeType,
      },
      {
        filePath,
        fileName: file.originalname,
        fileSize: file.size,
        fileMimeType: file.mimetype,
      },
      ipAddress,
      userAgent,
    );

    return updatedTask;
  }

  async removeFile(
    id: number,
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Task> {
    const existingTask = await this.taskRepository.findById(id, userId);

    if (!existingTask) {
      throw new Error('Task not found');
    }

    const updatedTask = await this.taskRepository.removeFile(id, userId);

    // Log the file removal
    await this.auditLogService.logTaskUpdate(
      userId,
      id,
      {
        filePath: existingTask.filePath,
        fileName: existingTask.fileName,
        fileSize: existingTask.fileSize,
        fileMimeType: existingTask.fileMimeType,
      },
      {
        filePath: null,
        fileName: null,
        fileSize: null,
        fileMimeType: null,
      },
      ipAddress,
      userAgent,
    );

    return updatedTask;
  }
}
