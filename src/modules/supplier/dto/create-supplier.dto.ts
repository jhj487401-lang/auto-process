import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  name: string;

  @IsString()
  contactEmail: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsBoolean()
  isPreferred: boolean;

}
