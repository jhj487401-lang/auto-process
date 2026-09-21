# auto-process

NestJS + Prisma(PostgreSQL) backend with a CLI generator that scaffolds a
complete, isolated CRUD base for any new entity, plus a separate generator
for hand-written features that never touches generated CRUD code.

## Stack

- NestJS 12 (ESM, TypeScript)
- Prisma ORM 7 (multi-file schema, `pg` driver adapter) + PostgreSQL
- Plop.js for code generation
- class-validator / class-transformer for request validation

Prisma 7 no longer reads the connection URL from `schema.prisma`: the CLI
(`migrate`/`db push`/`studio`) reads it from `prisma.config.ts`, and the
runtime client connects via the `@prisma/adapter-pg` driver adapter
constructed in `src/common/prisma/prisma.service.ts`. Both read
`DATABASE_URL` from `.env`.

### `node_modules` is a junction

This project lives under OneDrive (`.../OneDrive/Desktop/auto-process`).
OneDrive's real-time sync repeatedly corrupted `node_modules` during install
(locked/missing files), so `node_modules` here is an NTFS junction pointing
to `C:\Users\<you>\.dev-node-modules\auto-process\node_modules`, outside any
synced folder. This is transparent to npm/node/tsc — `npm install`,
`rm -rf node_modules`, etc. all work normally; the junction just keeps the
actual package files out of OneDrive's sync scope. If you move this project
to a non-OneDrive path, you can delete the junction and let a plain
`npm install` recreate a normal `node_modules` folder.

## Getting started

```bash
cp .env.example .env   # set DATABASE_URL to your PostgreSQL instance
npm install
npm run prisma:generate
npm run prisma:migrate  # creates tables from prisma/schema/*.prisma
npm run start:dev
```

### Local database (no Docker/Postgres install needed)

No local PostgreSQL or Docker in this environment, so the dev database is
Prisma's own built-in local Postgres server (`prisma dev`), running
detached under the name `auto-process`:

```bash
npx prisma dev ls              # show status + connection strings
npx prisma dev stop auto-process   # stop it
npx prisma dev start auto-process  # start it again (same data)
```

`.env`'s `DATABASE_URL` is already set to its direct TCP connection string
(`postgresql://postgres:postgres@localhost:51214/template1?sslmode=disable`).
If you restart the machine or the port changes, run `npx prisma dev ls` and
copy the `TCP` URL into `.env`. Swap it for a real PostgreSQL instance's URL
any time — nothing else needs to change.

**Known issue:** this local `prisma dev` server's shadow database (used by
`npm run prisma:migrate` / `prisma migrate dev` to validate a migration
before applying it) gets stuck in a broken state after the first migration,
failing with `P3006: relation "..." already exists` on every subsequent
`migrate dev` call — this reproduces even after `prisma dev rm` + recreating
the server and `prisma migrate reset`, so it's specific to this local dev
server, not the migration files or the main database. Until that's sorted
out, use **`npm run prisma:push`** (`prisma db push`, which skips the shadow
database entirely) to sync schema changes here. `migrate dev` should work
normally against a real PostgreSQL instance.

## Directory structure

```
prisma/schema/          one .prisma file per entity (schema.prisma = datasource/generator only)
src/
  common/                shared building blocks — BaseCrudService, PrismaService, module loader
  modules/<entity>/       GENERATED CRUD — module, controller, service, dto/
  features/<feature>/     hand-written business logic, composes module services
  app.module.ts           auto-discovers everything in modules/ and features/ at boot
```

`app.module.ts` never needs to be edited: it scans `src/modules` and
`src/features` at startup and wires in whatever it finds. Adding an entity or
a feature is purely additive — new files only, nothing existing is touched.

## Adding a new entity (full CRUD base)

```bash
npm run generate:entity
```

You'll be asked for a name (e.g. `Product`) and a field list, e.g.:

```
name:string,price:number,description:string?,inStock:boolean
```

Supported types: `string`, `number`, `float`, `boolean`, `date`. Suffix a
field with `?` to make it optional. This creates:

- `prisma/schema/Product.prisma` — the Prisma model (new file, nothing else edited)
- `src/modules/product/product.module.ts`
- `src/modules/product/product.controller.ts` — full REST CRUD (`GET/POST /products`, `GET/PATCH/DELETE /products/:id`)
- `src/modules/product/product.service.ts` — extends `BaseCrudService` for create/findAll/findOne/update/remove
- `src/modules/product/dto/create-product.dto.ts` and `update-product.dto.ts`

Then apply the schema change:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### Generating many entities at once (loop-friendly)

Define a batch in `entities.batch.json`:

```json
[
  { "name": "Product", "fields": "name:string,price:number" },
  { "name": "Category", "fields": "name:string" }
]
```

```bash
npm run generate:batch
```

This runs the same generator in a plain `for` loop
(`scripts/generate-entities.mjs`) — swap it for a `while` loop or any other
iteration and it behaves identically, since each entity is just one call to
`generator.runActions(...)`.

## Adding a new feature (no CRUD)

```bash
npm run generate:feature
```

Scaffolds an empty `src/features/<feature>/` module/controller/service. Build
business logic here by injecting generated entity services (e.g.
`ProductService`) like any other provider — this generator only ever writes
under `src/features`, so it can never modify generated CRUD in `src/modules`.

## Common building blocks

- `src/common/base-crud.service.ts` — the CRUD logic shared by every
  generated service. Change behavior here once and every entity picks it up.
- `src/common/prisma/prisma.service.ts` — injectable Prisma client.
- `src/common/module-loader.ts` — the directory-scanning used by
  `app.module.ts` to auto-register generated/feature modules.
