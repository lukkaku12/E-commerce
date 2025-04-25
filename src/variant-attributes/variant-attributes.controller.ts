import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { _CreateVariantAttributeDto } from './dto/create-variant-attribute.dto';
import { _UpdateVariantAttributeDto } from './dto/update-variant-attribute.dto';
import { VariantAttributesService } from './variant-attributes.service';

@Controller('variant-attributes')
export class VariantAttributesController {
  constructor(
    private readonly variantAttributesService: VariantAttributesService,
  ) {}

  @Post()
create(@Body() dto: _CreateVariantAttributeDto) {
  return this.variantAttributesService.create(dto);
}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: _UpdateVariantAttributeDto,
  ) {
    return this.variantAttributesService.update(+id, dto);
  }
  
  @Get()
  findAll() {
    return this.variantAttributesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.variantAttributesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variantAttributesService.remove(+id);
  }
}
