import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

import { ServiceScheduleService } from './service-schedule.service';
import { ServicesService } from 'src/services/services.service';
import { ServiceSchedule } from './entities/service-schedule.entity';
import { CreateServiceScheduleDto } from './dto/create-service-schedule.dto';
import { UpdateServiceScheduleDto } from './dto/update-service-schedule.dto';

describe('ServiceScheduleService', () => {
  let serviceScheduleService: ServiceScheduleService;
  let scheduleRepository: Repository<ServiceSchedule>;
  let serviceService: ServicesService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceScheduleService,
        {
          provide: getRepositoryToken(ServiceSchedule),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            preload: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ServicesService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    serviceScheduleService = module.get<ServiceScheduleService>(ServiceScheduleService);
    scheduleRepository = module.get<Repository<ServiceSchedule>>(getRepositoryToken(ServiceSchedule));
    serviceService = module.get<ServicesService>(ServicesService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(serviceScheduleService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new schedule', async () => {
      const dto: CreateServiceScheduleDto = {
        service_id: 1,
        start_time: '10:00',
        ending_time: '12:00',
        schedule_date: new Date(),
      };

      const mockService = { id: 1 };
      const mockSchedule = { ...dto, service: mockService };

      (serviceService.findOne as jest.Mock).mockResolvedValue(mockService);
      (scheduleRepository.create as jest.Mock).mockReturnValue(mockSchedule);
      (scheduleRepository.save as jest.Mock).mockResolvedValue(mockSchedule);

      const result = await serviceScheduleService.create(dto);
      expect(result).toEqual(mockSchedule);
      expect(scheduleRepository.save).toHaveBeenCalledWith(mockSchedule);
    });

    it('should throw NotFoundException if service does not exist', async () => {
      const dto: CreateServiceScheduleDto = {
        service_id: 99,
        start_time: '10:00',
        ending_time: '12:00',
        schedule_date: new Date(),
      };

      (serviceService.findOne as jest.Mock).mockResolvedValue(null);

      await expect(serviceScheduleService.create(dto)).rejects.toThrow(
        new NotFoundException(`Service with ID ${dto.service_id} not found`),
      );
    });
  });

  describe('findAll', () => {
    it('should return cached schedules if available', async () => {
      const mockSchedules = [{ id: 1 }];
      (cacheManager.get as jest.Mock).mockResolvedValue(mockSchedules);

      const result = await serviceScheduleService.findAll();
      expect(result).toEqual(mockSchedules);
      expect(scheduleRepository.find).not.toHaveBeenCalled();
    });

    it('should return schedules from database if not cached', async () => {
      const mockSchedules = [{ id: 1 }];
      (cacheManager.get as jest.Mock).mockResolvedValue(null);
      (scheduleRepository.find as jest.Mock).mockResolvedValue(mockSchedules);

      const result = await serviceScheduleService.findAll();
      expect(result).toEqual(mockSchedules);
      expect(scheduleRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return cached schedule if available', async () => {
      const mockSchedule = { id: 1 };
      (cacheManager.get as jest.Mock).mockResolvedValue(mockSchedule);

      const result = await serviceScheduleService.findOne(1);
      expect(result).toEqual(mockSchedule);
      expect(scheduleRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return schedule from database if not cached', async () => {
      const mockSchedule = { id: 1 };
      (cacheManager.get as jest.Mock).mockResolvedValue(null);
      (scheduleRepository.findOne as jest.Mock).mockResolvedValue(mockSchedule);

      const result = await serviceScheduleService.findOne(1);
      expect(result).toEqual(mockSchedule);
      expect(scheduleRepository.findOne).toHaveBeenCalledWith({
        where: { schedule_id: 1 },
      });
    });

    it('should throw NotFoundException if schedule not found', async () => {
      (cacheManager.get as jest.Mock).mockResolvedValue(null);
      (scheduleRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(serviceScheduleService.findOne(99)).rejects.toThrow(
        new NotFoundException('Service schedule with ID 99 not found'),
      );
    });
  });

  describe('update', () => {
    it('should update a schedule', async () => {
      const dto: UpdateServiceScheduleDto = { start_time: '11:00' };
      const mockSchedule = { id: 1, start_time: '10:00', ending_time: '12:00' };

      (scheduleRepository.preload as jest.Mock).mockResolvedValue(mockSchedule);
      (scheduleRepository.save as jest.Mock).mockResolvedValue(mockSchedule);

      const result = await serviceScheduleService.update(1, dto);
      expect(result).toEqual(mockSchedule);
      expect(scheduleRepository.save).toHaveBeenCalledWith(mockSchedule);
    });

    it('should throw NotFoundException if schedule not found', async () => {
      (scheduleRepository.preload as jest.Mock).mockResolvedValue(null);

      await expect(serviceScheduleService.update(99, {})).rejects.toThrow(
        new NotFoundException('Service schedule with ID 99 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should delete a schedule', async () => {
      (scheduleRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      await expect(serviceScheduleService.remove(1)).resolves.not.toThrow();
      expect(scheduleRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if schedule not found', async () => {
      (scheduleRepository.delete as jest.Mock).mockResolvedValue({ affected: 0 });

      await expect(serviceScheduleService.remove(99)).rejects.toThrow(
        new NotFoundException('Service schedule with ID 99 not found'),
      );
    });
  });
});