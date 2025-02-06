import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-yet';

import { AttributeDefinitionModule } from './attribute-definition/attribute-definition.module';
import { AttributeDefinition } from './attribute-definition/entities/attribute-definition.entity';
import { Product } from './products/entities/product.entity';
import { ProductsModule } from './products/products.module';
import { ProductVariant } from './productVariants/entities/product-variant.entity';
import { ProductVariantsModule } from './productVariants/product-variants.module';
import { ServiceScheduleModule } from './service-schedule/service-schedule.module';
import { Service } from './services/entities/service.entity';
import { ServicesModule } from './services/services.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { VariantAttribute } from './variant-attributes/entities/variant-attribute.entity';
import { VariantAttributesModule } from './variant-attributes/variant-attributes.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
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
  ],
})
export class AppModule {}
