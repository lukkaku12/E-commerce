import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 50 })
  status: string; // active, abandoned, completed

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[]; // Relación con los ítems de la orden

  @OneToMany(() => Transaction, (transaction) => transaction.order)
  transactions: Transaction[];
}
