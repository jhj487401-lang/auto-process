import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { BaseCrudService } from '../../common/base-crud.service.js';
import type { Return } from '../../generated/prisma/client.js';
import { CreateReturnDto } from './dto/create-return.dto.js';
import { UpdateReturnDto } from './dto/update-return.dto.js';

@Injectable()
export class ReturnService extends BaseCrudService<
  Return,
  CreateReturnDto,
  UpdateReturnDto
> {
  constructor(prisma: PrismaService) {
    super(prisma.return);
  }
}
