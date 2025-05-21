import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { Request } from 'express';

import { CartItemIdService } from './cart-item-id.service';
import { CreateCartItemIdDto } from './dto/create-cart-item-id.dto';
import { UpdateCartItemIdDto } from './dto/update-cart-item-id.dto';
import { JwtPayload } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Cart Item ID')
@Controller('cart-item-id')
@UseGuards(JwtAuthGuard)
export class CartItemIdController {
  constructor(private readonly cartItemIdService: CartItemIdService) {}

  @Post()
  @ApiOperation({ summary: 'Crear item de carrito' })
  @ApiBody({
    description: 'Datos del item del carrito',
    schema: {
      example: {
        productId: 123,
        quantity: 2,
        userId: 45,
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Item creado correctamente' })
  create(@Body() createCartItemIdDto: CreateCartItemIdDto, @Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.cartItemIdService.create(createCartItemIdDto, user.sub);
  }

  @Get()
  @UseGuards(new RolesGuard(['buyer']))
  @ApiOperation({ summary: 'Obtener todos los items del carrito' })
  @ApiResponse({ status: 200, description: 'Lista de items' })
  findAll(
    @Req() req: Request,
  ) {
    const user = req.user as JwtPayload;
    return this.cartItemIdService.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un item por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Item del carrito' })
  findOne(@Param('id') id: string) {
    return this.cartItemIdService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un item del carrito' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({
    description: 'Campos a actualizar',
    schema: {
      example: {
        quantity: 3,
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Item actualizado' })
  update(
    @Param('id') id: string,
    @Body() updateCartItemIdDto: UpdateCartItemIdDto,
  ) {
    return this.cartItemIdService.update(+id, updateCartItemIdDto);
  }
}