import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttributeDefinitionService } from './attribute-definition.service';
import { CreateAttributeDefinitionDto } from './dto/create-attribute-definition.dto';
import { UpdateAttributeDefinitionDto } from './dto/update-attribute-definition.dto';

@Controller('attribute-definition')
export class AttributeDefinitionController {
  constructor(private readonly attributeDefinitionService: AttributeDefinitionService) {}

  @Post()
  create(@Body() createAttributeDefinitionDto: CreateAttributeDefinitionDto) {
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
  update(@Param('id') id: string, @Body() updateAttributeDefinitionDto: UpdateAttributeDefinitionDto) {
    return this.attributeDefinitionService.update(+id, updateAttributeDefinitionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributeDefinitionService.remove(+id);
  }
}
