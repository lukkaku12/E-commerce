import { Test, TestingModule } from '@nestjs/testing';

import { VariantAttributesService } from './variant-attributes.service';

describe('VariantAttributesService', () => {
  let service: VariantAttributesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VariantAttributesService],
    }).compile();

    service = module.get<VariantAttributesService>(VariantAttributesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
