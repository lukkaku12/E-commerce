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
  getSchemaPath,
} from '@nestjs/swagger';

import { CreateProductVariantDto } from './dto/create-product_variant.dto';
import { UpdateProductVariantDto } from './dto/update-product_variant.dto';
import { ProductVariantsService } from './product-variants.service';
import { ProductVariant } from './entities/product-variant.entity';

@ApiTags('Product Variants')
@Controller('product-variants')
export class ProductVariantsController {
  constructor(private readonly variantsService: ProductVariantsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una o más variantes de producto' })
  @ApiBody({
    description: 'Una o más variantes para asociar a un producto',
    schema: {
      oneOf: [
        { $ref: getSchemaPath(CreateProductVariantDto) },
        {
          type: 'array',
          items: { $ref: getSchemaPath(CreateProductVariantDto) },
        },
      ],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Variante(s) creada(s) exitosamente',
    type: ProductVariant,
    isArray: true,
  })
  async create(@Body() body: CreateProductVariantDto | CreateProductVariantDto[]) {
    if (Array.isArray(body)) {
      return this.variantsService.createMany(body);
    } else {
      return this.variantsService.create(body);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las variantes de productos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de variantes de productos',
    type: ProductVariant,
    isArray: true,
  })
  findAll() {
    return this.variantsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una variante específica por ID' })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la variante de producto',
    type: ProductVariant,
  })
  @ApiResponse({
    status: 404,
    description: 'Variante no encontrada',
  })
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
  @ApiResponse({
    status: 200,
    description: 'Variante actualizada correctamente',
    type: ProductVariant,
  })
  @ApiResponse({
    status: 404,
    description: 'Variante no encontrada',
  })
  update(@Param('id') id: string, @Body() updateDto: UpdateProductVariantDto) {
    return this.variantsService.update(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una variante de producto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Variante eliminada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Variante no encontrada',
  })
  remove(@Param('id') id: string) {
    return this.variantsService.remove(+id);
  }
}