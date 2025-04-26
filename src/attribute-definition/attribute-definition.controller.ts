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
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { AttributeDefinitionService } from './attribute-definition.service';
import { _CreateAttributeDefinitionDto } from './dto/create-attribute-definition.dto';
import { _UpdateAttributeDefinitionDto } from './dto/update-attribute-definition.dto';

@ApiTags('Attribute Definition')
@Controller('attribute-definition')
export class AttributeDefinitionController {
  constructor(
    private readonly attributeDefinitionService: AttributeDefinitionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo atributo' })
  @ApiBody({
    description: 'Datos para crear un nuevo atributo',
    schema: {
      example: {
        name: 'color',
        type: 'string',
        isRequired: true,
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Atributo creado exitosamente.' })
  create(@Body() createAttributeDefinitionDto: _CreateAttributeDefinitionDto) {
    return this.attributeDefinitionService.create(createAttributeDefinitionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los atributos' })
  @ApiResponse({ status: 200, description: 'Listado de atributos.' })
  findAll() {
    return this.attributeDefinitionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un atributo por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Detalles del atributo.' })
  findOne(@Param('id') id: string) {
    return this.attributeDefinitionService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un atributo por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({
    description: 'Datos para actualizar el atributo',
    schema: {
      example: {
        name: 'tamaño',
        type: 'number',
        isRequired: false,
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Atributo actualizado.' })
  update(
    @Param('id') id: string,
    @Body() updateAttributeDefinitionDto: _UpdateAttributeDefinitionDto,
  ) {
    return this.attributeDefinitionService.update(+id, updateAttributeDefinitionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un atributo por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Atributo eliminado.' })
  remove(@Param('id') id: string) {
    return this.attributeDefinitionService.remove(+id);
  }
}