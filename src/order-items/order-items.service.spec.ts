import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemsService } from './order-items.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { ProductVariantsService } from 'src/productVariants/product-variants.service';
import { NotFoundException } from '@nestjs/common';

describe('OrderItemsService', () => {
  let service: OrderItemsService;
  let mockOrderItemsRepository: jest.Mocked<Repository<OrderItem>>;
  let mockProductVariantService: Partial<Record<keyof ProductVariantsService, jest.Mock>>;

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    mockProductVariantService = {
      updateStock: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemsService,
        { provide: getRepositoryToken(OrderItem), useValue: mockRepo },
        { provide: ProductVariantsService, useValue: mockProductVariantService },
      ],
    }).compile();

    service = module.get<OrderItemsService>(OrderItemsService);
    mockOrderItemsRepository = module.get(getRepositoryToken(OrderItem));
  });

  it('debería encontrar todos los order items', async () => {
    const orderItems = [new OrderItem()];
    mockOrderItemsRepository.find.mockResolvedValue(orderItems);

    const result = await service.findAll();

    expect(result).toEqual(orderItems);
    expect(mockOrderItemsRepository.find).toHaveBeenCalledWith({ relations: ['order', 'productVariant'] });
  });

  it('debería lanzar error si no encuentra un order item', async () => {
    mockOrderItemsRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('debería actualizar un order item', async () => {
    const id = 1;
    const mockOrderItem = new OrderItem();
    const updateDto = { quantity: 5 };
    
    jest.spyOn(service, 'findOne').mockResolvedValue(mockOrderItem);
    mockOrderItemsRepository.save.mockResolvedValue(mockOrderItem);

    const result = await service.update(id, updateDto);

    expect(service.findOne).toHaveBeenCalledWith(id);
    expect(mockOrderItemsRepository.save).toHaveBeenCalledWith(mockOrderItem);
    expect(result).toEqual(mockOrderItem);
  });

  it('debería eliminar un order item', async () => {
    const mockOrderItem = new OrderItem();
    
    jest.spyOn(service, 'findOne').mockResolvedValue(mockOrderItem);
    mockOrderItemsRepository.remove.mockResolvedValue(mockOrderItem);

    const result = await service.remove(1);

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(mockOrderItemsRepository.remove).toHaveBeenCalledWith(mockOrderItem);
    expect(result).toEqual(mockOrderItem);
  });
});