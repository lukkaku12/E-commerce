import { Injectable } from '@nestjs/common';

@Injectable()
export class AttributeDefinitionService {
  create() {
    return 'This action adds a new attributeDefinition';
  }

  findAll() {
    return `This action returns all attributeDefinition`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attributeDefinition`;
  }

  update(id: number) {
    return `This action updates a #${id} attributeDefinition`;
  }

  remove(id: number) {
    return `This action removes a #${id} attributeDefinition`;
  }
}
