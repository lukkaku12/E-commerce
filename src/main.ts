import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import UserSeeder from './seeders/users.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const userSeeder = app.get(UserSeeder);
  await userSeeder.seed();
  console.log('Seeding complete.');

  const config = new DocumentBuilder()
    .setTitle('API de Servicios')
    .setDescription('Sistema de gestión de servicios')
    .setVersion('1.0')
    .addTag('Services')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
