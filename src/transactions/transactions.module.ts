import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceSchedule } from 'src/service-schedule/entities/service-schedule.entity';
import { ServiceScheduleService } from 'src/service-schedule/service-schedule.service';
import { Service } from 'src/services/entities/service.entity';
import { ServicesService } from 'src/services/services.service';
import { User } from 'src/users/entities/user.entity';

import { Transaction } from './entities/transaction.entity';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User, ServiceSchedule, Service]), // Repositorios de TypeORM
    ConfigModule,
    // Para acceder a las variables de entorno
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, ServiceScheduleService, ServicesService],
})
export class TransactionsModule {}
