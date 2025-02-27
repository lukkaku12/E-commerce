import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemIdService } from 'src/cart-item-id/cart-item-id.service';
import { CartItem } from 'src/cart-item-id/entities/cart-item-id.entity';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { Product } from 'src/products/entities/product.entity';
import { ProductVariant } from 'src/productVariants/entities/product-variant.entity';
import { ProductVariantsService } from 'src/productVariants/product-variants.service';
import { ServiceSchedule } from 'src/service-schedule/entities/service-schedule.entity';
import { ServiceScheduleService } from 'src/service-schedule/service-schedule.service';
import { Service } from 'src/services/entities/service.entity';
import { ServicesService } from 'src/services/services.service';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { UserCart } from 'src/user-cart/entities/user-cart.entity';
import { UserCartService } from 'src/user-cart/user-cart.service';
import { User } from 'src/users/entities/user.entity';

import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Transaction,
      User,
      OrderItem,
      UserCart,
      ServiceSchedule,
      ProductVariant,
      Product,
      CartItem,
      Service,
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    TransactionsService,
    OrderItemsService,
    UserCartService,
    ServiceScheduleService,
    ProductVariantsService,
    CartItemIdService,
    ServicesService,
  ],
})
export class OrdersModule {}
