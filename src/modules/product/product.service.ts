import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { BaseCrudService } from '../../common/base-crud.service.js';
import type { Product } from '../../generated/prisma/client.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductService extends BaseCrudService<
  Product,
  CreateProductDto,
  UpdateProductDto
> {
  constructor(prisma: PrismaService) {
    super(prisma.product);
  }
}
