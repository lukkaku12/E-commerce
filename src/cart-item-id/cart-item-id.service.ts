import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCartItemIdDto } from './dto/create-cart-item-id.dto';
import { UpdateCartItemIdDto } from './dto/update-cart-item-id.dto';
import { CartItem } from './entities/cart-item-id.entity';

@Injectable()
export class CartItemIdService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async create(createCartItemIdDto: CreateCartItemIdDto): Promise<CartItem> {
    const newCartItem = this.cartItemRepository.create(createCartItemIdDto);
    return await this.cartItemRepository.save(newCartItem);
  }

  async findAll(): Promise<CartItem[]> {
    return await this.cartItemRepository.find();
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
