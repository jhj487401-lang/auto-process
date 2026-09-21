const TYPE_MAP = {
  string: { prisma: 'String', ts: 'string', validator: 'IsString' },
  number: { prisma: 'Int', ts: 'number', validator: 'IsInt' },
  float: { prisma: 'Float', ts: 'number', validator: 'IsNumber' },
  boolean: { prisma: 'Boolean', ts: 'boolean', validator: 'IsBoolean' },
  date: { prisma: 'DateTime', ts: 'Date', validator: 'IsDateString' },
};

/**
 * Parses a field spec string like "name:string,price:number,note:string?"
 * into the structured data the Prisma model and DTO templates render from.
 * A trailing "?" marks a field optional/nullable.
 */
export function parseFields(raw) {
  if (!raw || !raw.trim()) return [];

  return raw
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const optional = part.endsWith('?');
      const clean = (optional ? part.slice(0, -1) : part).trim();
      const [rawName, rawType] = clean.split(':').map((s) => (s ?? '').trim());
      const type = TYPE_MAP[rawType?.toLowerCase()] ?? TYPE_MAP.string;

      return {
        name: rawName,
        optional,
        prismaType: `${type.prisma}${optional ? '?' : ''}`,
        tsType: type.ts,
        validator: type.validator,
      };
    })
    .filter((field) => field.name);
}

export function uniqueValidators(fields) {
  return [...new Set(fields.map((f) => f.validator))].sort();
}

function toKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function pluralizeWord(word) {
  if (/(s|x|z|ch|sh)$/i.test(word)) return `${word}es`;
  if (/[^aeiou]y$/i.test(word)) return `${word.slice(0, -1)}ies`;
  return `${word}s`;
}

/** PascalCase entity name -> plural kebab-case route segment (Category -> categories, OrderItem -> order-items). */
export function pluralKebab(name) {
  const parts = toKebab(name).split('-');
  parts[parts.length - 1] = pluralizeWord(parts[parts.length - 1]);
  return parts.join('-');
}
