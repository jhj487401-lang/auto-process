import { IsBoolean, IsInt, IsString } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsInt()
  capacity: number;

  @IsBoolean()
  isActive: boolean;

}
