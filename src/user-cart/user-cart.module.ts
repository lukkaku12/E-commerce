import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemIdService } from 'src/cart-item-id/cart-item-id.service';
import { CartItem } from 'src/cart-item-id/entities/cart-item-id.entity';

import { UserCart } from './entities/user-cart.entity'; // Asegúrate de que este archivo existe
import { UserCartController } from './user-cart.controller';
import { UserCartService } from './user-cart.service';
import { CartItemIdModule } from 'src/cart-item-id/cart-item-id.module';
import { ProductVariant } from 'src/productVariants/entities/product-variant.entity';

@Module({
  imports: [CartItemIdModule, TypeOrmModule.forFeature([UserCart, CartItem, ProductVariant])], // Importa la entidad en el módulo
  controllers: [UserCartController],
  providers: [UserCartService, CartItemIdService],
  exports: [UserCartService], // Exporta el servicio si lo necesitas en otros módulos
})
export class UserCartModule {}
