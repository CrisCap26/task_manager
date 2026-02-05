import { Inject, Injectable } from '@nestjs/common';
import type { TaskRepository } from '../../domain/repositories/task.repository';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Task } from '../../domain/entities/task.entity';
import { TaskSummary } from '../../domain/entities/task-summary';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TaskRepository')
    private readonly taskRepository: TaskRepository,
  ) {}

  async create(userId: string, dto: CreateTaskDto): Promise<Task> {
    const task = Task.create({
      userId,
      title: dto.title,
      description: dto.description,
      completed: dto.completed,
      dueDate: new Date(dto.dueDate),
      comments: dto.comments,
      responsible: dto.responsible,
      tags: dto.tags,
    });

    return this.taskRepository.create(task);
  }

  async getAll(userId: string): Promise<TaskSummary[]> {
    return this.taskRepository.findSummariesByUser(userId);
  }

  async getById(id: number, userId: string): Promise<Task | null> {
    return this.taskRepository.findById(id, userId);
  }

  async update(id: number, userId: string, dto: UpdateTaskDto): Promise<Task> {
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
      dto.comments ?? existingTask.comments,
      dto.responsible ?? existingTask.responsible,
      dto.tags ?? existingTask.tags,
    );

    return this.taskRepository.update(updatedTask);
  }

  async delete(id: number, userId: string): Promise<void> {
    return this.taskRepository.delete(id, userId);
  }
}
