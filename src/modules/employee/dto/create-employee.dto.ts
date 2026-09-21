import { IsBoolean, IsDateString, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsString()
  role: string;

  @IsDateString()
  hireDate: Date;

  @IsBoolean()
  isActive: boolean;

}
