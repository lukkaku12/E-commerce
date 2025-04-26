import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

import { CreateProductVariantDto } from './dto/create-product_variant.dto';
import { UpdateProductVariantDto } from './dto/update-product_variant.dto';
import { ProductVariantsService } from './product-variants.service';

@ApiTags('Product Variants')
@Controller('product-variants')
export class ProductVariantsController {
  constructor(private readonly variantsService: ProductVariantsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una variante de producto' })
  @ApiResponse({ status: 201, description: 'Variante creada con éxito' })
  @ApiBody({
    description: 'Datos para crear una variante de producto',
    type: CreateProductVariantDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de variante',
        value: {
          name: 'Talla M',
          price: 29.99,
          stock: 100,
          productId: 1,
        },
      },
    },
  })
  create(@Body() createDto: CreateProductVariantDto) {
    return this.variantsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las variantes de productos' })
  findAll() {
    return this.variantsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una variante específica por ID' })
  findOne(@Param('id') id: string) {
    return this.variantsService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una variante existente' })
  @ApiBody({
    description: 'Datos para actualizar una variante',
    type: UpdateProductVariantDto,
    examples: {
      ejemplo: {
        summary: 'Actualizar variante',
        value: {
          name: 'Talla L',
          price: 32.99,
          stock: 75,
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateDto: UpdateProductVariantDto) {
    return this.variantsService.update(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una variante de producto por ID' })
  remove(@Param('id') id: string) {
    return this.variantsService.remove(+id);
  }
}