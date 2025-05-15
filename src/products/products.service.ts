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

  async findPublic(limit: number, offset: number): Promise<Product[]> {
  return this.productRepository.find({
    skip: offset,
    take: limit,
    relations: ['seller', 'product_variants'], // si quieres mostrar relaciones
    order: { created_at: 'DESC' },
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
    user_id: number,
  ): Promise<Product> {
    const productFound = await this.productRepository.findOne({
      where: {
        product_id: id, // Buscar por product_id
        seller: { user_id: user_id }, // Verificar que pertenezca al usuario
      },
      relations: ['seller', 'product_variants'], // Cargar relaciones
    });

    if (!productFound) {
      throw new NotFoundException(`Product not found with ID ${id}`);
    }

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

  async remove(id: number, user_id: number): Promise<void> {
    const productFound = await this.productRepository.findOne({
      where: { product_id: id, seller: { user_id: user_id } },
      relations: ['seller', 'product_variants'],
    });

    if (!productFound) {
      throw new NotFoundException(`Product not found with ID ${id}`);
    }

    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async findByReferenceId(
    referenceName: string,
  ): Promise<Product[] | { message: string }> {
    // Verifica que referenceName no esté vacío
    if (!referenceName || referenceName.trim() === '') {
      throw new Error('El término de búsqueda no puede estar vacío.');
    }

    try {
      const products = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.variants', 'variant')
        .leftJoinAndSelect('product.seller', 'seller')
        .where('LOWER(product.gtin) LIKE LOWER(:searchTerm)', {
          searchTerm: `%${referenceName}%`,
        })
        .orWhere('LOWER(product.mpn) LIKE LOWER(:searchTerm)', {
          searchTerm: `%${referenceName}%`,
        })
        .orWhere('LOWER(product.brand) LIKE LOWER(:searchTerm)', {
          searchTerm: `%${referenceName}%`,
        })
        .orWhere('LOWER(product.base_model) LIKE LOWER(:searchTerm)', {
          searchTerm: `%${referenceName}%`,
        })
        .select([
          'product.id',
          'product.brand',
          'product.base_model',
          'variant.price',
          'variant.stock',
          'seller.id',
          'seller.name',
        ])
        .getMany();

      // Verifica si no se encontraron productos
      if (products.length === 0) {
        return {
          message:
            'No se encontraron productos con la referencia proporcionada.',
        };
      }

      return products;
    } catch (error) {
      // Manejo de errores
      console.error('Error al buscar productos:', error);
      throw new Error('Ocurrió un error al buscar productos.');
    }
  }
}
