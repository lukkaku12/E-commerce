import { Inject, Injectable, RequestTimeoutException } from '@nestjs/common';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserCartService } from 'src/user-cart/user-cart.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { TransactionsService } from 'src/transactions/transactions.service';
import { OrderItemsService } from 'src/order-items/order-items.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly userCartService: UserCartService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly transactionsService: TransactionsService,
    private readonly orderItemService: OrderItemsService,
  ) {}
  async createOrderFromCart(userId: number) {
    const cart = await this.userCartService.getCart(userId);

    if (!cart || cart.length === 0) {
      throw new Error('El carrito está vacío.');
    }

    // 1️⃣ Validar stock y calcular el total
    const total = cart.reduce(
      (sum, item) => sum + item.productVariant.price * item.quantity,
      0,
    );

    // 2️⃣ Procesar pago (simulación)
    const paymentLink = await this.transactionsService.createPayment(
      total,
      'your cart order',
      userId,
    );
    if (!paymentLink) {
      throw new RequestTimeoutException(
        'No se pudo generar el enlace de pago.',
      );
    }

    // 3️⃣ Crear la orden
    const order = this.orderRepository.create({
      user: { user_id: userId },
      status: 'pending',
    });

    await this.orderRepository.save(order);

    await this.orderItemService.createOrderItems(cart, order);
    // 4️⃣ Limpiar el carrito
    await this.userCartService.clearCart(userId);

    return { success: true, link_pago: paymentLink };
  }
}
