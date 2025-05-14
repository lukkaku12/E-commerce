// create-service.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    example: 'Servicio de Mantenimiento',
    description: 'Nombre del servicio',
  })
  @IsString()
  @IsNotEmpty()
  service_name: string;

  @ApiProperty({
    example: 'Mantenimiento preventivo de equipos',
    description: 'Descripción del servicio',
  })
  @IsString()
  @IsNotEmpty()
  service_description: string;

  @ApiProperty({ example: 150.99, description: 'Precio del servicio' })
  @IsNumber()
  @IsNotEmpty()
  service_price: number;

  @ApiProperty({ example: 15, description: 'Id del vendedor' })
  @IsNumber()
  @IsNotEmpty()
  seller_id?: number;
}
