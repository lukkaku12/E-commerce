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
import { JwtPayload } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Request } from 'express';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';
import { ServicesService } from './services.service';

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

  @Get('by-seller')
  @UseGuards(new RolesGuard(['seller']))
  @ApiOperation({
    summary: 'Obtener servicios por vendedor',
    description: 'Devuelve todos los servicios creados por el vendedor autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Servicios del vendedor obtenidos correctamente',
    type: [Service],
  })
  @ApiNotFoundResponse({
    description: 'No se encontraron servicios para este vendedor',
  })
  findBySeller(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.servicesService.findBySellerId(user.sub);
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
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    const user = req.user as JwtPayload;
    return this.servicesService.update(+id, updateServiceDto, user.sub);
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
