import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { BaseCrudService } from '../../common/base-crud.service.js';
import type { Tag } from '../../generated/prisma/client.js';
import { CreateTagDto } from './dto/create-tag.dto.js';
import { UpdateTagDto } from './dto/update-tag.dto.js';

@Injectable()
export class TagService extends BaseCrudService<
  Tag,
  CreateTagDto,
  UpdateTagDto
> {
  constructor(prisma: PrismaService) {
    super(prisma.tag);
  }
}
