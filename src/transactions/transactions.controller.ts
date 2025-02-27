import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * Crea un pago y retorna el enlace de Mercado Pago.
   */
  @Post()
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
  // metadata sera el objeto con el scheduleId o el orderId

  /**
   * Maneja el webhook de Mercado Pago.
   */
  @Post('webhook')
  async handleWebhook(@Body() data: any) {
    return this.transactionsService.handleWebhook(data);
  }

  /**
   * Redirección después de un pago exitoso.
   */
  @Get('success')
  async handleSuccess(@Query('payment_id') paymentId: string) {
    return { message: 'Pago exitoso', paymentId };
  }

  /**
   * Redirección después de un pago fallido.
   */
  @Get('failure')
  async handleFailure() {
    return { message: 'Pago fallido' };
  }

  /**
   * Redirección después de un pago pendiente.
   */
  @Get('pending')
  async handlePending() {
    return { message: 'Pago pendiente' };
  }
}
