import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServiceSchedule } from 'src/service-schedule/entities/service-schedule.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';

import { BookingController } from './booking-service.controller';
import { BookingService } from './booking-service.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { ServiceScheduleModule } from 'src/service-schedule/service-schedule.module';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceSchedule, Transaction, User]), ServiceScheduleModule],
  providers: [BookingService, TransactionsService], // Agregado TransactionsService
  controllers: [BookingController],
  exports: [BookingService], // Exportado para que otros módulos lo usen si es necesario
})
export class BookingModule {}