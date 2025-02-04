import { Test, TestingModule } from '@nestjs/testing';
import { AttributeDefinitionController } from './attribute-definition.controller';
import { AttributeDefinitionService } from './attribute-definition.service';

describe('AttributeDefinitionController', () => {
  let controller: AttributeDefinitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttributeDefinitionController],
      providers: [AttributeDefinitionService],
    }).compile();

    controller = module.get<AttributeDefinitionController>(AttributeDefinitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
