import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class CreateServiceScheduleDto {
  @ApiProperty({ example: 1, description: 'ID del servicio relacionado' })
  @IsInt()
  @IsNotEmpty()
  service_id: number;

  @ApiProperty({
    example: '08:00',
    description: 'Hora de inicio en formato HH:mm',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Formato de hora inválido',
  })
  start_time: string;

  @ApiProperty({
    example: '09:00',
    description: 'Hora de fin en formato HH:mm',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Formato de hora inválido',
  })
  ending_time: string;

  @ApiProperty({
    example: '2024-09-08',
    description: 'Fecha en formato YYYY-MM-DD',
  })
  @IsDateString()
  schedule_date: Date;
}
