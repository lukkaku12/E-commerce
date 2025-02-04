import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AttributeDefinitionController } from './attribute-definition.controller';
import { AttributeDefinitionService } from './attribute-definition.service';
import { AttributeDefinition } from './entities/attribute-definition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttributeDefinition])],
  controllers: [AttributeDefinitionController],
  providers: [AttributeDefinitionService],
})
export class AttributeDefinitionModule {}
