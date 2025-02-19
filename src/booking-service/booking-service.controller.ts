import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt/jwt-auth.guard';

import { BookingService } from './booking-service.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('booking')
// @UseGuards(JwtAuthGuard) // Protege la ruta con autenticación JWT
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({
    summary: 'Reservar un servicio',
    description: 'Reserva un servicio verificando la disponibilidad del horario y generando un enlace de pago con Mercado Pago.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 1, description: 'ID del usuario que realiza la reserva' },
        scheduleId: { type: 'number', example: 10, description: 'ID del horario a reservar' },
      },
      required: ['userId', 'scheduleId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Reserva creada exitosamente. Devuelve un enlace de pago.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Por favor completa el pago para confirmar tu reserva' },
        paymentLink: { type: 'string', example: 'https://www.mercadopago.com/payment-link' },
        scheduleDetails: {
          type: 'object',
          properties: {
            serviceName: { type: 'string', example: 'Corte de cabello' },
            startTime: { type: 'string', example: '10:00 AM' },
            endTime: { type: 'string', example: '10:30 AM' },
            date: { type: 'string', example: '2024-02-20' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Horario no disponible o usuario no encontrado.',
  })
  async bookService(
    @Body('userId') userId: number,
    @Body('scheduleId') scheduleId: number,
  ) {
    return this.bookingService.bookService(userId, scheduleId);
  }
}
