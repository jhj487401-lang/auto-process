import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { BaseCrudService } from '../../common/base-crud.service.js';
import type { Supplier } from '../../generated/prisma/client.js';
import { CreateSupplierDto } from './dto/create-supplier.dto.js';
import { UpdateSupplierDto } from './dto/update-supplier.dto.js';

@Injectable()
export class SupplierService extends BaseCrudService<
  Supplier,
  CreateSupplierDto,
  UpdateSupplierDto
> {
  constructor(prisma: PrismaService) {
    super(prisma.supplier);
  }
}
