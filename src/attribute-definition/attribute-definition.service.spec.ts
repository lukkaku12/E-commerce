import { Test, TestingModule } from '@nestjs/testing';

import { AttributeDefinitionService } from './attribute-definition.service';

describe('AttributeDefinitionService', () => {
  let service: AttributeDefinitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttributeDefinitionService],
    }).compile();

    service = module.get<AttributeDefinitionService>(
      AttributeDefinitionService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
