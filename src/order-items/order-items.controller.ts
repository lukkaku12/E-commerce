import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItemsService } from './order-items.service';

@ApiTags('Order Items')
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear item de orden' })
  @ApiBody({
    description: 'Datos del item de orden',
    schema: {
      example: {
        orderId: 1,
        productId: 24,
        quantity: 3,
        price: 29.99,
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Item creado correctamente' })
  create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemsService.create(createOrderItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los items de orden' })
  @ApiResponse({ status: 200, description: 'Lista de items de orden' })
  findAll() {
    return this.orderItemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un item de orden por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Item de orden' })
  findOne(@Param('id') id: string) {
    return this.orderItemsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un item de orden' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({
    description: 'Campos a actualizar',
    schema: {
      example: {
        quantity: 5,
        price: 27.99,
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Item actualizado' })
  update(
    @Param('id') id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.orderItemsService.update(+id, updateOrderItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un item de orden' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Item eliminado' })
  remove(@Param('id') id: string) {
    return this.orderItemsService.remove(+id);
  }
}