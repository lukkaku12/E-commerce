import { Module } from '@nestjs/common';
import { VariantAttributesService } from './variant-attributes.service';
import { VariantAttributesController } from './variant-attributes.controller';
import { VariantAttribute } from './entities/variant-attribute.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([VariantAttribute])],
  controllers: [VariantAttributesController],
  providers: [VariantAttributesService],
})
export class VariantAttributesModule {}
