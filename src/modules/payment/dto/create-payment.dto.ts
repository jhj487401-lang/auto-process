import { IsBoolean, IsDateString, IsInt, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  method: string;

  @IsInt()
  amount: number;

  @IsBoolean()
  isSuccessful: boolean;

  @IsDateString()
  paidAt: Date;

}
