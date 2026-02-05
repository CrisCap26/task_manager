import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  completed: boolean;

  @IsDateString()
  dueDate: string;

  @IsBoolean()
  isPublic: boolean;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsString()
  responsible?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
