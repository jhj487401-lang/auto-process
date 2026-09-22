import { IsBoolean, IsDateString, IsString } from 'class-validator';

export class CreateReturnDto {
  @IsString()
  reason: string;

  @IsBoolean()
  isApproved: boolean;

  @IsDateString()
  requestedAt: Date;

}
