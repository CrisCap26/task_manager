import { Task } from '../entities/task.entity';
import { TaskSummary } from '../entities/task-summary';

export interface TaskRepository {
  findSummariesByUser(userId: string): Promise<TaskSummary[]>;
  findById(id: number, userId: string): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: number, userId: string): Promise<void>;
}
