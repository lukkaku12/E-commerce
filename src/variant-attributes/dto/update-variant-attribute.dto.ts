import { PartialType } from '@nestjs/mapped-types';

import { _CreateVariantAttributeDto } from './create-variant-attribute.dto';

export class _UpdateVariantAttributeDto extends PartialType(
  _CreateVariantAttributeDto,
) {}
