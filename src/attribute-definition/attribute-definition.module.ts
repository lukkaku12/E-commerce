import { Module } from '@nestjs/common';
import { AttributeDefinitionService } from './attribute-definition.service';
import { AttributeDefinitionController } from './attribute-definition.controller';
import { AttributeDefinition } from './entities/attribute-definition.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AttributeDefinition])],
  controllers: [AttributeDefinitionController],
  providers: [AttributeDefinitionService],
})
export class AttributeDefinitionModule {}
