import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { AttributeDefinitionService } from './attribute-definition.service';
import { _CreateAttributeDefinitionDto } from './dto/create-attribute-definition.dto';
import { _UpdateAttributeDefinitionDto } from './dto/update-attribute-definition.dto';

@Controller('attribute-definition')
export class AttributeDefinitionController {
  constructor(
    private readonly attributeDefinitionService: AttributeDefinitionService,
  ) {}

  @Post()
  create(@Body() createAttributeDefinitionDto: _CreateAttributeDefinitionDto) {
    return this.attributeDefinitionService.create(createAttributeDefinitionDto);
  }

  @Get()
  findAll() {
    return this.attributeDefinitionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributeDefinitionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttributeDefinitionDto: _UpdateAttributeDefinitionDto,
  ) {
    return this.attributeDefinitionService.update(+id, _CreateAttributeDefinitionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributeDefinitionService.remove(+id);
  }
}
