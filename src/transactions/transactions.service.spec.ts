import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { ServiceScheduleService } from 'src/service-schedule/service-schedule.service';
import { NotFoundException } from '@nestjs/common';

jest.mock('mercadopago', () => ({
  MercadoPagoConfig: jest.fn().mockImplementation(() => ({})),
  Preference: jest.fn().mockImplementation(() => ({
    create: jest.fn().mockResolvedValue({
      id: '12345',
      init_point: 'https://payment-url.test',
    }),
  })),
}));

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionRepository: Repository<Transaction>;
  let userRepository: Repository<User>;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('test-app-url') },
        },
        {
          provide: ServiceScheduleService,
          useValue: { findOne: jest.fn(), save: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionRepository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPayment', () => {
    it('should create a payment and return init_point', async () => {
        const mockUser = { user_id: 1 } as User;
        const metadata = { scheduleId: 123 }; // Agregamos un objeto metadata con scheduleId
      
        jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
        jest.spyOn(transactionRepository, 'create').mockReturnValue({} as Transaction);
        jest.spyOn(transactionRepository, 'save').mockResolvedValue({} as Transaction);
      
        const result = await service.createPayment(100, 'Test Payment', 1, metadata); // Pasamos metadata
      
        expect(result).toBe('https://payment-url.test');
        expect(transactionRepository.create).toHaveBeenCalled();
        expect(transactionRepository.save).toHaveBeenCalled();
      });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      await expect(service.createPayment(100, 'Test Payment', 1)).rejects.toThrow(NotFoundException);
    });
  });
});
