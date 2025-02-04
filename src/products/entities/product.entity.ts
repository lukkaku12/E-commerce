import { ProductVariant } from "src/productVariants/entities/product-variant.entity";
import { User } from "src/users/entities/user.entity";
import { BeforeUpdate, Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Product')
export class Product {

    @PrimaryGeneratedColumn()
    product_id: number;

    @Column()
    gtin: string;

    @Column()
    mpn: string;

    @Column()
    brand: string;

    @Column()
    base_model: string;

    @ManyToOne(() => User, user => user.products)
    @JoinColumn({name: 'seller_id'})
    seller: User;

    @OneToMany(() => ProductVariant, product_variant => product_variant.product)
    product_variants: ProductVariant[];

    @Column('timestamp')
    created_at: Date;

    @Column('timestamp')
    updated_at: Date;

    @BeforeUpdate()
    updateTimestamp() {
      this.updated_at = new Date();
    }
}
