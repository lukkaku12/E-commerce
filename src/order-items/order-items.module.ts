import { Module } from '@nestjs/common';

import { OrderItemsController } from './order-items.controller';
import { OrderItemsService } from './order-items.service';
import { OrderItem } from './entities/order-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantsService } from 'src/productVariants/product-variants.service';
import { ProductVariant } from 'src/productVariants/entities/product-variant.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, ProductVariant, Product])],
  controllers: [OrderItemsController],
  providers: [OrderItemsService, ProductVariantsService],
})
export class OrderItemsModule {}
