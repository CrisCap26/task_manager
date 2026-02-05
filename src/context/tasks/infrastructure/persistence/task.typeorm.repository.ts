import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskRepository } from '../../domain/repositories/task.repository';
import { Task } from '../../domain/entities/task.entity';
import { TaskSummary } from '../../domain/entities/task-summary';
import { TaskOrmEntity } from './task.orm-entity';
import { PaginationQueryDto } from '../../application/dto/pagination-query.dto';

export class TaskTypeOrmRepository implements TaskRepository {
  constructor(
    @InjectRepository(TaskOrmEntity)
    private readonly repository: Repository<TaskOrmEntity>,
  ) {}

  async findWithPagination(
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<{ tasks: TaskSummary[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      completed,
      dueDateFrom,
      dueDateTo,
      responsible,
      tags,
      search,
    } = paginationQuery;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository
      .createQueryBuilder('task')
      .where('task.userId = :userId', { userId });

    if (completed !== undefined) {
      queryBuilder.andWhere('task.completed = :completed', { completed });
    }

    if (dueDateFrom) {
      queryBuilder.andWhere('task.dueDate >= :dueDateFrom', { dueDateFrom });
    }

    if (dueDateTo) {
      queryBuilder.andWhere('task.dueDate <= :dueDateTo', { dueDateTo });
    }

    if (responsible) {
      queryBuilder.andWhere('task.responsible = :responsible', { responsible });
    }

    if (tags) {
      const tagList = tags.split(',').map((t) => t.trim());
      queryBuilder.andWhere('task.tags LIKE :tags', {
        tags: `%${tagList[0]}%`,
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy(`task.${sortBy}`, sortOrder).skip(skip).take(limit);

    const [tasks, total] = await queryBuilder.getManyAndCount();

    return {
      tasks: tasks.map(
        (t) => new TaskSummary(t.id, t.title, t.completed, t.dueDate),
      ),
      total,
    };
  }

  async findPublicTasks(
    paginationQuery: PaginationQueryDto,
  ): Promise<{ tasks: TaskSummary[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      completed,
      dueDateFrom,
      dueDateTo,
      responsible,
      tags,
      search,
    } = paginationQuery;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository
      .createQueryBuilder('task')
      .where('task.isPublic = :isPublic', { isPublic: true });

    if (completed !== undefined) {
      queryBuilder.andWhere('task.completed = :completed', { completed });
    }

    if (dueDateFrom) {
      queryBuilder.andWhere('task.dueDate >= :dueDateFrom', { dueDateFrom });
    }

    if (dueDateTo) {
      queryBuilder.andWhere('task.dueDate <= :dueDateTo', { dueDateTo });
    }

    if (responsible) {
      queryBuilder.andWhere('task.responsible = :responsible', { responsible });
    }

    if (tags) {
      const tagList = tags.split(',').map((t) => t.trim());
      queryBuilder.andWhere('task.tags LIKE :tags', {
        tags: `%${tagList[0]}%`,
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy(`task.${sortBy}`, sortOrder).skip(skip).take(limit);

    const [tasks, total] = await queryBuilder.getManyAndCount();

    return {
      tasks: tasks.map(
        (t) => new TaskSummary(t.id, t.title, t.completed, t.dueDate),
      ),
      total,
    };
  }

  async findById(id: number, userId: string): Promise<Task | null> {
    const task = await this.repository.findOne({
      where: { id, userId },
    });

    if (!task) return null;

    return new Task(
      task.id,
      task.userId,
      task.title,
      task.description,
      task.completed,
      task.dueDate,
      task.isPublic,
      task.comments,
      task.responsible,
      task.tags,
      task.filePath,
      task.fileName,
      task.fileSize,
      task.fileMimeType,
    );
  }

  async findByIdAccessible(id: number, userId: string): Promise<Task | null> {
    const task = await this.repository.findOne({
      where: [
        { id, userId },
        { id, isPublic: true },
      ],
    });

    if (!task) return null;

    return new Task(
      task.id,
      task.userId,
      task.title,
      task.description,
      task.completed,
      task.dueDate,
      task.isPublic,
      task.comments,
      task.responsible,
      task.tags,
      task.filePath,
      task.fileName,
      task.fileSize,
      task.fileMimeType,
    );
  }

  async create(task: Task): Promise<Task> {
    const ormTask = this.repository.create({
      userId: task.userId,
      title: task.title,
      description: task.description,
      completed: task.completed,
      dueDate: task.dueDate,
      isPublic: task.isPublic,
      comments: task.comments,
      responsible: task.responsible,
      tags: task.tags,
      filePath: task.filePath,
      fileName: task.fileName,
      fileSize: task.fileSize,
      fileMimeType: task.fileMimeType,
    });

    const saved = await this.repository.save(ormTask);

    return new Task(
      saved.id,
      saved.userId,
      saved.title,
      saved.description,
      saved.completed,
      saved.dueDate,
      saved.isPublic,
      saved.comments,
      saved.responsible,
      saved.tags,
      saved.filePath,
      saved.fileName,
      saved.fileSize,
      saved.fileMimeType,
    );
  }

  async update(task: Task): Promise<Task> {
    await this.repository.update(task.id!, {
      title: task.title,
      description: task.description,
      completed: task.completed,
      dueDate: task.dueDate,
      isPublic: task.isPublic,
      comments: task.comments,
      responsible: task.responsible,
      tags: task.tags,
      filePath: task.filePath,
      fileName: task.fileName,
      fileSize: task.fileSize,
      fileMimeType: task.fileMimeType,
    });

    return task;
  }

  async delete(id: number, userId: string): Promise<void> {
    await this.repository.delete({ id, userId });
  }

  async updateFile(
    id: number,
    userId: string,
    filePath: string,
    fileName: string,
    fileSize: number,
    fileMimeType: string,
  ): Promise<Task> {
    await this.repository.update(
      { id, userId },
      {
        filePath,
        fileName,
        fileSize,
        fileMimeType,
      },
    );

    const task = await this.repository.findOne({ where: { id, userId } });
    if (!task) {
      throw new Error('Task not found');
    }

    return new Task(
      task.id,
      task.userId,
      task.title,
      task.description,
      task.completed,
      task.dueDate,
      task.isPublic,
      task.comments,
      task.responsible,
      task.tags,
      task.filePath,
      task.fileName,
      task.fileSize,
      task.fileMimeType,
    );
  }

  async removeFile(id: number, userId: string): Promise<Task> {
    await this.repository.update(
      { id, userId },
      {
        filePath: undefined,
        fileName: undefined,
        fileSize: undefined,
        fileMimeType: undefined,
      },
    );

    const task = await this.repository.findOne({ where: { id, userId } });
    if (!task) {
      throw new Error('Task not found');
    }

    return new Task(
      task.id,
      task.userId,
      task.title,
      task.description,
      task.completed,
      task.dueDate,
      task.isPublic,
      task.comments,
      task.responsible,
      task.tags,
      undefined,
      undefined,
      undefined,
      undefined,
    );
  }
}
