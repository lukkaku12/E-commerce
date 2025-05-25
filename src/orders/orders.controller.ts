import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { OrdersService } from './orders.service';
import { JwtPayload } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';

@ApiTags('Orders')
@ApiBearerAuth() // indica que requiere token JWT
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una orden a partir del carrito del usuario autenticado' })
  @ApiResponse({ status: 201, description: 'Orden creada correctamente' })
  create(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.ordersService.createOrderFromCart(user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las órdenes del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Órdenes recuperadas correctamente' })
  findAllByUser(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.ordersService.findOrdersByUser(user.sub);
  }
}

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
  // cuando se haga devolución de órdenes ahí sí se borra o se cambia el registro de transacción
}