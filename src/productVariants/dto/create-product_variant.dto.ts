// create-product_variant.dto.ts
import { IsDecimal, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateProductVariantDto {
  @IsInt()
  @IsNotEmpty()
  product_id: number;

  @IsDecimal({ decimal_digits: '2' })
  price: number;

  @IsInt()
  stock: number;

  @IsString()
  @IsNotEmpty()
  sku: string;
}
