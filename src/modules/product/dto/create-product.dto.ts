import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsInt()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  inStock: boolean;

}
