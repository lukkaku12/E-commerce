import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';
import { ServicesService } from './services.service';
import { JwtPayload } from 'auth/auth.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'auth/guards/jwt/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';

@ApiTags('Services')
@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nuevo servicio',
    description: 'Crea un nuevo servicio en el sistema',
  })
  @ApiCreatedResponse({
    description: 'Servicio creado exitosamente',
    type: Service,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos o incompletos',
  })
  @ApiBody({
    type: CreateServiceDto,
    examples: {
      example1: {
        summary: 'Ejemplo creación servicio',
        value: {
          service_name: 'Mantenimiento Preventivo',
          service_description: 'Mantenimiento mensual de equipos',
          service_price: 199.99,
        },
      },
    },
  })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los servicios',
    description:
      'Devuelve una lista completa de todos los servicios registrados',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de servicios obtenida exitosamente',
    type: [Service],
  })
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener servicio por ID',
    description: 'Obtiene los detalles completos de un servicio específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del servicio',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles del servicio',
    type: Service,
  })
  @ApiNotFoundResponse({
    description: 'Servicio no encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar servicio',
    description: 'Actualiza parcialmente los datos de un servicio existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del servicio a actualizar',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Servicio actualizado exitosamente',
    type: Service,
  })
  @ApiNotFoundResponse({
    description: 'Servicio no encontrado',
  })
  @ApiBadRequestResponse({
    description: 'Datos de actualización inválidos',
  })
  @ApiBody({
    type: UpdateServiceDto,
    examples: {
      example1: {
        summary: 'Ejemplo actualización parcial',
        value: {
          service_price: 249.99,
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(+id, updateServiceDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar servicio',
    description: 'Elimina permanentemente un servicio del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del servicio a eliminar',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Servicio eliminado exitosamente',
  })
  @ApiNotFoundResponse({
    description: 'Servicio no encontrado',
  })
  @ApiBadRequestResponse({
    description: 'No tiene permisos para eliminar este servicio',
  })
  @UseGuards(new RolesGuard(['seller']))
  remove(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as JwtPayload;
    return this.servicesService.remove(+id, user.sub);
  }
}
