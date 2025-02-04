import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateVariantAttributeDto } from './dto/create-variant-attribute.dto';
import { UpdateVariantAttributeDto } from './dto/update-variant-attribute.dto';
import { VariantAttributesService } from './variant-attributes.service';

@Controller('variant-attributes')
export class VariantAttributesController {
  constructor(
    private readonly variantAttributesService: VariantAttributesService,
  ) {}

  @Post()
  create(@Body() createVariantAttributeDto: CreateVariantAttributeDto) {
    return this.variantAttributesService.create(createVariantAttributeDto);
  }

  @Get()
  findAll() {
    return this.variantAttributesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.variantAttributesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVariantAttributeDto: UpdateVariantAttributeDto,
  ) {
    return this.variantAttributesService.update(+id, updateVariantAttributeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variantAttributesService.remove(+id);
  }
}
