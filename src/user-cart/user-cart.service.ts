import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemIdService } from 'src/cart-item-id/cart-item-id.service';
import { CartItem } from 'src/cart-item-id/entities/cart-item-id.entity';
import { Repository } from 'typeorm';

import { CreateUserCartDto } from './dto/create-user-cart.dto';
import { UpdateUserCartDto } from './dto/update-user-cart.dto';
import { UserCart } from './entities/user-cart.entity';

@Injectable()
export class UserCartService {
  constructor(
    @InjectRepository(UserCart)
    private readonly userCartRepository: Repository<UserCart>,
    @Inject(CartItemIdService)
    private readonly cartItemIdService: CartItemIdService,
  ) {}

  async create(createUserCartDto: CreateUserCartDto): Promise<UserCart> {
    const newCart = this.userCartRepository.create(createUserCartDto);
    return await this.userCartRepository.save(newCart);
  }

  async findAll(userId: number): Promise<UserCart[]> {
    return await this.userCartRepository.find({
      where: {
        user: {user_id: userId}
      }
    });
  }

  async findOne(id: number): Promise<UserCart> {
    const cart = await this.userCartRepository.findOne({
      where: { cart_id: id },
    });
    if (!cart) throw new NotFoundException(`Cart with ID ${id} not found`);
    return cart;
  }

  async update(
    id: number,
    updateUserCartDto: UpdateUserCartDto,
  ): Promise<UserCart> {
    const cart = await this.findOne(id);
    Object.assign(cart, updateUserCartDto);
    return await this.userCartRepository.save(cart);
  }

  async remove(id: number): Promise<void> {
    const cart = await this.findOne(id);
    await this.userCartRepository.remove(cart);
  }

  async getCart(userId: number): Promise<CartItem[]> {
    const userWithCart = await this.userCartRepository.findOne({
      where: { user: { user_id: userId } },
      relations:['user', 'cartItems']
    });
    if (!userWithCart)
      throw new NotFoundException(`User with ID ${userId} not found`);
    const response = await this.cartItemIdService.getCartItemsByCartId(
      userWithCart.cart_id,
    );
    if (!response) throw new NotFoundException();
    return response;
  }

  async clearCart(userId: number) {
    const cart = await this.userCartRepository.findOne({
      where: { user: { user_id: userId } },
    });

    await this.cartItemIdService.removeItemsOfCart(cart.cart_id);

    if (!cart) {
      throw new NotFoundException(
        'No se encontró el carrito para este usuario',
      );
    }

    await this.userCartRepository.remove(cart);
  }
}
