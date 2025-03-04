import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { BookingService } from './booking-service.service';
import { ServiceSchedule } from '../service-schedule/entities/service-schedule.entity';
import { User } from 'src/users/entities/user.entity';
import { TransactionsService } from 'src/transactions/transactions.service';

// Mocks
const mockScheduleRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
};

const mockUserRepository = {
  findOne: jest.fn(),
};

const mockTransactionsService = {
  createPayment: jest.fn(),
  refundPayment: jest.fn(),
};

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        { provide: getRepositoryToken(ServiceSchedule), useValue: mockScheduleRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: TransactionsService, useValue: mockTransactionsService },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debería lanzar un error si el horario no está disponible', async () => {
    mockScheduleRepository.findOne.mockResolvedValue(null);

    await expect(service.bookService(1, 1)).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar un error si el usuario no existe', async () => {
    mockScheduleRepository.findOne.mockResolvedValue({ isAvailable: true, service: { service_price: 100, service_name: 'Servicio A' } });
    mockUserRepository.findOne.mockResolvedValue(null);

    await expect(service.bookService(1, 1)).rejects.toThrow(NotFoundException);
  });

  it('debería crear un pago y marcar el horario como reservado', async () => {
    const scheduleMock = {
      isAvailable: true,
      service: { service_price: 100, service_name: 'Servicio A' },
      start_time: '10:00',
      ending_time: '11:00',
      schedule_date: '2025-01-01',
    };

    mockScheduleRepository.findOne.mockResolvedValue(scheduleMock);
    mockUserRepository.findOne.mockResolvedValue({ user_id: 1 });
    mockTransactionsService.createPayment.mockResolvedValue('https://mercadopago.com/pago');

    const result = await service.bookService(1, 1);

    expect(result.paymentLink).toBe('https://mercadopago.com/pago');
    expect(mockScheduleRepository.save).toHaveBeenCalledWith(expect.objectContaining({ isAvailable: false }));
  });

  it('debería llamar a refundPayment en TransactionsService', async () => {
    await service.refundBooking(123);
    expect(mockTransactionsService.refundPayment).toHaveBeenCalledWith(123);
  });

  it('deberia hacer devolucion del booking y hacer log de que se logró la operacion', async () => {
    mockTransactionsService.refundPayment.mockResolvedValue({ message:'✅ Reembolso registrado en la base de datos.'})

    await expect(service.refundBooking(2)).resolves.toMatchObject({ message: expect.any(String)})
  })
});