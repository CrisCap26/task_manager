import { TaskRepository } from '../../domain/repositories/task.repository';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Task } from '../../domain/entities/task.entity';

export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  // GET /tasks
  getAll(userId: string) {
    return this.repository.findSummariesByUser(userId);
  }

  // GET /tasks/:id
  async getById(id: number, userId: string) {
    const task = await this.repository.findById(id, userId);
    if (!task) throw new Error('Task not found');
    return task;
  }

  // POST /tasks
  create(userId: string, dto: CreateTaskDto) {
    const task = new Task(
      null,
      userId,
      dto.title,
      dto.description,
      dto.completed,
      new Date(dto.dueDate),
      dto.comments,
      dto.responsible,
      dto.tags,
    );

    return this.repository.create(task);
  }

  // PUT /tasks/:id
  async update(id: number, userId: string, dto: UpdateTaskDto) {
    const task = await this.repository.findById(id, userId);
    if (!task) throw new Error('Task not found');

    Object.assign(task, dto);
    return this.repository.update(task);
  }

  // DELETE /tasks/:id
  async delete(id: number, userId: string) {
    await this.repository.delete(id, userId);
  }
}
