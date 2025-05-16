import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartItemIdController } from './cart-item-id.controller';
import { CartItemIdService } from './cart-item-id.service';
import { CartItem } from './entities/cart-item-id.entity';
import { ProductVariant } from 'src/productVariants/entities/product-variant.entity';
import { UserCart } from 'src/user-cart/entities/user-cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, ProductVariant, UserCart])], // Importa la entidad en el módulo
  controllers: [CartItemIdController],
  providers: [CartItemIdService],
  exports: [CartItemIdService], // Exporta el servicio si lo necesitas en otros módulos
})
export class CartItemIdModule {}
