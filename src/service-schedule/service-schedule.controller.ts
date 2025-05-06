import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import { CreateServiceScheduleDto } from './dto/create-service-schedule.dto';
import { UpdateServiceScheduleDto } from './dto/update-service-schedule.dto';
import { ServiceScheduleService } from './service-schedule.service';

@ApiTags('service-schedule') // Agrupa los endpoints en Swagger UI
@ApiBearerAuth() // Indica que la autenticación es requerida
@Controller('service-schedule')
@UseGuards(JwtAuthGuard)
export class ServiceScheduleController {
  constructor(
    private readonly serviceScheduleService: ServiceScheduleService,
  ) {}

  @Post()
  @UseGuards(new RolesGuard(['seller']))
  @ApiOperation({ summary: 'Crear un nuevo horario de servicio' })
  @ApiResponse({ status: 201, description: 'Horario creado exitosamente.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @ApiBody({ type: CreateServiceScheduleDto })
  create(@Body() createServiceScheduleDto: CreateServiceScheduleDto) {
    return this.serviceScheduleService.create(createServiceScheduleDto);
  }

  @Get()
  @UseGuards(new RolesGuard(['buyer', 'seller']))
  @ApiOperation({ summary: 'Obtener todos los horarios de servicio' })
  @ApiResponse({
    status: 200,
    description: 'Lista de horarios obtenida exitosamente.',
  })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  findAll() {
    return this.serviceScheduleService.findAll();
  }

  @Get(':id')
  @UseGuards(new RolesGuard(['buyer', 'seller']))
  @ApiOperation({ summary: 'Obtener un horario de servicio por ID' })
  @ApiResponse({ status: 200, description: 'Horario encontrado.' })
  @ApiResponse({ status: 404, description: 'Horario no encontrado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del horario' })
  findOne(@Param('id') id: string) {
    return this.serviceScheduleService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(new RolesGuard(['seller']))
  @ApiOperation({ summary: 'Actualizar un horario de servicio' })
  @ApiResponse({
    status: 200,
    description: 'Horario actualizado exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del horario' })
  @ApiBody({ type: UpdateServiceScheduleDto })
  update(
    @Param('id') id: string,
    @Body() updateServiceScheduleDto: UpdateServiceScheduleDto,
  ) {
    return this.serviceScheduleService.update(+id, updateServiceScheduleDto);
  }

  @Delete(':id')
  @UseGuards(new RolesGuard(['seller']))
  @ApiOperation({ summary: 'Eliminar un horario de servicio' })
  @ApiResponse({ status: 200, description: 'Horario eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Horario no encontrado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del horario' })
  remove(@Param('id') id: string) {
    return this.serviceScheduleService.remove(+id);
  }
}
