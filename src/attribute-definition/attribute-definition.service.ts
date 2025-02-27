import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { _CreateAttributeDefinitionDto } from './dto/create-attribute-definition.dto';
import { _UpdateAttributeDefinitionDto } from './dto/update-attribute-definition.dto';
import { AttributeDefinition } from './entities/attribute-definition.entity';

@Injectable()
export class AttributeDefinitionService {
  constructor(
    @InjectRepository(AttributeDefinition)
    private readonly attributeDefinitionRepository: Repository<AttributeDefinition>,
  ) {}

  // ✅ Crear un nuevo atributo
  async create(
    createDto: _CreateAttributeDefinitionDto,
  ): Promise<AttributeDefinition> {
    const attribute = this.attributeDefinitionRepository.create(createDto);
    return await this.attributeDefinitionRepository.save(attribute);
  }

  // ✅ Obtener todos los atributos
  async findAll(): Promise<AttributeDefinition[]> {
    return await this.attributeDefinitionRepository.find();
  }

  // ✅ Obtener un solo atributo por ID
  async findOne(id: number): Promise<AttributeDefinition> {
    const attribute = await this.attributeDefinitionRepository.findOne({
      where: { attributeId: id },
    });
    if (!attribute) {
      throw new NotFoundException(
        `El atributo con ID ${id} no fue encontrado.`,
      );
    }
    return attribute;
  }

  // ✅ Actualizar un atributo por ID
  async update(
    id: number,
    updateDto: _UpdateAttributeDefinitionDto,
  ): Promise<AttributeDefinition> {
    const attribute = await this.findOne(id);
    Object.assign(attribute, updateDto);
    return await this.attributeDefinitionRepository.save(attribute);
  }

  // ✅ Eliminar un atributo por ID
  async remove(id: number): Promise<void> {
    const result = await this.attributeDefinitionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `El atributo con ID ${id} no fue encontrado.`,
      );
    }
  }
}
