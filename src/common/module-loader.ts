import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Type } from '@nestjs/common';

/**
 * Scans `dir` for `<name>/<name>.module.js` folders and dynamically imports
 * each module class. AppModule uses this for both src/modules (generated
 * CRUD) and src/features (hand-written features) so that adding either kind
 * never requires editing app.module.ts.
 */
export async function loadModulesFrom(dir: string): Promise<Type<any>[]> {
  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch {
    return [];
  }

  const modules: Type<any>[] = [];
  for (const name of entries) {
    const modulePath = join(dir, name, `${name}.module.js`);
    try {
      const imported = await import(pathToFileURL(modulePath).href);
      const exported = Object.values(imported).find((value) => typeof value === 'function');
      if (exported) {
        modules.push(exported as Type<any>);
      }
    } catch {
      // Directory without a matching *.module.js — not a module, skip it.
    }
  }
  return modules;
}
