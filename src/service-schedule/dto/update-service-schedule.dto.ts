import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { CreateServiceScheduleDto } from './create-service-schedule.dto';

export class UpdateServiceScheduleDto extends PartialType(
  CreateServiceScheduleDto,
) {
  @ApiPropertyOptional()
  service_id?: number;

  @ApiPropertyOptional()
  start_time?: string;

  @ApiPropertyOptional()
  ending_time?: string;

  @ApiPropertyOptional()
  schedule_date?: Date;
}
