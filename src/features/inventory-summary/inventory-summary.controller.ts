import { Controller, Get } from '@nestjs/common';
import { InventorySummaryService } from './inventory-summary.service.js';

@Controller('inventory-summary')
export class InventorySummaryController {
  constructor(private readonly inventorySummaryService: InventorySummaryService) {}

  @Get()
  getSummary() {
    return this.inventorySummaryService.getSummary();
  }
}
