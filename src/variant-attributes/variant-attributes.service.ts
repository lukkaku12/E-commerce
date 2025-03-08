import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VariantAttribute } from './entities/variant-attribute.entity';
import { _CreateVariantAttributeDto } from './dto/create-variant-attribute.dto';
import { _UpdateVariantAttributeDto } from './dto/update-variant-attribute.dto';

@Injectable()
export class VariantAttributesService {
  constructor(
    @InjectRepository(VariantAttribute)
    private readonly variantAttributesRepository: Repository<VariantAttribute>,
  ) {}

  async create(createVariantAttributeDto: _CreateVariantAttributeDto): Promise<VariantAttribute> {
    const newVariantAttribute = this.variantAttributesRepository.create(createVariantAttributeDto);
    return await this.variantAttributesRepository.save(newVariantAttribute);
  }

  async findAll(): Promise<VariantAttribute[]> {
    return await this.variantAttributesRepository.find();
  }

  async findOne(id: number): Promise<VariantAttribute> {
    const variantAttribute = await this.variantAttributesRepository.findOne({ where: { variantId: id } });
    if (!variantAttribute) {
      throw new NotFoundException(`VariantAttribute with ID ${id} not found`);
    }
    return variantAttribute;
  }

  async update(id: number, updateVariantAttributeDto: _UpdateVariantAttributeDto): Promise<VariantAttribute> {
    const variantAttribute = await this.findOne(id);
    Object.assign(variantAttribute, updateVariantAttributeDto);
    return await this.variantAttributesRepository.save(variantAttribute);
  }

  async remove(id: number): Promise<void> {
    const variantAttribute = await this.findOne(id);
    await this.variantAttributesRepository.remove(variantAttribute);
  }
}