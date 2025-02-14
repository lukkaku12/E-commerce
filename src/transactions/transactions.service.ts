import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  private readonly client: MercadoPagoConfig;

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    // Configuración de Mercado Pago
    this.client = new MercadoPagoConfig({
      accessToken: this.configService.get<string>('MERCADO_PAGO_ACCESS_TOKEN'),
    });
  }

  /**
   * Crea una preferencia de pago en Mercado Pago y registra la transacción en la base de datos.
   */
  async createPayment(
    amount: number,
    description: string,
    userId: number,
    metadata?: Record<string, any>,
  ) {
    // 1. Crear preferencia en Mercado Pago
    const preference = new Preference(this.client);
    const itemId = `item-${Date.now()}-${userId}`;

    const response = await preference.create({
      body: {
        items: [
          {
            id: itemId,
            title: description,
            quantity: 1,
            currency_id: 'COP', // Moneda en pesos colombianos
            unit_price: amount,
          },
        ],
        back_urls: {
          success: `${this.configService.get('APP_URL')}/transactions/success`,
          failure: `${this.configService.get('APP_URL')}/transactions/failure`,
          pending: `${this.configService.get('APP_URL')}/transactions/pending`,
        },
        auto_return: 'approved', // Redirige automáticamente si el pago es exitoso
        metadata: metadata,
        notification_url: `${this.configService.get(
          'APP_URL',
        )}/transactions/webhook`, // Webhook para actualizaciones
      },
    });

    const user = await this.userRepository.findOneBy({ user_id: userId });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // 2. Registrar transacción en la base de datos
    const transaction = this.transactionRepository.create({
      user,
      description,
      status: 'pending', // Estado inicial
      mercado_pago_id: response.id, // ID de la preferencia en Mercado Pago
      metadata,
      transaction_date: new Date(),
      transaction_amount: amount
    });
    await this.transactionRepository.save(transaction);

    // 3. Retornar el enlace de pago
    return response.init_point;
  }

  /**
   * Maneja el webhook de Mercado Pago para actualizar el estado de la transacción.
   */
  async handleWebhook(data: any) {
    // 1. Obtener el ID del pago desde el webhook
    const paymentId = data.data.id;

    // 2. Obtener los detalles del pago desde Mercado Pago
    const payment = new Payment(this.client);
    const paymentInfo = await payment.get({ id: paymentId });

    // 3. Actualizar la transacción en la base de datos
    await this.transactionRepository.update(
      { mercado_pago_id: paymentInfo.external_reference },
      {
        status: paymentInfo.status, // approved, rejected, pending
        payment_method_id: paymentInfo.payment_method_id, // Método de pago (visa, mastercard, etc.)
      },
    );

    return { ok: true };
  }
}
