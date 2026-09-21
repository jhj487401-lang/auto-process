import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { BaseCrudService } from '../../common/base-crud.service.js';
import type { Shipment } from '../../generated/prisma/client.js';
import { CreateShipmentDto } from './dto/create-shipment.dto.js';
import { UpdateShipmentDto } from './dto/update-shipment.dto.js';

@Injectable()
export class ShipmentService extends BaseCrudService<
  Shipment,
  CreateShipmentDto,
  UpdateShipmentDto
> {
  constructor(prisma: PrismaService) {
    super(prisma.shipment);
  }
}
