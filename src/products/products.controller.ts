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
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { JwtPayload } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Request } from 'express';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity'; // Asegúrate de tener esta clase documentada

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(new RolesGuard(['seller']))
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiBody({
    description: 'Datos necesarios para crear un producto',
    type: CreateProductDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de producto',
        value: {
          gtin: '1234567890123',
          mpn: 'SKU-001',
          brand: 'Nike',
          base_model: 'AirMax',
          seller_id: 9,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente', type: Product })
  @ApiResponse({ status: 403, description: 'Acceso denegado - solo vendedores' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos del vendedor autenticado' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Cantidad de elementos por página', example: 10 })
  @ApiResponse({ status: 200, description: 'Lista paginada de productos', type: [Product] })
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
  @ApiOperation({ summary: 'Obtener un producto por su ID' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto encontrado', type: Product })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

 @Get('reference/by-user')
@UseGuards(new RolesGuard(['buyer']))
@ApiOperation({
  summary: 'Buscar producto por referencia asociada al usuario autenticado',
  description: `
Este endpoint permite a un usuario con el rol **buyer** (comprador) obtener un producto mediante una referencia específica.

📌 **Casos de uso**:
- Un comprador escanea o ingresa manualmente una referencia (código, string único, etc.) vinculada a un producto.
- Se consulta si ese producto está disponible en su cuenta o contexto.

🔒 **Requisitos**:
- El usuario debe estar autenticado y tener el rol 'buyer'.
- Se debe pasar el parámetro \`reference\` en la URL como query string.

📥 **Parámetro esperado**:
- \`reference\`: un string que representa la referencia del producto.

📤 **Respuesta esperada**:
- Un objeto \`Product\` si la referencia es válida y pertenece al contexto del usuario.
- Error 404 si no se encuentra.
  `
})
@ApiQuery({
  name: 'reference',
  description: 'Referencia única del producto (por ejemplo, código escaneado o string generado)',
  required: true,
  example: 'AIRMAX-BLACK-42'
})
@ApiResponse({
  status: 200,
  description: 'Producto encontrado que coincide con la referencia proporcionada.',
  type: Product
})
@ApiResponse({
  status: 403,
  description: 'Acceso denegado: solo los usuarios con el rol buyer pueden usar este endpoint.'
})
@ApiResponse({
  status: 404,
  description: 'No se encontró ningún producto con esa referencia para este usuario.'
})
findByReferenceId(@Query('reference') reference: string) {
  return this.productsService.findByReferenceId(reference);
}

  @Patch(':id')
  @UseGuards(new RolesGuard(['seller']))
  @ApiOperation({ summary: 'Actualizar un producto existente' })
  @ApiParam({ name: 'id', description: 'ID del producto a actualizar' })
  @ApiBody({
    description: 'Campos que se desean actualizar',
    type: UpdateProductDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de actualización',
        value: {
          mpn: 'SKU-002',
          base_model: 'AirMax Pro',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Producto actualizado correctamente', type: Product })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
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
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto a eliminar' })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  remove(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as JwtPayload;
    return this.productsService.remove(+id, user.sub);
  }
}