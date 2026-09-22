import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('auto-process API')
    .setDescription('Auto-generated CRUD API — browse and try every entity endpoint below.')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
