import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ServicesModule } from './services/services.module';
import { User } from './users/entities/user.entity';
import { Product } from './products/entities/product.entity';
import { Service } from './services/entities/service.entity';
import { ProductVariantsModule } from './productVariants/product-variants.module';
import { VariantAttributesModule } from './variant-attributes/variant-attributes.module';
import { AttributeDefinitionModule } from './attribute-definition/attribute-definition.module';
import { ProductVariant } from './productVariants/entities/product-variant.entity';
import { VariantAttribute } from './variant-attributes/entities/variant-attribute.entity';
import { AttributeDefinition } from './attribute-definition/entities/attribute-definition.entity';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
    inject: [ConfigService],

    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      entities: [User, Product, Service, ProductVariant, VariantAttribute, AttributeDefinition],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  }), UsersModule, ProductsModule, ServicesModule, ProductVariantsModule, VariantAttributesModule, AttributeDefinitionModule],
  
})
export class AppModule {}
