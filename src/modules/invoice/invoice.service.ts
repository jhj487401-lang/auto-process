import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { BaseCrudService } from '../../common/base-crud.service.js';
import type { Invoice } from '../../generated/prisma/client.js';
import { CreateInvoiceDto } from './dto/create-invoice.dto.js';
import { UpdateInvoiceDto } from './dto/update-invoice.dto.js';

@Injectable()
export class InvoiceService extends BaseCrudService<
  Invoice,
  CreateInvoiceDto,
  UpdateInvoiceDto
> {
  constructor(prisma: PrismaService) {
    super(prisma.invoice);
  }
}
