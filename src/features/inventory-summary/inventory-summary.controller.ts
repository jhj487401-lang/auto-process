import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InventorySummaryService } from './inventory-summary.service.js';

@ApiTags('inventory-summary')
@Controller('inventory-summary')
export class InventorySummaryController {
  constructor(private readonly inventorySummaryService: InventorySummaryService) {}

  @Get()
  getSummary() {
    return this.inventorySummaryService.getSummary();
  }
}
