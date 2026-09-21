import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  reviewerName: string;

  @IsInt()
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

}
