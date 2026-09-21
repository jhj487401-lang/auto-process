import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { BaseCrudService } from '../../common/base-crud.service.js';
import type { Category } from '../../generated/prisma/client.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoryService extends BaseCrudService<
  Category,
  CreateCategoryDto,
  UpdateCategoryDto
> {
  constructor(prisma: PrismaService) {
    super(prisma.category);
  }
}
