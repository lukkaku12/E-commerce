import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UserCartService } from 'src/user-cart/user-cart.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { RequestTimeoutException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let mockOrderRepository: jest.Mocked<Repository<Order>>;
  let mockUserCartService: jest.Mocked<UserCartService>;
  let mockTransactionsService: jest.Mocked<TransactionsService>;
  let mockOrderItemsService: jest.Mocked<OrderItemsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: UserCartService,
          useValue: {
            getCart: jest.fn(),
            clearCart: jest.fn(),
          },
        },
        {
          provide: TransactionsService,
          useValue: {
            createPayment: jest.fn(),
            refundPayment: jest.fn(),
          },
        },
        {
          provide: OrderItemsService,
          useValue: {
            createOrderItems: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    mockOrderRepository = module.get(getRepositoryToken(Order));
    mockUserCartService = module.get(UserCartService);
    mockTransactionsService = module.get(TransactionsService);
    mockOrderItemsService = module.get(OrderItemsService);
  });

  it('debería crear una orden desde el carrito', async () => {
    const userId = 1;
    const cart = [
        {
          cart_item_id: 1, // ID necesario
          cart: null, // Ajusta según tu estructura real
          productVariant: {
            variant_id: 1,
            product: null,
            variantAttributes: [],
            price: 10,
            stock: 100,
            sku: 'SKU123',
            created_at: new Date(),
            updated_at: new Date(),
            orderItems: [],
            cartItems: [],
          },
          quantity: 2,
        },
      ];
    const paymentLink = 'http://payment.link';
    const order = new Order();
    
    mockUserCartService.getCart.mockResolvedValue(cart);
    mockTransactionsService.createPayment.mockResolvedValue(paymentLink);
    mockOrderRepository.create.mockReturnValue(order);
    mockOrderRepository.save.mockResolvedValue(order);
    mockOrderItemsService.createOrderItems.mockResolvedValue(undefined);
    mockUserCartService.clearCart.mockResolvedValue(undefined);

    const result = await service.createOrderFromCart(userId);

    expect(mockUserCartService.getCart).toHaveBeenCalledWith(userId);
    expect(mockTransactionsService.createPayment).toHaveBeenCalledWith(20, 'your cart order', userId);
    expect(mockOrderRepository.create).toHaveBeenCalledWith({ user: { user_id: userId }, status: 'pending' });
    expect(mockOrderRepository.save).toHaveBeenCalledWith(order);
    expect(mockOrderItemsService.createOrderItems).toHaveBeenCalledWith(cart, order);
    expect(mockUserCartService.clearCart).toHaveBeenCalledWith(userId);
    expect(result).toEqual({ success: true, link_pago: paymentLink });
  });

  it('debería lanzar un error si el carrito está vacío', async () => {
    mockUserCartService.getCart.mockResolvedValue([]);
    await expect(service.createOrderFromCart(1)).rejects.toThrow('El carrito está vacío.');
  });

  it('debería lanzar un error si no se genera un enlace de pago', async () => {
    mockUserCartService.getCart.mockResolvedValue([
        {
          cart_item_id: 1,
          cart: null, // Ajusta según tu estructura real
          productVariant: {
            variant_id: 1,
            product: null,
            variantAttributes: [],
            price: 10,
            stock: 100,
            sku: 'SKU123',
            created_at: new Date(),
            updated_at: new Date(),
            orderItems: [],
            cartItems: [],
          },
          quantity: 2,
        },
      ]);
    mockTransactionsService.createPayment.mockResolvedValue(null);
    
    await expect(service.createOrderFromCart(1)).rejects.toThrow(RequestTimeoutException);
  });

  it('debería procesar un reembolso de orden', async () => {
    const orderId = 1;
    mockTransactionsService.refundPayment.mockResolvedValue(undefined);
    
    const result = await service.refundOrder(orderId);
    
    expect(mockTransactionsService.refundPayment).toHaveBeenCalledWith(orderId);
    expect(result).toEqual({ success: true });
  });
});