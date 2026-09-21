import { IsBoolean, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsBoolean()
  isFeatured: boolean;

}
