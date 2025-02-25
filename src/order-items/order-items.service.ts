import { Injectable } from '@nestjs/common';

import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from './entities/order-item.entity';
import { Repository } from 'typeorm';
import { CartItem } from 'src/cart-item-id/entities/cart-item-id.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariantsService } from 'src/productVariants/product-variants.service';
import { Order } from 'src/orders/entities/order.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    private readonly productVariantService: ProductVariantsService,
  ) {}
  create(createOrderItemDto: CreateOrderItemDto) {
    return 'This action adds a new orderItem';
  }

  findAll() {
    return `This action returns all orderItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderItem`;
  }

  update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    return `This action updates a #${id} orderItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderItem`;
  }

  async createOrderItems(
    cartItems: CartItem[],
    orderEntity: Order,
  ): Promise<OrderItem[]> {
    const orderItems = [];
    for (const item of cartItems) {
      const orderItem = this.orderItemsRepository.create({
        order: orderEntity,
        productVariant: item.productVariant,
        quantity: item.quantity,
      });

      orderItems.push(orderItem);

      // Descontar stock
      await this.productVariantService.updateStock(
        item.productVariant.variant_id,
        item.quantity,
      );
    }
    return this.orderItemsRepository.save(orderItems);
  }
}
