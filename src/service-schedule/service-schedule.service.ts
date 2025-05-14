import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { ServicesService } from 'src/services/services.service';
import { Repository } from 'typeorm';

import { CreateServiceScheduleDto } from './dto/create-service-schedule.dto';
import { UpdateServiceScheduleDto } from './dto/update-service-schedule.dto';
import { ServiceSchedule } from './entities/service-schedule.entity';

@Injectable()
export class ServiceScheduleService {
  constructor(
    @InjectRepository(ServiceSchedule)
    private readonly scheduleRepository: Repository<ServiceSchedule>,
    private readonly serviceService: ServicesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(
    createServiceScheduleDto: CreateServiceScheduleDto,
  ): Promise<ServiceSchedule> {
    // Validar que el servicio existe
    const service = await this.serviceService.findOne(
      createServiceScheduleDto.service_id,
    );

    if (!service) {
      throw new NotFoundException(
        `Service with ID ${createServiceScheduleDto.service_id} not found`,
      );
    }

    // Crear nuevo horario
    const newSchedule = this.scheduleRepository.create({
      ...createServiceScheduleDto,
      service: service,
    });

    // Validar que la hora de fin sea mayor a la de inicio
    if (newSchedule.start_time >= newSchedule.ending_time) {
      throw new BadRequestException('Ending time must be after start time');
    }

    return await this.scheduleRepository.save(newSchedule);
  }

  async createMany(dtos: CreateServiceScheduleDto[]): Promise<ServiceSchedule[]> {
  const schedules: ServiceSchedule[] = [];

  for (const dto of dtos) {
    const service = await this.serviceService.findOne(dto.service_id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${dto.service_id} not found`);
    }

    if (dto.start_time >= dto.ending_time) {
      throw new BadRequestException('Ending time must be after start time');
    }

    const schedule = this.scheduleRepository.create({
      ...dto,
      service,
    });

    schedules.push(schedule);
  }

  return await this.scheduleRepository.save(schedules);
}

  async findAll(): Promise<ServiceSchedule[]> {
    const ServiceSchedulesCached = await this.cacheManager.get<
      ServiceSchedule[]
    >('ServiceSchedule');
    if (ServiceSchedulesCached) {
      return ServiceSchedulesCached;
    }

    const result = await this.scheduleRepository.find({
      relations: ['service'],
      order: { schedule_date: 'ASC', start_time: 'ASC' },
    });
    this.cacheManager.set('ServiceSchedule', result); // Cachear los resultados por 1 hora

    return result;
  }

  async findOne(id: number): Promise<ServiceSchedule> {
    const ServiceScheduleCached = await this.cacheManager.get<ServiceSchedule>(
      String(id),
    );
    if (ServiceScheduleCached) {
      return ServiceScheduleCached;
    }

    const schedule = await this.scheduleRepository.findOne({
      where: { schedule_id: id },
      // relations: ['service'], not needed
    });

    if (!schedule) {
      throw new NotFoundException(`Service schedule with ID ${id} not found`);
    }
    this.cacheManager.set(String(id), schedule);

    return schedule;
  }

  async update(
    id: number,
    updateServiceScheduleDto: UpdateServiceScheduleDto,
  ): Promise<ServiceSchedule> {
    const existingSchedule = await this.scheduleRepository.preload({
      schedule_id: id,
      ...updateServiceScheduleDto,
    });

    if (!existingSchedule) {
      throw new NotFoundException(`Service schedule with ID ${id} not found`);
    }

    // Validar servicio si se actualiza
    if (updateServiceScheduleDto.service_id) {
      const service = await this.serviceService.findOne(
        updateServiceScheduleDto.service_id,
      );

      if (!service) {
        throw new NotFoundException(
          `Service with ID ${updateServiceScheduleDto.service_id} not found`,
        );
      }
      existingSchedule.service = service;
    }

    // Validar horas si se actualizan
    if (
      updateServiceScheduleDto.start_time ||
      updateServiceScheduleDto.ending_time
    ) {
      const start =
        updateServiceScheduleDto.start_time || existingSchedule.start_time;
      const end =
        updateServiceScheduleDto.ending_time || existingSchedule.ending_time;

      if (start >= end) {
        throw new BadRequestException('Ending time must be after start time');
      }
    }

    return await this.scheduleRepository.save(existingSchedule);
  }

  async remove(id: number): Promise<void> {
    const result = await this.scheduleRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Service schedule with ID ${id} not found`);
    }
  }

  async save(serviceSchedule: ServiceSchedule) {
    return await this.scheduleRepository.save(serviceSchedule);
  }
}
