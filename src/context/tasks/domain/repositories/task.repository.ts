import { Task } from '../entities/task.entity';
import { TaskSummary } from '../entities/task-summary';
import { PaginationQueryDto } from '../../application/dto/pagination-query.dto';

export interface TaskRepository {
  findWithPagination(
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<{ tasks: TaskSummary[]; total: number }>;
  findPublicTasks(
    paginationQuery: PaginationQueryDto,
  ): Promise<{ tasks: TaskSummary[]; total: number }>;
  findById(id: number, userId: string): Promise<Task | null>;
  findByIdAccessible(id: number, userId: string): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: number, userId: string): Promise<void>;
  updateFile(
    id: number,
    userId: string,
    filePath: string,
    fileName: string,
    fileSize: number,
    fileMimeType: string,
  ): Promise<Task>;
  removeFile(id: number, userId: string): Promise<Task>;
}
