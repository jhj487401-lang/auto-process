import { IsBoolean, IsDateString, IsInt, IsString } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  code: string;

  @IsInt()
  discountPercent: number;

  @IsDateString()
  expiresAt: Date;

  @IsBoolean()
  isActive: boolean;

}
