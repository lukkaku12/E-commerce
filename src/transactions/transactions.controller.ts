import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * Crea un pago y retorna el enlace de Mercado Pago.
   */
  @Post()
  @ApiOperation({ summary: 'Crear un pago con Mercado Pago' })
  @ApiResponse({ status: 201, description: 'Enlace de pago generado exitosamente' })
  @ApiBody({
    type: CreateTransactionDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de creación de pago',
        value: {
          amount: 59.99,
          description: 'Compra de productos',
          userId: 42,
          metadata: {
            orderId: 101,
          },
        },
      },
    },
  })
  async createPayment(
    @Body() createPaymentDto: CreateTransactionDto,
    metadata: any,
  ) {
    const { amount, description, userId } = createPaymentDto;
    return this.transactionsService.createPayment(
      amount,
      description,
      userId,
      metadata,
    );
  }

  /**
   * Maneja el webhook de Mercado Pago.
   */
  @Post('webhook')
  @ApiOperation({ summary: 'Webhook de Mercado Pago' })
  @ApiBody({
    description: 'Payload enviado por Mercado Pago',
    examples: {
      ejemplo: {
        summary: 'Notificación de Mercado Pago',
        value: {
          action: 'payment.created',
          data: { id: '1234567890' },
          type: 'payment',
        },
      },
    },
  })
  async handleWebhook(@Body() data: any) {
    return this.transactionsService.handleWebhook(data);
  }

  /**
   * Redirección después de un pago exitoso.
   */
  @Get('success')
  @ApiOperation({ summary: 'Redirección después de un pago exitoso' })
  async handleSuccess(@Query('payment_id') paymentId: string) {
    return { message: 'Pago exitoso', paymentId };
  }

  /**
   * Redirección después de un pago fallido.
   */
  @Get('failure')
  @ApiOperation({ summary: 'Redirección después de un pago fallido' })
  async handleFailure() {
    return { message: 'Pago fallido' };
  }

  /**
   * Redirección después de un pago pendiente.
   */
  @Get('pending')
  @ApiOperation({ summary: 'Redirección después de un pago pendiente' })
  async handlePending() {
    return { message: 'Pago pendiente' };
  }
}