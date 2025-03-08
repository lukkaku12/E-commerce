import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserCartService } from './user-cart.service';
import { UserCart } from './entities/user-cart.entity';
import { CartItemIdService } from 'src/cart-item-id/cart-item-id.service';
import { CartItem } from 'src/cart-item-id/entities/cart-item-id.entity';
import { UserRole } from 'src/users/entities/user.entity';

const mockUserCartRepository = () => ({
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockResolvedValue({ cart_id: 1, user: { user_id: 1 } }),
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn(),
  remove: jest.fn(),
});

const mockCartItemIdService = () => ({
  getCartItemsByCartId: jest.fn().mockResolvedValue([]),
  removeItemsOfCart: jest.fn(),
});

describe('UserCartService', () => {
  let service: UserCartService;
  let userCartRepository: Repository<UserCart>;
  let cartItemIdService: CartItemIdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCartService,
        { provide: getRepositoryToken(UserCart), useFactory: mockUserCartRepository },
        { provide: CartItemIdService, useFactory: mockCartItemIdService },
      ],
    }).compile();

    service = module.get<UserCartService>(UserCartService);
    userCartRepository = module.get<Repository<UserCart>>(getRepositoryToken(UserCart));
    cartItemIdService = module.get<CartItemIdService>(CartItemIdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user cart', async () => {
    const createUserCartDto = { user: { user_id: 1 } };
    const result = await service.create(createUserCartDto);
    expect(result).toEqual(expect.objectContaining(createUserCartDto));
  });

  it('should find all user carts', async () => {
    const result = await service.findAll();
    expect(result).toEqual([]);
  });

  it('should find a cart by ID', async () => {
    const cart: UserCart = {
        cart_id: 1,
        user: {
            user_id: 1,
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'hashedpassword',
            role: UserRole.BUYER,  // O el rol que uses
            created_at: new Date(),
            updated_at: new Date(),
            service: [], // Suponiendo que un usuario puede tener múltiples servicios, dejamos un array vacío
            products: [], // Lista de productos asociados al usuario
            transactions: [], // Historial de transacciones
            orders: [], // Lista de órdenes realizadas
            carts: [], // Carritos de compra vinculados al usuario
          },
        created_at: new Date(),
        updated_at: new Date(),
        status: 'active',  // O el estado que uses en tu entidad
        cartItems: [],     // Si `cartItems` es un array de `CartItem`, colócalo vacío
      };
    jest.spyOn(userCartRepository, 'findOne').mockResolvedValue(cart);
    const result = await service.findOne(1);
    expect(result).toEqual(cart);
  });

//   it('should update a cart', async () => {
//     const cart: UserCart = {
//       cart_id: 1,
//       user: {
//         user_id: 1,
//         name: 'John Doe',
//         email: 'johndoe@example.com',
//         password: 'hashedpassword',
//         role: UserRole.BUYER,
//         created_at: new Date(),
//         updated_at: new Date(),
//         service: [],
//         products: [],
//         transactions: [],
//         orders: [],
//         carts: [],
//       },
//       created_at: new Date(),
//       updated_at: new Date(),
//       status: 'active',
//       cartItems: [],
//     };
  
//     jest.spyOn(service, 'findOne').mockResolvedValue(cart);
  
//     // Simula que `save` devuelve el objeto actualizado
//     jest.spyOn(userCartRepository, 'save').mockImplementation((updatedCart) => 
//         Promise.resolve({ ...cart, ...updatedCart }) // Fusiona el carrito original con los cambios
//       );
  
//     const updateData = { user: { user_id: 2 } };
//     const updatedCart = await service.update(1, updateData);
  
//     expect(updatedCart).toEqual(expect.objectContaining({ user: expect.objectContaining(updateData.user) }));
//   });

  it('should remove a cart', async () => {
    const cart: UserCart = {
        cart_id: 1,
        user: {
            user_id: 1,
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'hashedpassword',
            role: UserRole.BUYER,  // O el rol que uses
            created_at: new Date(),
            updated_at: new Date(),
            service: [], // Suponiendo que un usuario puede tener múltiples servicios, dejamos un array vacío
            products: [], // Lista de productos asociados al usuario
            transactions: [], // Historial de transacciones
            orders: [], // Lista de órdenes realizadas
            carts: [], // Carritos de compra vinculados al usuario
          },
        created_at: new Date(),
        updated_at: new Date(),
        status: 'active',  // O el estado que uses en tu entidad
        cartItems: [],     // Si `cartItems` es un array de `CartItem`, colócalo vacío
      };
    jest.spyOn(service, 'findOne').mockResolvedValue(cart);
    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(userCartRepository.remove).toHaveBeenCalledWith(cart);
  });

  it('should get cart items', async () => {
    const cart: UserCart = {
        cart_id: 1,
        user: {
            user_id: 1,
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'hashedpassword',
            role: UserRole.BUYER,  // O el rol que uses
            created_at: new Date(),
            updated_at: new Date(),
            service: [], // Suponiendo que un usuario puede tener múltiples servicios, dejamos un array vacío
            products: [], // Lista de productos asociados al usuario
            transactions: [], // Historial de transacciones
            orders: [], // Lista de órdenes realizadas
            carts: [], // Carritos de compra vinculados al usuario
          },
        created_at: new Date(),
        updated_at: new Date(),
        status: 'active',  // O el estado que uses en tu entidad
        cartItems: [],     // Si `cartItems` es un array de `CartItem`, colócalo vacío
      };
    jest.spyOn(userCartRepository, 'findOne').mockResolvedValue(cart);
    const items = await service.getCart(1);
    expect(items).toEqual([]);
  });

  it('should clear a cart', async () => {
    const cart: UserCart = {
        cart_id: 1,
        user: {
            user_id: 1,
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'hashedpassword',
            role: UserRole.BUYER,  // O el rol que uses
            created_at: new Date(),
            updated_at: new Date(),
            service: [], // Suponiendo que un usuario puede tener múltiples servicios, dejamos un array vacío
            products: [], // Lista de productos asociados al usuario
            transactions: [], // Historial de transacciones
            orders: [], // Lista de órdenes realizadas
            carts: [], // Carritos de compra vinculados al usuario
          },
        created_at: new Date(),
        updated_at: new Date(),
        status: 'active',  // O el estado que uses en tu entidad
        cartItems: [],     // Si `cartItems` es un array de `CartItem`, colócalo vacío
      };
    jest.spyOn(userCartRepository, 'findOne').mockResolvedValue(cart);
    await service.clearCart(1);
    expect(cartItemIdService.removeItemsOfCart).toHaveBeenCalledWith(cart.cart_id);
    expect(userCartRepository.remove).toHaveBeenCalledWith(cart);
  });
});