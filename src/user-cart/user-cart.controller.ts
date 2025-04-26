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
  ApiBody,
} from '@nestjs/swagger';

import { CreateUserCartDto } from './dto/create-user-cart.dto';
import { UpdateUserCartDto } from './dto/update-user-cart.dto';
import { UserCartService } from './user-cart.service';

@ApiTags('UserCart')
@Controller('user-cart')
export class UserCartController {
  constructor(private readonly userCartService: UserCartService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo carrito para un usuario' })
  @ApiResponse({ status: 201, description: 'Carrito creado exitosamente' })
  @ApiBody({
    type: CreateUserCartDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de creación de carrito',
        value: {
          userId: 42,
        },
      },
    },
  })
  create(@Body() createUserCartDto: CreateUserCartDto) {
    return this.userCartService.create(createUserCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los carritos de usuario' })
  findAll() {
    return this.userCartService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un carrito específico por ID' })
  findOne(@Param('id') id: string) {
    return this.userCartService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un carrito de usuario' })
  @ApiBody({
    type: UpdateUserCartDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de actualización de carrito',
        value: {
          userId: 42,
        },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateUserCartDto: UpdateUserCartDto,
  ) {
    return this.userCartService.update(+id, updateUserCartDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un carrito de usuario' })
  remove(@Param('id') id: string) {
    return this.userCartService.remove(+id);
  }
}