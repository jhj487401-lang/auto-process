import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './common/prisma/prisma.module.js';
import { loadModulesFrom } from './common/module-loader.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * The module tree is assembled dynamically: everything under src/modules
 * (generated CRUD) and src/features (hand-written features) is discovered
 * and wired in automatically. Scaffolding a new entity or feature never
 * requires touching this file.
 */
export async function createAppModule() {
  const [entityModules, featureModules] = await Promise.all([
    loadModulesFrom(join(__dirname, 'modules')),
    loadModulesFrom(join(__dirname, 'features')),
  ]);

  class AppModule {}

  Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, ...entityModules, ...featureModules],
    controllers: [AppController],
    providers: [AppService],
  })(AppModule);

  return AppModule;
}
