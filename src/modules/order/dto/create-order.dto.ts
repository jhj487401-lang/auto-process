import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  orderNumber: string;

  @IsInt()
  totalAmount: number;

  @IsBoolean()
  isPaid: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

}
