import { Injectable } from '@nestjs/common';

import { CreateAttributeDefinitionDto } from './dto/create-attribute-definition.dto';
import { UpdateAttributeDefinitionDto } from './dto/update-attribute-definition.dto';

@Injectable()
export class AttributeDefinitionService {
  create(createAttributeDefinitionDto: CreateAttributeDefinitionDto) {
    return 'This action adds a new attributeDefinition';
  }

  findAll() {
    return `This action returns all attributeDefinition`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attributeDefinition`;
  }

  update(
    id: number,
    updateAttributeDefinitionDto: UpdateAttributeDefinitionDto,
  ) {
    return `This action updates a #${id} attributeDefinition`;
  }

  remove(id: number) {
    return `This action removes a #${id} attributeDefinition`;
  }
}
