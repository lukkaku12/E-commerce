import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateServiceScheduleDto } from './dto/create-service-schedule.dto';
import { UpdateServiceScheduleDto } from './dto/update-service-schedule.dto';
import { ServiceScheduleService } from './service-schedule.service';

@Controller('service-schedule')
export class ServiceScheduleController {
  constructor(
    private readonly serviceScheduleService: ServiceScheduleService,
  ) {}

  @Post()
  create(@Body() createServiceScheduleDto: CreateServiceScheduleDto) {
    return this.serviceScheduleService.create(createServiceScheduleDto);
  }

  @Get()
  findAll() {
    return this.serviceScheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceScheduleService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceScheduleDto: UpdateServiceScheduleDto,
  ) {
    return this.serviceScheduleService.update(+id, updateServiceScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceScheduleService.remove(+id);
  }
}
