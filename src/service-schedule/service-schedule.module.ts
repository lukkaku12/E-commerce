import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/services/entities/service.entity';

import { ServiceSchedule } from './entities/service-schedule.entity';
import { ServiceScheduleController } from './service-schedule.controller';
import { ServiceScheduleService } from './service-schedule.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceSchedule, Service])],
  controllers: [ServiceScheduleController],
  providers: [ServiceScheduleService],
})
export class ServiceScheduleModule {}
