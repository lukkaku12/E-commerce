import { CartItem } from 'src/cart-item-id/entities/cart-item-id.entity';
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

@Entity('user_cart')
export class UserCart {
  @PrimaryGeneratedColumn()
  cart_id: number;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'abandoned', 'completed'],
    default: 'active',
  })
  status: 'active' | 'abandoned' | 'completed';

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  @JoinColumn({ name: 'cart_item_id' })
  cartItems: CartItem[];
}
