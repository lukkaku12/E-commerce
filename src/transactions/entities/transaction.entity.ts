import { Order } from 'src/orders/entities/order.entity';
import { ServiceSchedule } from 'src/service-schedule/entities/service-schedule.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  transaction_id: number;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Order, (order) => order.transactions, { nullable: true }) // Ahora es opcional
  @JoinColumn({ name: 'order_id' })
  order?: Order;

  @ManyToOne(() => ServiceSchedule, (schedule) => schedule.transactions, { nullable: true }) // Ahora es opcional
  @JoinColumn({ name: 'service_schedule_id' })
  schedule?: ServiceSchedule;

  @Column({ type: 'timestamp', nullable: false }) // Sigue siendo obligatorio
  transaction_date: Date;

  @Column({ nullable: true }) // Ahora opcional
  mercado_pago_id?: string;

  @Column({ nullable: true }) // Ahora opcional
  payment_id?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false }) // Sigue siendo obligatorio
  transaction_amount: number;

  @Column({ nullable: true }) // Ahora opcional
  currency_id?: number;

  @Column({ nullable: true }) // Ahora opcional
  payment_method_id?: string;

  @Column({ type: 'varchar', length: 50, nullable: false }) // Sigue siendo obligatorio
  status: string;

  @Column({ nullable: true, type: 'timestamp' }) // Ahora opcional
  date_approved?: Date;

  @Column({ nullable: true }) // Ahora opcional
  payer_email?: string;

  @Column({ nullable: true, type: 'text' }) // Ahora opcional
  description?: string;

  @Column({ type: 'json', nullable: true }) // Ahora opcional
  metadata?: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;
}