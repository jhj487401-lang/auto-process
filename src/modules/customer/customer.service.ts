import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { BaseCrudService } from '../../common/base-crud.service.js';
import type { Customer } from '../../generated/prisma/client.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';

@Injectable()
export class CustomerService extends BaseCrudService<
  Customer,
  CreateCustomerDto,
  UpdateCustomerDto
> {
  constructor(prisma: PrismaService) {
    super(prisma.customer);
  }
}
