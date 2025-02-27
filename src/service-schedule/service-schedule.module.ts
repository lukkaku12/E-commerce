import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/services/entities/service.entity';
import { ServicesService } from 'src/services/services.service';

import { ServiceSchedule } from './entities/service-schedule.entity';
import { ServiceScheduleController } from './service-schedule.controller';
import { ServiceScheduleService } from './service-schedule.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceSchedule, Service]), // Agregado Service para las relaciones
    CacheModule.register(), // Importado CacheModule para la caché
  ],
  controllers: [ServiceScheduleController],
  providers: [ServiceScheduleService, ServicesService], // Agregado ServicesService
  exports: [ServiceScheduleService], // Exportado para que otros módulos puedan usarlo si es necesario
})
export class ServiceScheduleModule {}
