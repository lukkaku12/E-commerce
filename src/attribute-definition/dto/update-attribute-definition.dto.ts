import { PartialType } from '@nestjs/mapped-types';

import { _CreateAttributeDefinitionDto } from './create-attribute-definition.dto';

export class _UpdateAttributeDefinitionDto extends PartialType(
  _CreateAttributeDefinitionDto,
) {}
