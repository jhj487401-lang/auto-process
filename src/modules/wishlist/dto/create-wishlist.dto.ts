import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  itemName: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsBoolean()
  isPurchased: boolean;

}
