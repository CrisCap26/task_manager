import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { TaskService } from '../../application/services/task.service';
import { CreateTaskDto } from '../../application/dto/create-task.dto';
import { UpdateTaskDto } from '../../application/dto/update-task.dto';
import { UserId } from 'src/common/decorators/user-id.decorator';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAll(@UserId() userId: string) {
    return this.taskService.getAll(userId);
  }

  @Get(':id')
  getById(@Param('id') id: string, @UserId() userId: string) {
    return this.taskService.getById(+id, userId);
  }

  @Post()
  create(@UserId() userId: string, @Body() dto: CreateTaskDto) {
    return this.taskService.create(userId, dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @UserId() userId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.taskService.update(+id, userId, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @UserId() userId: string) {
    return this.taskService.delete(+id, userId);
  }
}
