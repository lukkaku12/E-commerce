import { ProductVariant } from 'src/productVariants/entities/product-variant.entity';
import { UserCart } from 'src/user-cart/entities/user-cart.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cart_item_id')
export class CartItem {
  @PrimaryGeneratedColumn()
  cart_item_id: number;

  @ManyToOne(() => ProductVariant, (productVariant) => productVariant.cartItems)
  @JoinColumn({ name: 'product_id' })
  productVariant: ProductVariant;

  @ManyToOne(() => UserCart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_cart_id' })
  cart: UserCart;

  @Column({ type: 'int', default: 1 })
  quantity: number;
}
