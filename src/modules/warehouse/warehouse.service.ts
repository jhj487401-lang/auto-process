import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { BaseCrudService } from '../../common/base-crud.service.js';
import type { Warehouse } from '../../generated/prisma/client.js';
import { CreateWarehouseDto } from './dto/create-warehouse.dto.js';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto.js';

@Injectable()
export class WarehouseService extends BaseCrudService<
  Warehouse,
  CreateWarehouseDto,
  UpdateWarehouseDto
> {
  constructor(prisma: PrismaService) {
    super(prisma.warehouse);
  }
}
