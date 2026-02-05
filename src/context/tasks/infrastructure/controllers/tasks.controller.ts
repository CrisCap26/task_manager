import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';

import { TaskService } from '../../application/services/task.service';
import { CreateTaskDto } from '../../application/dto/create-task.dto';
import { UpdateTaskDto } from '../../application/dto/update-task.dto';
import { PaginationQueryDto } from '../../application/dto/pagination-query.dto';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { FileValidatorPipe } from 'src/common/pipes/file-validator.pipe';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAll(
    @UserId() userId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.taskService.getAll(userId, paginationQuery);
  }

  @Get('public')
  getPublicTasks(@Query() paginationQuery: PaginationQueryDto) {
    return this.taskService.getPublicTasks(paginationQuery);
  }

  @Get(':id')
  getById(
    @Param('id') id: string,
    @UserId() userId: string,
    @Req() req: Request,
  ) {
    return this.taskService.getById(
      +id,
      userId,
      req.socket.remoteAddress,
      req.headers['user-agent'],
    );
  }

  @Post()
  create(
    @UserId() userId: string,
    @Body() dto: CreateTaskDto,
    @Req() req: Request,
  ) {
    return this.taskService.create(
      userId,
      dto,
      req.socket.remoteAddress,
      req.headers['user-agent'],
    );
  }

  @Post(':id/file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/tasks',
        filename: (req, file, callback) => {
          const uniqueSuffix = randomUUID();
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadFile(
    @Param('id') id: string,
    @UserId() userId: string,
    @UploadedFile(new FileValidatorPipe()) file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.taskService.uploadFile(
      +id,
      userId,
      file,
      req.socket.remoteAddress,
      req.headers['user-agent'],
    );
  }

  @Get(':id/download')
  downloadFile(
    @Param('id') id: string,
    @UserId() userId: string,
    @Res() res: Response,
  ) {
    // This would need to be implemented with the actual file path
    // For now, redirect to a placeholder
    return res.send({
      message: 'File download endpoint - implement with actual file serving',
    });
  }

  @Delete(':id/file')
  removeFile(
    @Param('id') id: string,
    @UserId() userId: string,
    @Req() req: Request,
  ) {
    return this.taskService.removeFile(
      +id,
      userId,
      req.socket.remoteAddress,
      req.headers['user-agent'],
    );
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @UserId() userId: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: Request,
  ) {
    return this.taskService.update(
      +id,
      userId,
      dto,
      req.socket.remoteAddress,
      req.headers['user-agent'],
    );
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @UserId() userId: string,
    @Req() req: Request,
  ) {
    return this.taskService.delete(
      +id,
      userId,
      req.socket.remoteAddress,
      req.headers['user-agent'],
    );
  }
}
