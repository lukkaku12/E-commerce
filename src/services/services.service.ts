import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const newService = this.serviceRepository.create({
      ...createServiceDto,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return await this.serviceRepository.save(newService);
  }

  async findAll(): Promise<Service[]> {
    return await this.serviceRepository.find({
      relations: ['serviceSchedule'],
      order: { service_name: 'ASC' },
    });
  }

  async findBySellerId(sellerId: number): Promise<Service[]> {
  return this.serviceRepository.find({
    where: { seller: { user_id: sellerId } },
    relations: ['seller'],
  });
}

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { service_id: id },
      relations: ['serviceSchedule'],
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
    sellerId: number,
  ): Promise<Service> {
    const serviceOnDatabase = await this.serviceRepository.findOne({
      where: { service_id: id, seller: { user_id: sellerId } },
    });

    if (!serviceOnDatabase) {
      throw new ForbiddenException(
        'No tienes permisos para modificar este servicio',
      );
    }

    const existingService = await this.serviceRepository.preload({
      service_id: id,
      ...updateServiceDto,
      updated_at: new Date(),
    });

    if (!existingService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return await this.serviceRepository.save(existingService);
  }

  async remove(id: number, user_id: number): Promise<void> {
    const serviceFound = await this.serviceRepository.findOne({
      where: { service_id: id, seller: { user_id: user_id } },
      relations: ['seller', 'product_variants'],
    });

    if (!serviceFound) {
      throw new NotFoundException(`Product not found with ID ${id}`);
    }

    const result = await this.serviceRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
  }
}
