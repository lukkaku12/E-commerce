import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'; // Importación de los decoradores de Swagger
import { JwtPayload } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Request } from 'express';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products') // Categoriza el controlador en la documentación Swagger
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(new RolesGuard(['seller']))
  @ApiOperation({ summary: 'Crear un nuevo producto' }) // Descripción de la operación
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente.' }) // Respuesta cuando el producto es creado
  @ApiResponse({ status: 403, description: 'Acceso denegado' }) // Respuesta cuando el acceso es denegado (por falta de rol)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos' })
  findAll(
    @Req() req: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const user = req.user as JwtPayload;
    const offset = (page - 1) * limit;
    return this.productsService.findAll(user.sub, limit, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por su ID' }) // Descripción de la operación
  @ApiParam({ name: 'id', description: 'ID del producto' }) // Descripción del parámetro de ID
  @ApiResponse({ status: 200, description: 'Producto encontrado' }) // Respuesta cuando se encuentra el producto
  @ApiResponse({ status: 404, description: 'Producto no encontrado' }) // Respuesta cuando no se encuentra el producto
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Get()
  @UseGuards(new RolesGuard(['buyer']))
  @ApiOperation({ summary: 'Obtener producto con cierta referencia (user)' }) // Descripción de la operación
  @ApiResponse({ status: 200, description: 'producto por referencia' })
  findByReferenceId(@Query() reference: string) {
    return this.productsService.findByReferenceId(reference);
  }

  @Patch(':id')
  @UseGuards(new RolesGuard(['seller']))
  @ApiOperation({ summary: 'Actualizar un producto' }) // Descripción de la operación
  @ApiParam({ name: 'id', description: 'ID del producto a actualizar' }) // Descripción del parámetro de ID
  @ApiResponse({ status: 200, description: 'Producto actualizado' }) // Respuesta cuando se actualiza el producto
  @ApiResponse({ status: 404, description: 'Producto no encontrado' }) // Respuesta cuando no se encuentra el producto a actualizar
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const user = req.user as JwtPayload;
    return this.productsService.update(+id, updateProductDto, user.sub);
  }

  @Delete(':id')
  @UseGuards(new RolesGuard(['seller']))
  @ApiOperation({ summary: 'Eliminar un producto' }) // Descripción de la operación
  @ApiParam({ name: 'id', description: 'ID del producto a eliminar' }) // Descripción del parámetro de ID
  @ApiResponse({ status: 200, description: 'Producto eliminado' }) // Respuesta cuando se elimina el producto
  @ApiResponse({ status: 404, description: 'Producto no encontrado' }) // Respuesta cuando no se encuentra el producto a eliminar
  remove(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as JwtPayload;
    return this.productsService.remove(+id, user.sub);
  }
}
