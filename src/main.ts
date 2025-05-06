import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import UserSeeder from './seeders/users.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  const userSeeder = app.get(UserSeeder);
  await userSeeder.seed();
  console.log('Seeding complete.');

  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('Sistema de gestión de servicios, productos, usuarios, carritos y mas!')
    .setVersion('1.0')
    .addTag('Services')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();