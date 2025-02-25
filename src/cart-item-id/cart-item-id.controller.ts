import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartItemIdService } from './cart-item-id.service';
import { CreateCartItemIdDto } from './dto/create-cart-item-id.dto';
import { UpdateCartItemIdDto } from './dto/update-cart-item-id.dto';

@Controller('cart-item-id')
export class CartItemIdController {
  constructor(private readonly cartItemIdService: CartItemIdService) {}

  @Post()
  create(@Body() createCartItemIdDto: CreateCartItemIdDto) {
    return this.cartItemIdService.create(createCartItemIdDto);
  }

  @Get()
  findAll() {
    return this.cartItemIdService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartItemIdService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartItemIdDto: UpdateCartItemIdDto) {
    return this.cartItemIdService.update(+id, updateCartItemIdDto);
  }

}
