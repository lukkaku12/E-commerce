import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { ProductVariant } from 'src/productVariants/entities/product-variant.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Product')
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column()
  // @Index() para cuando la tabla sea masiva de datos
  gtin: string;

  @Column()
  // @Index() para cuando la tabla sea masiva de datos
  mpn: string;

  @Column()
  // @Index() para cuando la tabla sea masiva de datos
  brand: string;

  @Column()
  // @Index() para cuando la tabla sea masiva de datos
  base_model: string;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @OneToMany(() => ProductVariant, (product_variant) => product_variant.product)
  product_variants: ProductVariant[];

  @Column('timestamp')
  created_at: Date;

  @Column('timestamp')
  updated_at: Date;

  @OneToMany(() => OrderItem, (order_item) => order_item.product)
  orderItems: OrderItem[];

  @BeforeUpdate()
  updateTimestamp() {
    this.updated_at = new Date();
  }
}
