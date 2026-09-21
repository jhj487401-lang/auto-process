import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { BaseCrudService } from '../../common/base-crud.service.js';
import type { Notification } from '../../generated/prisma/client.js';
import { CreateNotificationDto } from './dto/create-notification.dto.js';
import { UpdateNotificationDto } from './dto/update-notification.dto.js';

@Injectable()
export class NotificationService extends BaseCrudService<
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto
> {
  constructor(prisma: PrismaService) {
    super(prisma.notification);
  }
}
