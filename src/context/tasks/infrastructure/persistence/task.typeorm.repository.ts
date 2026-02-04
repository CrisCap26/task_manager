import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskRepository } from '../../domain/repositories/task.repository';
import { Task } from '../../domain/entities/task.entity';
import { TaskSummary } from '../../domain/entities/task-summary';
import { TaskOrmEntity } from './task.orm-entity';

export class TaskTypeOrmRepository implements TaskRepository {
  constructor(
    @InjectRepository(TaskOrmEntity)
    private readonly repository: Repository<TaskOrmEntity>,
  ) {}

  async findSummariesByUser(userId: string): Promise<TaskSummary[]> {
    const tasks = await this.repository.find({
      where: { userId },
      select: ['id', 'title', 'completed', 'dueDate'],
      order: { dueDate: 'ASC' },
    });

    return tasks.map(
      (t) => new TaskSummary(t.id, t.title, t.completed, t.dueDate),
    );
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
      task.comments,
      task.responsible,
      task.tags,
    );
  }

  async create(task: Task): Promise<Task> {
    const ormTask = this.repository.create({
      userId: task.userId,
      title: task.title,
      description: task.description,
      completed: task.completed,
      dueDate: task.dueDate,
      comments: task.comments,
      responsible: task.responsible,
      tags: task.tags,
    });

    const saved = await this.repository.save(ormTask);

    return new Task(
      saved.id,
      saved.userId,
      saved.title,
      saved.description,
      saved.completed,
      saved.dueDate,
      saved.comments,
      saved.responsible,
      saved.tags,
    );
  }

  async update(task: Task): Promise<Task> {
    await this.repository.update(task.id!, {
      title: task.title,
      description: task.description,
      completed: task.completed,
      dueDate: task.dueDate,
      comments: task.comments,
      responsible: task.responsible,
      tags: task.tags,
    });

    return task;
  }

  async delete(id: number, userId: string): Promise<void> {
    await this.repository.delete({ id, userId });
  }
}
