import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReturnService } from './return.service.js';
import { CreateReturnDto } from './dto/create-return.dto.js';
import { UpdateReturnDto } from './dto/update-return.dto.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';

@ApiTags('returns')
@Controller('returns')
export class ReturnController {
  constructor(private readonly service: ReturnService) {}

  @Post()
  create(@Body() dto: CreateReturnDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReturnDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
