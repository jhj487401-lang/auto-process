import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { BaseCrudService } from '../../common/base-crud.service.js';
import type { Review } from '../../generated/prisma/client.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';

@Injectable()
export class ReviewService extends BaseCrudService<
  Review,
  CreateReviewDto,
  UpdateReviewDto
> {
  constructor(prisma: PrismaService) {
    super(prisma.review);
  }
}
