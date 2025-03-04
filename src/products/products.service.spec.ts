import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UsersService } from 'src/users/users.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';

const mockProductRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  preload: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  })),
};

const mockUsersService = {
  validateUserExists: jest.fn(),
};

const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
};

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe crear un producto si el seller existe', async () => {
      mockUsersService.validateUserExists.mockResolvedValue(true);
      mockProductRepository.create.mockReturnValue({});
      mockProductRepository.save.mockResolvedValue({ id: 1 });

      const result = await service.create({
        seller_id: 1,
        gtin: '123456',
        mpn: 'MPN001',
        brand: 'Marca X',
        base_model: 'Modelo Y',
      });
      expect(result).toEqual({ id: 1 });
      expect(mockProductRepository.save).toHaveBeenCalled();
    });

    it('debe lanzar un NotFoundException si el seller no existe', async () => {
      mockUsersService.validateUserExists.mockResolvedValue(false);
      await expect(service.create({
        seller_id: 1,
        gtin: '123456',
        mpn: 'MPN001',
        brand: 'Marca X',
        base_model: 'Modelo Y',
      })).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('debe retornar un producto desde la cache si está disponible', async () => {
      const product = { id: 1 };
      mockCacheManager.get.mockResolvedValue(product);
      expect(await service.findOne(1)).toEqual(product);
    });

    it('debe retornar un producto desde la BD si no está en cache', async () => {
      const product = { id: 1 };
      mockCacheManager.get.mockResolvedValue(null);
      mockProductRepository.findOne.mockResolvedValue(product);
      expect(await service.findOne(1)).toEqual(product);
    });

    it('debe lanzar NotFoundException si el producto no existe', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockProductRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});
