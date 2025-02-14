import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Service } from 'src/services/entities/service.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
}

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  user_id?: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.BUYER,
  })
  role: UserRole;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Service, (service) => service.seller)
  service: Service[];

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
