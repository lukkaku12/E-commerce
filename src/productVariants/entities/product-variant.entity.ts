import { Product } from "src/products/entities/product.entity";
import { VariantAttribute } from "src/variant-attributes/entities/variant-attribute.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Product_Variant')
export class ProductVariant {

    @PrimaryGeneratedColumn()
    variant_id: number;

    @ManyToOne(() => Product, product => product.product_variants)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @OneToMany(() => VariantAttribute, va => va.productVariant)
    variantAttributes: VariantAttribute[];

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number; // Almacena el valor numérico (ej: 19999.99)

    @Column({ type: 'int' })
    stock: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    sku: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}