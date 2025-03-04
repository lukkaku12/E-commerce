import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

describe('ServicesService', () => {
  let servicesService: ServicesService;
  let serviceRepository: Repository<Service>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: getRepositoryToken(Service),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            preload: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    servicesService = module.get<ServicesService>(ServicesService);
    serviceRepository = module.get<Repository<Service>>(getRepositoryToken(Service));
  });

  it('should be defined', () => {
    expect(servicesService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new service', async () => {
        const dto: CreateServiceDto = { 
            service_name: 'Test Service',
            service_description: 'Test Description',
            service_price: 100,
          };
      const mockService = { service_id: 1, ...dto, created_at: new Date(), updated_at: new Date() };

      (serviceRepository.create as jest.Mock).mockReturnValue(mockService);
      (serviceRepository.save as jest.Mock).mockResolvedValue(mockService);

      const result = await servicesService.create(dto);
      expect(result).toEqual(mockService);
      expect(serviceRepository.create).toHaveBeenCalledWith(expect.objectContaining(dto));
      expect(serviceRepository.save).toHaveBeenCalledWith(mockService);
    });
  });

  describe('findAll', () => {
    it('should return all services', async () => {
      const mockServices = [{ service_id: 1 }, { service_id: 2 }];
      (serviceRepository.find as jest.Mock).mockResolvedValue(mockServices);

      const result = await servicesService.findAll();
      expect(result).toEqual(mockServices);
      expect(serviceRepository.find).toHaveBeenCalledWith({
        relations: ['serviceSchedule'],
        order: { service_name: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a service if found', async () => {
      const mockService = { service_id: 1, service_name: 'Test Service' };
      (serviceRepository.findOne as jest.Mock).mockResolvedValue(mockService);

      const result = await servicesService.findOne(1);
      expect(result).toEqual(mockService);
      expect(serviceRepository.findOne).toHaveBeenCalledWith({
        where: { service_id: 1 },
        relations: ['serviceSchedule'],
      });
    });

    it('should throw NotFoundException if service is not found', async () => {
      (serviceRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(servicesService.findOne(99)).rejects.toThrow(
        new NotFoundException('Service with ID 99 not found'),
      );
    });
  });

  describe('update', () => {
    it('should update a service if seller has permission', async () => {
      const dto: UpdateServiceDto = { service_name: 'Updated Service' };
      const mockService = { service_id: 1, service_name: 'Old Service', seller: { user_id: 1 } };

      (serviceRepository.findOne as jest.Mock).mockResolvedValue(mockService);
      (serviceRepository.preload as jest.Mock).mockResolvedValue({ ...mockService, ...dto });
      (serviceRepository.save as jest.Mock).mockResolvedValue({ ...mockService, ...dto });

      const result = await servicesService.update(1, dto, 1);
      expect(result.service_name).toEqual('Updated Service');
      expect(serviceRepository.save).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if seller does not own the service', async () => {
      const mockService = { service_id: 1, service_name: 'Old Service', seller: { user_id: 2 } };

      (serviceRepository.findOne as jest.Mock).mockResolvedValue(mockService);

      await expect(servicesService.update(1, {}, 1)).rejects.toThrow(
        new ForbiddenException('No tienes permisos para modificar este servicio'),
      );
    });

    it('should throw NotFoundException if service does not exist', async () => {
      (serviceRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(servicesService.update(99, {}, 1)).rejects.toThrow(
        new ForbiddenException('No tienes permisos para modificar este servicio'),
      );
    });
  });

  describe('remove', () => {
    it('should delete a service if seller owns it', async () => {
      const mockService = { service_id: 1, seller: { user_id: 1 } };
      (serviceRepository.findOne as jest.Mock).mockResolvedValue(mockService);
      (serviceRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      await expect(servicesService.remove(1, 1)).resolves.not.toThrow();
      expect(serviceRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if service is not found', async () => {
      (serviceRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(servicesService.remove(99, 1)).rejects.toThrow(
        new NotFoundException('Product not found with ID 99'),
      );
    });
  });
});