import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceSchedule } from 'src/service-schedule/entities/service-schedule.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(ServiceSchedule)
    private readonly serviceScheduleRepository: Repository<ServiceSchedule>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly transactionsService: TransactionsService, // Inyectar TransactionsService
  ) {}

  async bookService(userId: number, scheduleId: number) {
    // 1. Verificar disponibilidad del horario
    const schedule = await this.serviceScheduleRepository.findOne({
      where: { schedule_id: scheduleId, isAvailable: true },
      relations: ['service'],
    });

    if (!schedule) {
      throw new NotFoundException('El horario seleccionado no está disponible.');
    }

    // 2. Obtener el usuario
    const user = await this.userRepository.findOne({ 
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    // 3. Crear transacción PENDIENTE con Mercado Pago
    const paymentLink = await this.transactionsService.createPayment(
      schedule.service.service_price,
      `Reserva de ${schedule.service.service_name}`,
      userId,
      { scheduleId },
    );

    // 4. Marcar horario como reservado (pero no disponible hasta confirmación)
    schedule.isAvailable = false;
    await this.serviceScheduleRepository.save(schedule);

    // 5. Retornar enlace de pago (no marcar como exitoso aún)
    return {
      message: 'Por favor completa el pago para confirmar tu reserva',
      paymentLink,
      scheduleDetails: {
        serviceName: schedule.service.service_name,
        startTime: schedule.start_time,
        endTime: schedule.ending_time,
        date: schedule.schedule_date,
      }
    };
    // tras bambalinas mercado pago hará la actualizacion del pago
  }
}