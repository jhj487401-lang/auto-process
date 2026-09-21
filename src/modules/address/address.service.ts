import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { BaseCrudService } from '../../common/base-crud.service.js';
import type { Address } from '../../generated/prisma/client.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';

@Injectable()
export class AddressService extends BaseCrudService<
  Address,
  CreateAddressDto,
  UpdateAddressDto
> {
  constructor(prisma: PrismaService) {
    super(prisma.address);
  }
}
