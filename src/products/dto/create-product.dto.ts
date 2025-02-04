// create-product.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  gtin: string;

  @IsNotEmpty()
  @IsString()
  mpn: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsString()
  base_model: string;

  @IsNotEmpty()
  seller_id: number; // ID del usuario vendedor
}