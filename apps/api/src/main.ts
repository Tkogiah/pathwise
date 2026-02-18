import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigin =
    process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) ??
    'http://localhost:3000';
  app.enableCors({ origin: corsOrigin });
  await app.listen(3001);
  console.log('API running on http://localhost:3001');
}

void bootstrap();
