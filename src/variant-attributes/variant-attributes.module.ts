import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VariantAttribute } from './entities/variant-attribute.entity';
import { VariantAttributesController } from './variant-attributes.controller';
import { VariantAttributesService } from './variant-attributes.service';

@Module({
  imports: [TypeOrmModule.forFeature([VariantAttribute])],
  controllers: [VariantAttributesController],
  providers: [VariantAttributesService],
})
export class VariantAttributesModule {}
