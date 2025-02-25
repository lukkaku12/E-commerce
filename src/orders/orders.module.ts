import { Module } from '@nestjs/common';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { UserCartService } from 'src/user-cart/user-cart.service';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { ServiceScheduleService } from 'src/service-schedule/service-schedule.service';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { ProductVariantsService } from 'src/productVariants/product-variants.service';
import { UserCart } from 'src/user-cart/entities/user-cart.entity';
import { CartItemIdService } from 'src/cart-item-id/cart-item-id.service';
import { ServiceSchedule } from 'src/service-schedule/entities/service-schedule.entity';
import { ServicesService } from 'src/services/services.service';
import { ProductVariant } from 'src/productVariants/entities/product-variant.entity';
import { Product } from 'src/products/entities/product.entity';
import { CartItem } from 'src/cart-item-id/entities/cart-item-id.entity';
import { Service } from 'src/services/entities/service.entity';

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
