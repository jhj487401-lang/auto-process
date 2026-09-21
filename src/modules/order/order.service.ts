import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { BaseCrudService } from '../../common/base-crud.service.js';
import type { Order } from '../../generated/prisma/client.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';

@Injectable()
export class OrderService extends BaseCrudService<
  Order,
  CreateOrderDto,
  UpdateOrderDto
> {
  constructor(prisma: PrismaService) {
    super(prisma.order);
  }
}
