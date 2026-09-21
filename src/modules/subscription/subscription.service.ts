import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { BaseCrudService } from '../../common/base-crud.service.js';
import type { Subscription } from '../../generated/prisma/client.js';
import { CreateSubscriptionDto } from './dto/create-subscription.dto.js';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto.js';

@Injectable()
export class SubscriptionService extends BaseCrudService<
  Subscription,
  CreateSubscriptionDto,
  UpdateSubscriptionDto
> {
  constructor(prisma: PrismaService) {
    super(prisma.subscription);
  }
}
