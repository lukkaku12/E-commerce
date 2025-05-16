import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCartItemIdDto } from './dto/create-cart-item-id.dto';
import { UpdateCartItemIdDto } from './dto/update-cart-item-id.dto';
import { CartItem } from './entities/cart-item-id.entity';
import { ProductVariant } from 'src/productVariants/entities/product-variant.entity';
import { UserCart } from 'src/user-cart/entities/user-cart.entity';

@Injectable()
export class CartItemIdService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
     @InjectRepository(UserCart)
    private readonly userCartRepository: Repository<UserCart>,
  ) {}

  async create(createCartItemIdDto: CreateCartItemIdDto): Promise<CartItem> {
  const { productId, userCartId, quantity } = createCartItemIdDto;

  // Buscar el ProductVariant por ID
  const productVariant = await this.productVariantRepository.findOne({
    where: { product: {product_id: productId }},
  });

  if (!productVariant) {
    throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
  }

  // Buscar el UserCart por ID
  const userCart = await this.userCartRepository.findOne({
    where: { cart_id: userCartId },
  });

  if (!userCart) {
    throw new NotFoundException(`Carrito con ID ${userCartId} no encontrado`);
  }

  const cartItem = this.cartItemRepository.create({
    quantity,
    productVariant,
    cart: userCart,
  });

  return await this.cartItemRepository.save(cartItem);
}

  async findAll(user_id: number): Promise<CartItem[]> {
    return await this.cartItemRepository.find({
      
      where: { cart: { user: {user_id: user_id} } },
      relations: ['cart'],
    
    });
  }

  async findOne(id: number): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { cart_item_id: id },
    });
    if (!cartItem)
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    return cartItem;
  }

  async update(
    id: number,
    updateCartItemIdDto: UpdateCartItemIdDto,
  ): Promise<CartItem> {
    const cartItem = await this.findOne(id);
    Object.assign(cartItem, updateCartItemIdDto);
    return await this.cartItemRepository.save(cartItem);
  }

  async removeItemsOfCart(cartId: number): Promise<void> {
    await this.cartItemRepository.delete({ cart: { cart_id: cartId } });
  }

  async getCartItemsByCartId(cartId: number): Promise<CartItem[]> {
    return await this.cartItemRepository.find({
      where: { cart: { cart_id: cartId } },
    });
  }
}
