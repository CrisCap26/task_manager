import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UploadFileDto {
  @IsBoolean()
  @IsOptional()
  replaceExisting?: boolean = false;
}

export class FileResponseDto {
  fileName: string;
  filePath: string;
  fileSize: number;
  fileMimeType: string;
  taskId: number;
  uploadedAt: Date;
}
