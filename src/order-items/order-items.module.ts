import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { ProductVariant } from 'src/productVariants/entities/product-variant.entity';
import { ProductVariantsService } from 'src/productVariants/product-variants.service';

import { OrderItem } from './entities/order-item.entity';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsService } from './order-items.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, ProductVariant, Product])],
  controllers: [OrderItemsController],
  providers: [OrderItemsService, ProductVariantsService],
})
export class OrderItemsModule {}
