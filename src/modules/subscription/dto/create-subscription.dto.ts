import { IsBoolean, IsDateString, IsInt, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  planName: string;

  @IsInt()
  price: number;

  @IsBoolean()
  isActive: boolean;

  @IsDateString()
  startedAt: Date;

}
