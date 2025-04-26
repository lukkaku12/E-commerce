import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

import { _CreateVariantAttributeDto } from './dto/create-variant-attribute.dto';
import { _UpdateVariantAttributeDto } from './dto/update-variant-attribute.dto';
import { VariantAttributesService } from './variant-attributes.service';

@ApiTags('VariantAttributes')
@Controller('variant-attributes')
export class VariantAttributesController {
  constructor(
    private readonly variantAttributesService: VariantAttributesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo atributo de variante' })
  @ApiResponse({ status: 201, description: 'Atributo de variante creado' })
  @ApiBody({
    type: _CreateVariantAttributeDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de creación',
        value: {
          productVariantId: 1,
          attributeDefinitionId: 2,
          value: 'Rojo',
        },
      },
    },
  })
  create(@Body() dto: _CreateVariantAttributeDto) {
    return this.variantAttributesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un atributo de variante' })
  @ApiResponse({ status: 200, description: 'Atributo actualizado' })
  @ApiBody({
    type: _UpdateVariantAttributeDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de actualización',
        value: {
          value: 'Azul',
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() dto: _UpdateVariantAttributeDto) {
    return this.variantAttributesService.update(+id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los atributos de variantes' })
  findAll() {
    return this.variantAttributesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un atributo de variante por ID' })
  findOne(@Param('id') id: string) {
    return this.variantAttributesService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un atributo de variante por ID' })
  remove(@Param('id') id: string) {
    return this.variantAttributesService.remove(+id);
  }
}