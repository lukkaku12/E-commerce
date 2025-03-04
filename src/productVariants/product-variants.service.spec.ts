import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductVariantsService } from './product-variants.service';
import { ProductVariant } from './entities/product-variant.entity';
import { Product } from '../products/entities/product.entity';
import { VariantAttribute } from 'src/variant-attributes/entities/variant-attribute.entity';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { CartItem } from 'src/cart-item-id/entities/cart-item-id.entity';
import { User, UserRole } from 'src/users/entities/user.entity';

const mockProductVariantRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
};

const mockProductRepository = {
  findOne: jest.fn(),
};

describe('Servicio de Variantes de Producto', () => {
  let service: ProductVariantsService;
  let productVariantRepository: Repository<ProductVariant>;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductVariantsService,
        {
          provide: getRepositoryToken(ProductVariant),
          useValue: mockProductVariantRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductVariantsService>(ProductVariantsService);
    productVariantRepository = module.get<Repository<ProductVariant>>(getRepositoryToken(ProductVariant));
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('crear', () => {
    it('debería crear una variante de producto', async () => {
        const usuario: User = {
            user_id: 1,
            name: 'Vendedor de prueba',
            email: 'vendedor@example.com',
            password: 'hashedpassword',
            role: UserRole.SELLER,
            created_at: new Date(),
            updated_at: new Date(),
            service: [],
            products: [],
            transactions: [],
            orders: [],
            carts: [],
          };
          
          const producto: Product = {
            product_id: 1,
            gtin: '1234567890123',
            mpn: 'MPN-001',
            brand: 'Marca X',
            base_model: 'Modelo A',
            seller: usuario, // Se usa el usuario mockeado
            product_variants: [],
            created_at: new Date(),
            updated_at: new Date(),
            updateTimestamp: jest.fn(),
          };

      const dto = {
        product_id: producto.product_id,
        price: 19999.99,
        stock: 50,
        sku: 'VAR-12345',
      };

      const variant = {
        variant_id: 1,
        product: producto,
        price: dto.price,
        stock: dto.stock,
        sku: dto.sku,
        created_at: new Date(),
        updated_at: new Date(),
        variantAttributes: [],
        orderItems: [],
        cartItems: [],
      } as ProductVariant;

      mockProductRepository.findOne.mockResolvedValue(producto);
      mockProductVariantRepository.create.mockReturnValue(variant);
      mockProductVariantRepository.save.mockResolvedValue(variant);

      const result = await service.create(dto);
      expect(result).toEqual(variant);
    });

    it('debería lanzar NotFoundException si el producto no existe', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(service.create({
        product_id: 1,
        price: 19999.99,
        stock: 50,
        sku: 'VAR-12345',
      })).rejects.toThrow(NotFoundException);
    });
  });

  describe('buscar todas', () => {
    it('debería devolver un array de variantes de producto', async () => {
      const variants = [{
        variant_id: 1,
        price: 19999.99,
        stock: 50,
        sku: 'VAR-12345',
        created_at: new Date(),
        updated_at: new Date(),
        variantAttributes: [],
        orderItems: [],
        cartItems: [],
      }] as ProductVariant[];

      mockProductVariantRepository.find.mockResolvedValue(variants);

      const result = await service.findAll();
      expect(result).toEqual(variants);
    });
  });

  describe('buscar una', () => {
    it('debería devolver una variante de producto', async () => {
      const variant = {
        variant_id: 1,
        price: 19999.99,
        stock: 50,
        sku: 'VAR-12345',
        created_at: new Date(),
        updated_at: new Date(),
        variantAttributes: [],
        orderItems: [],
        cartItems: [],
      } as ProductVariant;

      mockProductVariantRepository.findOne.mockResolvedValue(variant);

      const result = await service.findOne(1);
      expect(result).toEqual(variant);
    });

    it('debería lanzar NotFoundException si la variante no existe', async () => {
      mockProductVariantRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('actualizar', () => {
    it('debería actualizar una variante de producto', async () => {
      const dto = { price: 15999.99 };
      const variant = {
        variant_id: 1,
        price: 19999.99,
        stock: 50,
        sku: 'VAR-12345',
        created_at: new Date(),
        updated_at: new Date(),
        variantAttributes: [],
        orderItems: [],
        cartItems: [],
      } as ProductVariant;

      mockProductVariantRepository.preload.mockResolvedValue({ ...variant, ...dto });
      mockProductVariantRepository.save.mockResolvedValue({ ...variant, ...dto });

      const result = await service.update(1, dto);
      expect(result).toEqual({ ...variant, ...dto });
    });

    it('debería lanzar NotFoundException si la variante no existe', async () => {
      mockProductVariantRepository.preload.mockResolvedValue(null);
      await expect(service.update(1, { price: 15999.99 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('eliminar', () => {
    it('debería eliminar una variante de producto', async () => {
      mockProductVariantRepository.delete.mockResolvedValue({ affected: 1 });
      await expect(service.remove(1)).resolves.not.toThrow();
    });

    it('debería lanzar NotFoundException si la variante no existe', async () => {
      mockProductVariantRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('actualizar stock', () => {
    it('debería actualizar el stock de una variante de producto', async () => {
      mockProductVariantRepository.update.mockResolvedValue({ affected: 1 });

      await expect(service.updateStock(1, 5)).resolves.not.toThrow();
      expect(mockProductVariantRepository.update).toHaveBeenCalledWith(1, {
        stock: expect.any(Function),
      });
    });

    it('debería lanzar error si la actualización del stock falla', async () => {
      mockProductVariantRepository.update.mockResolvedValue({ affected: 0 });

      await expect(service.updateStock(1, 5)).rejects.toThrow(NotFoundException);
    });
  });
});