import { Controller, Post, Req } from '@nestjs/common';
import { JwtPayload } from 'auth/auth.service';
import { Request } from 'express';

import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.ordersService.createOrderFromCart(user.sub);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
  // cuando se haga devolucion de ordenes ahi si se borra o se cambia el registro de transaccion
}
