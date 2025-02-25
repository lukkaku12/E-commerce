import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { ServiceScheduleService } from 'src/service-schedule/service-schedule.service';
import { ServiceSchedule } from 'src/service-schedule/entities/service-schedule.entity';
import { ServicesService } from 'src/services/services.service';
import { Service } from 'src/services/entities/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User, ServiceSchedule, Service]), // Repositorios de TypeORM
    ConfigModule
     // Para acceder a las variables de entorno
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, ServiceScheduleService, ServicesService],
})
export class TransactionsModule {}