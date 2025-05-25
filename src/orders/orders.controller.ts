import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { Request } from 'express';
import { OrdersService } from './orders.service';
import { JwtPayload } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';

@ApiTags('Orders')
@ApiBearerAuth() // Agrega el botón de "Authorize" en Swagger
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una orden',
    description: 'Crea una orden para el usuario autenticado a partir de su carrito.',
  })
  @ApiResponse({ status: 201, description: 'Orden creada correctamente', schema: {
    example: {
      success: true,
      link_pago: 'https://mercadopago.com/link-de-pago'
    }
  }})
  create(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.ordersService.createOrderFromCart(user.sub);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar órdenes del usuario',
    description: 'Devuelve todas las órdenes del usuario autenticado, incluyendo ítems y transacciones.',
  })
  @ApiResponse({
    status: 200,
    description: 'Órdenes recuperadas correctamente',
    schema: {
      example: [
        {
          order_id: 1,
          status: 'completed',
          created_at: '2024-05-25T14:00:00Z',
          items: [
            { product_name: 'Camiseta', quantity: 2 }
          ],
          transactions: [
            { payment_method: 'credit_card', amount: 40000, status: 'success' }
          ]
        }
      ]
    }
  })
  findAllByUser(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.ordersService.findOrdersByUser(user.sub);
  }

    // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
  // cuando se haga devolución de órdenes ahí sí se borra o se cambia el registro de transacción
}