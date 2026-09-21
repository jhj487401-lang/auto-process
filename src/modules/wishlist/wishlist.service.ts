import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { BaseCrudService } from '../../common/base-crud.service.js';
import type { Wishlist } from '../../generated/prisma/client.js';
import { CreateWishlistDto } from './dto/create-wishlist.dto.js';
import { UpdateWishlistDto } from './dto/update-wishlist.dto.js';

@Injectable()
export class WishlistService extends BaseCrudService<
  Wishlist,
  CreateWishlistDto,
  UpdateWishlistDto
> {
  constructor(prisma: PrismaService) {
    super(prisma.wishlist);
  }
}
