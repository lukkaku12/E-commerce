import { VariantAttribute } from 'src/variant-attributes/entities/variant-attribute.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('attribute_definitions')
export class AttributeDefinition {
  @PrimaryGeneratedColumn('increment', { name: 'attribute_id' })
  attributeId: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  attributeName: string;

  @Column({ type: 'varchar', length: 50 })
  dataType: string;

  // Relación con VariantAttributes
  @OneToMany(() => VariantAttribute, (va) => va.attributeDefinition)
  variantAttributes: VariantAttribute[];
}
