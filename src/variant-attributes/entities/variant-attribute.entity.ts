import { AttributeDefinition } from 'src/attribute-definition/entities/attribute-definition.entity';
import { ProductVariant } from 'src/productVariants/entities/product-variant.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('variant_attributes')
export class VariantAttribute {
  @PrimaryColumn({ name: 'variant_id' })
  variantId: number;

  @PrimaryColumn({ name: 'attribute_id' })
  attributeId: number;

  @Column({ type: 'text' })
  attributeValue: string;

  // Relación ManyToOne con AttributeDefinition
  @ManyToOne(() => AttributeDefinition, (ad) => ad.variantAttributes)
  @JoinColumn({ name: 'attribute_id' }) // Especifica la columna de la clave foránea
  attributeDefinition: AttributeDefinition;

  // Relación ManyToOne con ProductVariant
  @ManyToOne(() => ProductVariant, (pv) => pv.variantAttributes)
  @JoinColumn({ name: 'variant_id' }) // Especifica la columna de la clave foránea
  productVariant: ProductVariant;
}
