import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsBoolean()
  isDone: boolean;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

}
