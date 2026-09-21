import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { BaseCrudService } from '../../common/base-crud.service.js';
import type { Brand } from '../../generated/prisma/client.js';
import { CreateBrandDto } from './dto/create-brand.dto.js';
import { UpdateBrandDto } from './dto/update-brand.dto.js';

@Injectable()
export class BrandService extends BaseCrudService<
  Brand,
  CreateBrandDto,
  UpdateBrandDto
> {
  constructor(prisma: PrismaService) {
    super(prisma.brand);
  }
}
