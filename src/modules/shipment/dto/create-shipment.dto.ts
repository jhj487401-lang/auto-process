import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateShipmentDto {
  @IsString()
  trackingNumber: string;

  @IsString()
  carrier: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsDateString()
  shippedAt?: Date;

}
