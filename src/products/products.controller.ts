import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'auth/guards/jwt/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'; // Importación de los decoradores de Swagger

@ApiTags('Products') // Categoriza el controlador en la documentación Swagger
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(new RolesGuard(['seller']))
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' }) // Descripción de la operación
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente.' }) // Respuesta cuando el producto es creado
  @ApiResponse({ status: 403, description: 'Acceso denegado' }) // Respuesta cuando el acceso es denegado (por falta de rol)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' }) // Descripción de la operación
  @ApiResponse({ status: 200, description: 'Lista de productos' }) // Respuesta cuando se obtienen los productos
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por su ID' }) // Descripción de la operación
  @ApiParam({ name: 'id', description: 'ID del producto' }) // Descripción del parámetro de ID
  @ApiResponse({ status: 200, description: 'Producto encontrado' }) // Respuesta cuando se encuentra el producto
  @ApiResponse({ status: 404, description: 'Producto no encontrado' }) // Respuesta cuando no se encuentra el producto
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto' }) // Descripción de la operación
  @ApiParam({ name: 'id', description: 'ID del producto a actualizar' }) // Descripción del parámetro de ID
  @ApiResponse({ status: 200, description: 'Producto actualizado' }) // Respuesta cuando se actualiza el producto
  @ApiResponse({ status: 404, description: 'Producto no encontrado' }) // Respuesta cuando no se encuentra el producto a actualizar
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto' }) // Descripción de la operación
  @ApiParam({ name: 'id', description: 'ID del producto a eliminar' }) // Descripción del parámetro de ID
  @ApiResponse({ status: 200, description: 'Producto eliminado' }) // Respuesta cuando se elimina el producto
  @ApiResponse({ status: 404, description: 'Producto no encontrado' }) // Respuesta cuando no se encuentra el producto a eliminar
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}