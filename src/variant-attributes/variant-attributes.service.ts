import { Injectable } from '@nestjs/common';

@Injectable()
export class VariantAttributesService {
  create() {
    return 'This action adds a new variantAttribute';
  }

  findAll() {
    return `This action returns all variantAttributes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} variantAttribute`;
  }

  update(id: number) {
    return `This action updates a #${id} variantAttribute`;
  }

  remove(id: number) {
    return `This action removes a #${id} variantAttribute`;
  }
}
