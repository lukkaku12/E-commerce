import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-yet';

import { AttributeDefinitionModule } from './attribute-definition/attribute-definition.module';
import { AttributeDefinition } from './attribute-definition/entities/attribute-definition.entity';
import { BookingModule } from './booking-service/booking-service.module';
import { CartItemIdModule } from './cart-item-id/cart-item-id.module';
import { CartItem } from './cart-item-id/entities/cart-item-id.entity';
import { OrderItem } from './order-items/entities/order-item.entity';
import { OrderItemsModule } from './order-items/order-items.module';
import { Order } from './orders/entities/order.entity';
import { OrdersModule } from './orders/orders.module';
import { Product } from './products/entities/product.entity';
import { ProductsModule } from './products/products.module';
import { ProductVariant } from './productVariants/entities/product-variant.entity';
import { ProductVariantsModule } from './productVariants/product-variants.module';
import { SeedersModule } from './seeders/seeders.module';
import { ServiceSchedule } from './service-schedule/entities/service-schedule.entity';
import { ServiceScheduleModule } from './service-schedule/service-schedule.module';
import { Service } from './services/entities/service.entity';
import { ServicesModule } from './services/services.module';
import { Transaction } from './transactions/entities/transaction.entity';
import { TransactionsModule } from './transactions/transactions.module';
import { UserCart } from './user-cart/entities/user-cart.entity';
import { UserCartModule } from './user-cart/user-cart.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { VariantAttribute } from './variant-attributes/entities/variant-attribute.entity';
import { VariantAttributesModule } from './variant-attributes/variant-attributes.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          url: process.env.REDIS_URL,
        }),
      }),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          User,
          Product,
          Service,
          ProductVariant,
          VariantAttribute,
          AttributeDefinition,
          Transaction,
          Order,
          ServiceSchedule,
          OrderItem,
          CartItem,
          UserCart,
        ],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    UsersModule,
    ProductsModule,
    ServicesModule,
    ProductVariantsModule,
    VariantAttributesModule,
    AttributeDefinitionModule,
    ServiceScheduleModule,
    SeedersModule,
    TransactionsModule,
    OrdersModule,
    OrderItemsModule,
    BookingModule,
    UserCartModule,
    CartItemIdModule,
    AuthModule
  ],
})
export class AppModule {}
