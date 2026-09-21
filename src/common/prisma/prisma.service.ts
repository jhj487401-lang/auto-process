import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Prisma 7 no longer reads the connection URL from schema.prisma — the
    // client needs an explicit driver adapter (see prisma.config.ts for the
    // separate URL the CLI's migrate/generate commands use). The adapter is
    // built here, inside the constructor, rather than as a module-level
    // constant: PrismaModule is a static import of app.module.ts, so a
    // module-level `new PrismaPg(process.env.DATABASE_URL)` would evaluate
    // before main.ts's bootstrap() has loaded .env, always seeing undefined.
    super({ adapter: new PrismaPg(process.env.DATABASE_URL ?? '') });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
