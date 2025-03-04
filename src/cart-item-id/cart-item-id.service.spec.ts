import { Test, TestingModule } from '@nestjs/testing';
import { CartItemIdService } from './cart-item-id.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item-id.entity';
import { NotFoundException } from '@nestjs/common';

describe('CartItemIdService', () => {
  let service: CartItemIdService;
  let mockCartItemRepository: Repository<CartItem>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemIdService,
        {
          provide: getRepositoryToken(CartItem),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CartItemIdService>(CartItemIdService);
    mockCartItemRepository = module.get<Repository<CartItem>>(getRepositoryToken(CartItem));
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debería crear un cart item', async () => {
    const cartItem = new CartItem();
    jest.spyOn(mockCartItemRepository, 'create').mockReturnValue(cartItem);
    jest.spyOn(mockCartItemRepository, 'save').mockResolvedValue(cartItem);

    const result = await service.create(cartItem);

    expect(mockCartItemRepository.create).toHaveBeenCalledWith(cartItem);
    expect(mockCartItemRepository.save).toHaveBeenCalledWith(cartItem);
    expect(result).toEqual(cartItem);
  });

  it('debería obtener todos los cart items', async () => {
    const cartItems = [new CartItem(), new CartItem()];
    jest.spyOn(mockCartItemRepository, 'find').mockResolvedValue(cartItems);

    const result = await service.findAll();

    expect(mockCartItemRepository.find).toHaveBeenCalled();
    expect(result).toEqual(cartItems);
  });

  it('debería obtener un cart item por ID', async () => {
    const cartItem = new CartItem();
    jest.spyOn(mockCartItemRepository, 'findOne').mockResolvedValue(cartItem);

    const result = await service.findOne(1);

    expect(mockCartItemRepository.findOne).toHaveBeenCalledWith({ where: { cart_item_id: 1 } });
    expect(result).toEqual(cartItem);
  });

  it('debería lanzar un error si el cart item no existe', async () => {
    jest.spyOn(mockCartItemRepository, 'findOne').mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('debería actualizar un cart item', async () => {
    const cartItem = new CartItem();
    jest.spyOn(service, 'findOne').mockResolvedValue(cartItem);
    jest.spyOn(mockCartItemRepository, 'save').mockResolvedValue(cartItem);

    const updateDto = { someField: 'updated' };
    const result = await service.update(1, updateDto);

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(mockCartItemRepository.save).toHaveBeenCalledWith(cartItem);
    expect(result).toEqual(cartItem);
  });

  it('debería eliminar los cart items de un cart', async () => {
    jest.spyOn(mockCartItemRepository, 'delete').mockResolvedValue(undefined);

    await service.removeItemsOfCart(1);

    expect(mockCartItemRepository.delete).toHaveBeenCalledWith({ cart: { cart_id: 1 } });
  });

  it('debería obtener los cart items de un cart', async () => {
    const cartItems = [new CartItem(), new CartItem()];
    jest.spyOn(mockCartItemRepository, 'find').mockResolvedValue(cartItems);

    const result = await service.getCartItemsByCartId(1);

    expect(mockCartItemRepository.find).toHaveBeenCalledWith({ where: { cart: { cart_id: 1 } } });
    expect(result).toEqual(cartItems);
  });
});
