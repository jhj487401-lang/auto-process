import { Module } from '@nestjs/common';
import { ReturnController } from './return.controller.js';
import { ReturnService } from './return.service.js';

@Module({
  controllers: [ReturnController],
  providers: [ReturnService],
  exports: [ReturnService],
})
export class ReturnModule {}
