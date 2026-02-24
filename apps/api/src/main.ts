import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigin =
    process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) ??
    'http://localhost:3000';
  app.enableCors({ origin: corsOrigin });
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`API running on 0.0.0.0:${port}`);
}

void bootstrap();
