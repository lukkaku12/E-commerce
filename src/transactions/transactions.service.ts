import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { ServiceScheduleService } from 'src/service-schedule/service-schedule.service';
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
    private readonly serviceScheduleService: ServiceScheduleService,
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
            currency_id: 'COP',
            unit_price: amount,
          },
        ],
        back_urls: {
          success: `${this.configService.get('APP_URL')}/transactions/success`,
          failure: `${this.configService.get('APP_URL')}/transactions/failure`,
          pending: `${this.configService.get('APP_URL')}/transactions/pending`,
        },
        auto_return: 'approved', // Redirige automáticamente si el pago es exitoso
        notification_url: `${this.configService.get(
          'APP_URL',
        )}/transactions/webhook`, // Webhook para actualizaciones
      },
    });

    const user = await this.userRepository.findOneBy({ user_id: userId });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const registryData: any = {};

    // Verificar si metadata contiene scheduleId u orderId
  if (metadata && metadata.scheduleId) {
    registryData.service_schedule_id = metadata.scheduleId;
  } else if (metadata && metadata.orderId) {
    registryData.order_id = metadata.orderId;
  }

    // 2. Registrar transacción en la base de datos
    const transaction = this.transactionRepository.create({
      user,
      description,
      status: 'pending', // Estado inicial
      mercado_pago_id: response.id, // ID de la preferencia en Mercado Pago
      transaction_date: new Date(),
      transaction_amount: amount,
      ...registryData, // Agregar dinámicamente el campo correspondiente
    });

    await this.transactionRepository.save(transaction);

    // 3. Retornar el enlace de pago
    return response.init_point;
  }

  async refundPayment(idOfProductPurchased: number): Promise<Object> {
    const transactionToRefund = await this.findTransactionByReference(
      idOfProductPurchased,
    );

    if (!transactionToRefund) {
      console.error('�� Transacción no encontrada.');
      return;
    }

    const serviceSchedule = await this.serviceScheduleService.findOne(
      Number(transactionToRefund.schedule),
    );
    if (!serviceSchedule) {
      console.error('�� Item de orden o fecha de servicio no encontrado.');
      return;
    }

    if (serviceSchedule) {
      const updatedSchedule = {
        ...serviceSchedule,
        isAvailable: true,
      };

      const responseFromDB = await this.serviceScheduleService.save(
        updatedSchedule,
      );

      if (responseFromDB) {
        console.log('service Schedule updated');
      }
    }

    const payment_id = transactionToRefund.payment_id;

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${payment_id}/refunds`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      },
    );

    const refundData = await response.json();

    if (!response.ok) {
      console.error('❌ Error al procesar el reembolso:', refundData);
      return;
    }

    console.log('✅ Reembolso exitoso:', refundData);

    // 3️⃣ Registrar el nuevo reembolso como una transacción separada
    const refundTransaction = this.transactionRepository.create({
      user: transactionToRefund.user,
      description: `Reembolso de ${transactionToRefund.description}`,
      status: 'refunded',
      payment_id: refundData.payment_id,
      mercado_pago_id: transactionToRefund.mercado_pago_id,
      transaction_date: new Date(refundData.date_created),
      transaction_amount: -refundData.amount, // Monto negativo para indicar reembolso
      metadata: {
        refund_id: refundData.id,
        PaymentId: transactionToRefund.transaction_id,
      },
      created_at: new Date(),
    });

    await this.transactionRepository.save(refundTransaction);
    return { message:'✅ Reembolso registrado en la base de datos.'};
  }

  async handleWebhook(data: any) {
    console.log('📩 Webhook recibido:', JSON.stringify(data, null, 2));

    if (!data || (!data.resource && !data.data?.id)) {
      console.error('❌ Webhook vacío o con estructura incorrecta.');
      return;
    }

    // 1️⃣ Manejo de `merchant_order`
    if (data.resource && data.topic === 'merchant_order') {
      console.log(
        "🔍 Webhook con 'resource', haciendo fetch a:",
        data.resource,
      );

      const transactionDetails = await this.fetchMerchantDetails(data.resource);
      if (!transactionDetails || !transactionDetails.preference_id) {
        console.error(
          '❌ No se pudo obtener información válida de la transacción.',
        );
        return;
      }

      console.log('✅ Datos obtenidos de la API:', transactionDetails);

      const updateData: any = {};
      if (transactionDetails.payments[0]?.status)
        updateData.status = transactionDetails.payments[0].status;
      if (transactionDetails.payments[0]?.date_approved)
        updateData.date_approved = transactionDetails.payments[0].date_approved;
      if (transactionDetails.collector?.email)
        updateData.payer_email = transactionDetails.collector.email;
      if (transactionDetails.payments[0]?.id)
        updateData.payment_id = transactionDetails.payments[0].id;

      if (Object.keys(updateData).length > 0) {
        await this.transactionRepository.update(
          { mercado_pago_id: transactionDetails.preference_id },
          updateData,
        );
        console.log(
          '✅ Transacción actualizada correctamente en la base de datos.',
        );
      }
    }

    // 2️⃣ Manejo de `payment.created`
    else if (data.data?.id && data.action === 'payment.created') {
      console.log("🔍 Webhook con 'data.id', consultando detalles del pago.");

      const paymentDetails = await this.fetchTransactionDetails(data.data.id);
      if (!paymentDetails || !paymentDetails.payer) {
        console.error('❌ No se pudo obtener detalles del pago.');
        return;
      }
      const email = paymentDetails.payer.email;
      const payment_method_id = paymentDetails.payment_method_id;
      const currency_id = paymentDetails.currency_id;
      const orderId = paymentDetails.order?.id;

      if (orderId) {
        const merchantDetails = await this.fetchMerchantDetails(
          `https://api.mercadolibre.com/merchant_orders/${orderId}`,
        );
        if (!merchantDetails || !merchantDetails.preference_id) {
          console.error('❌ No se pudo obtener información del pedido.');
          return;
        }

        const updateData: any = {};
        if (email) updateData.payer_email = email;
        if (payment_method_id) updateData.payment_method_id = payment_method_id;
        if (currency_id) updateData.currency_id = currency_id;

        if (Object.keys(updateData).length > 0) {
          await this.transactionRepository.update(
            { mercado_pago_id: merchantDetails.preference_id },
            updateData,
          );
          console.log(
            '✅ Transacción actualizada correctamente con la nueva información.',
          );
        }
      }
    }

    // 3️⃣ Manejo de `payment`
    else if (data.resource && data.topic === 'payment') {
      console.log(
        "🔍 Webhook con 'resource' de tipo 'payment', consultando detalles del pago.",
      );

      const paymentDetails = await this.fetchTransactionDetails(data.resource);
      if (!paymentDetails || !paymentDetails.payer) {
        console.error('❌ No se pudo obtener detalles del pago.');
        return;
      }

      const email = paymentDetails.payer.email;
      const payment_method_id = paymentDetails.payment_method_id;
      const currency_id = paymentDetails.currency_id;
      const orderId = paymentDetails.order?.id;

      if (orderId) {
        const merchantDetails = await this.fetchMerchantDetails(
          `https://api.mercadolibre.com/merchant_orders/${orderId}`,
        );
        if (!merchantDetails || !merchantDetails.preference_id) {
          console.error('❌ No se pudo obtener información del pedido.');
          return;
        }

        const updateData: any = {};
        if (email) updateData.payer_email = email;
        if (payment_method_id) updateData.payment_method_id = payment_method_id;
        if (currency_id) updateData.currency_id = currency_id;

        if (Object.keys(updateData).length > 0) {
          await this.transactionRepository.update(
            { mercado_pago_id: merchantDetails.preference_id },
            updateData,
          );
          console.log(
            '✅ Transacción actualizada correctamente con la nueva información.',
          );
        }
      }
    }
  }

  async fetchTransactionDetails(id: string) {
    try {
      const url = id.startsWith('http')
        ? id
        : `https://api.mercadopago.com/v1/payments/${id}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
        method: 'GET',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo datos de Mercado Pago:', error);
      return null;
    }
  }

  async fetchMerchantDetails(merchantUrl: string) {
    try {
      const url = merchantUrl.startsWith('http')
        ? merchantUrl
        : `https://api.mercadolibre.com/merchant_orders/${merchantUrl}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
        method: 'GET',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo detalles del merchant:', error);
      return null;
    }
  }

  async findTransactionByReference(referenceId: number) {
    const transaction = await this.transactionRepository.findOne({
      where: [
        { order: { order_id: referenceId } },
        { schedule: { schedule_id: referenceId } },
      ],
    });

    if (!transaction) {
      throw new NotFoundException(
        'No se encontró una transacción para este ID.',
      );
    }

    return transaction;
  }
}
