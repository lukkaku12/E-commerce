import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../products/entities/product.entity';
import { CreateProductVariantDto } from './dto/create-product_variant.dto';
import { UpdateProductVariantDto } from './dto/update-product_variant.dto';
import { ProductVariant } from './entities/product-variant.entity';

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(
    createProductVariantDto: CreateProductVariantDto,
  ): Promise<ProductVariant> {
    // Validar que el producto exista
    const product = await this.productRepository.findOne({
      where: { product_id: createProductVariantDto.product_id },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${createProductVariantDto.product_id} not found`,
      );
    }

    const newVariant = this.productVariantRepository.create({
      ...createProductVariantDto,
      product: product,
    });

    return await this.productVariantRepository.save(newVariant);
  }

  async findAll(): Promise<ProductVariant[]> {
    return await this.productVariantRepository.find({
      relations: ['product', 'variantAttributes'],
    });
  }

  async findOne(id: number): Promise<ProductVariant> {
    const variant = await this.productVariantRepository.findOne({
      where: { variant_id: id },
      relations: ['product', 'variantAttributes'],
    });

    if (!variant) {
      throw new NotFoundException(`Product variant with ID ${id} not found`);
    }

    return variant;
  }

  async update(
    id: number,
    updateProductVariantDto: UpdateProductVariantDto,
  ): Promise<ProductVariant> {
    const variant = await this.productVariantRepository.preload({
      variant_id: id,
      ...updateProductVariantDto,
    });

    if (!variant) {
      throw new NotFoundException(`Product variant with ID ${id} not found`);
    }

    // Si se actualiza el producto padre
    if (updateProductVariantDto.product_id) {
      const product = await this.productRepository.findOne({
        where: { product_id: updateProductVariantDto.product_id },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${updateProductVariantDto.product_id} not found`,
        );
      }
      variant.product = product;
    }

    return await this.productVariantRepository.save(variant);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productVariantRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product variant with ID ${id} not found`);
    }
  }
}
