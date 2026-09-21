import { parseFields, pluralKebab, uniqueValidators } from './field-parser.js';

// Generated files must land at the project root, not relative to this
// plopfile's folder — callers pass `--dest .` (CLI) or `destBasePath`
// (node-plop API) pointing at the project root. See package.json scripts
// and scripts/generate-entities.mjs.

/** @param {import('plop').NodePlopAPI} plop */
export default function (plop) {
  plop.setHelper('pluralKebab', pluralKebab);

  // ---------------------------------------------------------------------
  // `entity`: scaffolds a complete, isolated CRUD base for a new subject —
  // a Prisma model file, module, controller, service, and DTOs. Running it
  // again for another entity never edits any file this run created.
  // ---------------------------------------------------------------------
  plop.setGenerator('entity', {
    description: 'Generate a full CRUD base (Prisma model + module/controller/service/DTOs) for a new entity',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Entity name (PascalCase singular, e.g. Product):',
        validate: (input) => (/^[A-Za-z][A-Za-z0-9]*$/.test(input) ? true : 'Use a plain alphanumeric name, e.g. Product or OrderItem'),
      },
      {
        type: 'input',
        name: 'fieldsRaw',
        message: 'Fields as "name:type,name:type" (types: string, number, float, boolean, date; suffix ? for optional):',
      },
    ],
    actions: (answers) => {
      const fields = parseFields(answers.fieldsRaw);
      answers.fields = fields;
      answers.validatorImports = uniqueValidators(fields).concat(fields.some((f) => f.optional) ? ['IsOptional'] : []);
      answers.validatorImports = [...new Set(answers.validatorImports)].sort();

      const base = 'src/modules/{{kebabCase name}}';
      return [
        {
          type: 'add',
          path: 'prisma/schema/{{pascalCase name}}.prisma',
          templateFile: 'templates/prisma-model.hbs',
        },
        {
          type: 'add',
          path: `${base}/{{kebabCase name}}.module.ts`,
          templateFile: 'templates/module.hbs',
        },
        {
          type: 'add',
          path: `${base}/{{kebabCase name}}.controller.ts`,
          templateFile: 'templates/controller.hbs',
        },
        {
          type: 'add',
          path: `${base}/{{kebabCase name}}.service.ts`,
          templateFile: 'templates/service.hbs',
        },
        {
          type: 'add',
          path: `${base}/dto/create-{{kebabCase name}}.dto.ts`,
          templateFile: 'templates/dto-create.hbs',
        },
        {
          type: 'add',
          path: `${base}/dto/update-{{kebabCase name}}.dto.ts`,
          templateFile: 'templates/dto-update.hbs',
        },
        'Next steps: run `npm run prisma:generate` then `npm run prisma:migrate` (or `npm run prisma:push` against the local prisma dev sandbox — see README) to apply the new model.',
      ];
    },
  });

  // ---------------------------------------------------------------------
  // `feature`: scaffolds an empty business-logic module. It never writes
  // into src/modules, so building a feature can't disturb generated CRUD.
  // ---------------------------------------------------------------------
  plop.setGenerator('feature', {
    description: 'Generate an empty feature module (no CRUD) under src/features',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Feature name (PascalCase, e.g. CheckoutSummary):',
        validate: (input) => (/^[A-Za-z][A-Za-z0-9]*$/.test(input) ? true : 'Use a plain alphanumeric name'),
      },
    ],
    actions: () => {
      const base = 'src/features/{{kebabCase name}}';
      return [
        {
          type: 'add',
          path: `${base}/{{kebabCase name}}.module.ts`,
          templateFile: 'templates/feature-module.hbs',
        },
        {
          type: 'add',
          path: `${base}/{{kebabCase name}}.controller.ts`,
          templateFile: 'templates/feature-controller.hbs',
        },
        {
          type: 'add',
          path: `${base}/{{kebabCase name}}.service.ts`,
          templateFile: 'templates/feature-service.hbs',
        },
      ];
    },
  });
}
