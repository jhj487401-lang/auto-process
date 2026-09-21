import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { createAppModule } from './app.module.js';

async function bootstrap() {
  // Entity/feature modules are imported dynamically (see app.module.ts), and
  // some of them (PrismaService) read process.env at import time — .env
  // must be loaded before createAppModule() triggers those imports.
  try {
    process.loadEnvFile();
  } catch {
    // No .env file — assume the environment provides the variables directly.
  }

  const AppModule = await createAppModule();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
