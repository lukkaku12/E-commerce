import { PartialType } from '@nestjs/mapped-types';
import { CreateVariantAttributeDto } from './create-variant-attribute.dto';

export class UpdateVariantAttributeDto extends PartialType(CreateVariantAttributeDto) {}
