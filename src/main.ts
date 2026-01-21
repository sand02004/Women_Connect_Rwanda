import 'dotenv/config'; // load environment variables from .env
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Add a global prefix for all routes
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setVersion('1.0.0')
    .setTitle('Women Connect Rwanda API')
    .addTag('User')
    .addTag('Profiles')
    .addTag('Opportunities')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory); // Swagger at /api-docs
 const port = process.env.PORT ?? 3000;
  await app.listen(port,'0.0.0.0');
 
  console.log(`application is running on: http://localhost:${port}`);
  console.log(`swagger is running on port: http://localhost:${port}/api-docs`);
}
bootstrap();
