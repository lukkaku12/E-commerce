import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemIdService } from './cart-item-id.service';
import { CartItemIdController } from './cart-item-id.controller';
import { CartItem } from './entities/cart-item-id.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem])], // Importa la entidad en el módulo
  controllers: [CartItemIdController],
  providers: [CartItemIdService],
  exports: [CartItemIdService], // Exporta el servicio si lo necesitas en otros módulos
})
export class CartItemIdModule {}