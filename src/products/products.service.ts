import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // 1. Validar que el seller exista
    const seller = await this.usersService.validateUserExists(
      createProductDto.seller_id,
    );

    if (!seller) {
      throw new NotFoundException(
        `Seller with ID ${createProductDto.seller_id} not found`,
      );
    }

    // 2. Crear el producto si la validación pasa
    const product = this.productRepository.create({
      ...createProductDto,
      seller: { user_id: createProductDto.seller_id },
    });

    return await this.productRepository.save(product);
  }

  async findAll(id: number, limit: number, offset: number): Promise<Product[]> {
    return await this.productRepository.find({
      where: { seller: { user_id: id } },
      relations: ['seller', 'product_variants'],
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: number): Promise<Product> {
    const productsCached = await this.cacheManager.get<Product>(String(id));
    if (productsCached) {
      return productsCached;
    }
    const product = await this.productRepository.findOne({
      where: { product_id: id },
      relations: ['seller', 'product_variants'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    this.cacheManager.set(String(id), product);

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.preload({
      product_id: id,
      ...updateProductDto,
      ...(updateProductDto.seller_id && {
        seller: { user_id: updateProductDto.seller_id },
      }),
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
