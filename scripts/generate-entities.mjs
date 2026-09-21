import nodePlop from 'node-plop';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Batch-generates CRUD bases from a list, so scaffolding many entities is a
// plain loop over the same generator used interactively (`npm run
// generate:entity`) — a `for` loop here, but any loop construct works the
// same way since it's just repeated calls to generator.runActions(...).

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = process.argv[2] ?? join(__dirname, '..', 'entities.batch.json');

const entities = JSON.parse(await readFile(configPath, 'utf-8'));
const projectRoot = join(__dirname, '..');
const plop = await nodePlop(join(projectRoot, 'generator', 'plopfile.js'), { destBasePath: projectRoot });
const generator = plop.getGenerator('entity');

for (const entity of entities) {
  console.log(`\nGenerating entity: ${entity.name}`);
  const results = await generator.runActions({ name: entity.name, fieldsRaw: entity.fields ?? '' });

  for (const change of results.changes) console.log(`  + ${change.path}`);
  for (const failure of results.failures) console.error(`  ! ${failure.path}: ${failure.error}`);
}

console.log(`\nDone. Generated ${entities.length} entities.`);
console.log('Next: npm run prisma:generate && npm run prisma:migrate');
