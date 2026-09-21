import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { BaseCrudService } from '../../common/base-crud.service.js';
import type { Coupon } from '../../generated/prisma/client.js';
import { CreateCouponDto } from './dto/create-coupon.dto.js';
import { UpdateCouponDto } from './dto/update-coupon.dto.js';

@Injectable()
export class CouponService extends BaseCrudService<
  Coupon,
  CreateCouponDto,
  UpdateCouponDto
> {
  constructor(prisma: PrismaService) {
    super(prisma.coupon);
  }
}
