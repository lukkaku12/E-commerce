import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { CreateServiceDto } from './create-service.dto';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @ApiPropertyOptional()
  service_name?: string;

  @ApiPropertyOptional()
  service_description?: string;

  @ApiPropertyOptional()
  service_price?: number;
}
