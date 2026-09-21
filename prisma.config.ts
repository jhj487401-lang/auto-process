import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Prisma 7 config: `prisma migrate`/`db push` read the connection URL from
// here rather than from schema.prisma. Runtime queries go through the
// driver adapter configured in src/common/prisma/prisma.service.ts instead.
export default defineConfig({
  schema: 'prisma/schema',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
