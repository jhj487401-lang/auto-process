import { Module } from '@nestjs/common';
import { ProductModule } from '../../modules/product/product.module.js';
import { InventorySummaryController } from './inventory-summary.controller.js';
import { InventorySummaryService } from './inventory-summary.service.js';

@Module({
  imports: [ProductModule],
  controllers: [InventorySummaryController],
  providers: [InventorySummaryService],
})
export class InventorySummaryModule {}
