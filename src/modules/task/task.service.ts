import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { BaseCrudService } from '../../common/base-crud.service.js';
import type { Task } from '../../generated/prisma/client.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TaskService extends BaseCrudService<
  Task,
  CreateTaskDto,
  UpdateTaskDto
> {
  constructor(prisma: PrismaService) {
    super(prisma.task);
  }
}
