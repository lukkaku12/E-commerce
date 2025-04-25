import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/cart-item-id/entities/cart-item-id.entity';
import { Order } from 'src/orders/entities/order.entity';
import { ProductVariantsService } from 'src/productVariants/product-variants.service';
import { Repository } from 'typeorm';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    private readonly productVariantService: ProductVariantsService,
  ) {}
  async findAll() {
    return this.orderItemsRepository.find({ relations: ['order', 'productVariant'] });
  }

  async findOne(idOfOrder: number) {
    const orderItem = await this.orderItemsRepository.findOne({
      where: { order: { order_id: idOfOrder }},
      relations: ['order', 'productVariant'],
    });

    if (!orderItem) {
      throw new NotFoundException(`OrderItem con ID ${idOfOrder} no encontrado`);
    }

    return orderItem;
  }

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const orderItem = this.orderItemsRepository.create(createOrderItemDto);
    return this.orderItemsRepository.save(orderItem);
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    const orderItem = await this.findOne(id);

    Object.assign(orderItem, updateOrderItemDto);
    return this.orderItemsRepository.save(orderItem);
  }

  async remove(id: number) {
    const orderItem = await this.findOne(id);
    return this.orderItemsRepository.remove(orderItem);
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
