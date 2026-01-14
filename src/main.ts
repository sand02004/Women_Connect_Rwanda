import dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setVersion('1.0.0')
  .setTitle('Women Connect Rwanda API')
  .addTag('User')
  .addTag('Profiles')
  .addTag('Opportunities')
  .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  await app.listen(process.env.PORT ?? 3000);
  const port = process.env.PORT;
  console.log(`application is running on: http:/localhost:${port}`);
  console.log(`swagger is running on port: http:localhost:${port}/api`)
}
bootstrap();
