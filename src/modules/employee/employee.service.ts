import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { BaseCrudService } from '../../common/base-crud.service.js';
import type { Employee } from '../../generated/prisma/client.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';

@Injectable()
export class EmployeeService extends BaseCrudService<
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto
> {
  constructor(prisma: PrismaService) {
    super(prisma.employee);
  }
}
