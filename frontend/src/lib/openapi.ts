const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export type FieldType = 'string' | 'number' | 'boolean' | 'date-time';

export interface FieldSchema {
  name: string;
  type: FieldType;
  required: boolean;
}

export interface EntityMeta {
  tag: string;
  basePath: string;
  itemPath?: string;
  fields: FieldSchema[];
  /** 'crud' has full POST/GET/PATCH/DELETE; 'readonly' only has a plain GET (e.g. a feature endpoint). */
  kind: 'crud' | 'readonly';
}

interface OpenApiSchemaNode {
  type?: string;
  format?: string;
  properties?: Record<string, OpenApiSchemaNode>;
  required?: string[];
  $ref?: string;
}

interface OpenApiOperation {
  tags?: string[];
  requestBody?: { content?: Record<string, { schema?: OpenApiSchemaNode }> };
}

interface OpenApiDoc {
  paths: Record<string, Record<string, OpenApiOperation>>;
  components: { schemas: Record<string, OpenApiSchemaNode> };
}

function resolveSchema(doc: OpenApiDoc, node?: OpenApiSchemaNode): OpenApiSchemaNode | undefined {
  if (!node) return undefined;
  if (node.$ref) {
    const key = node.$ref.replace('#/components/schemas/', '');
    return doc.components.schemas[key];
  }
  return node;
}

function schemaToFields(doc: OpenApiDoc, node?: OpenApiSchemaNode): FieldSchema[] {
  const schema = resolveSchema(doc, node);
  if (!schema?.properties) return [];
  const required = new Set(schema.required ?? []);
  return Object.entries(schema.properties).map(([name, prop]) => {
    let type: FieldType = 'string';
    if (prop.type === 'number' || prop.type === 'integer') type = 'number';
    else if (prop.type === 'boolean') type = 'boolean';
    else if (prop.type === 'string' && prop.format === 'date-time') type = 'date-time';
    return { name, type, required: required.has(name) };
  });
}

interface RawEntity {
  tag: string;
  basePath?: string;
  itemPath?: string;
  hasPost?: boolean;
  hasListGet?: boolean;
  hasPatch?: boolean;
  hasDelete?: boolean;
  fields: FieldSchema[];
}

/**
 * Reads the backend's own OpenAPI document (served by SwaggerModule at
 * /api-json) and derives a CRUD entity registry from it — tags, routes and
 * Create-DTO field shapes. A newly generated backend entity needs zero
 * frontend code changes to appear here: this file has no per-entity logic.
 */
export async function fetchEntities(): Promise<EntityMeta[]> {
  const res = await fetch(`${API_BASE}/api-json`);
  if (!res.ok) throw new Error(`Failed to load API schema (${res.status})`);
  const doc: OpenApiDoc = await res.json();

  const raw = new Map<string, RawEntity>();

  for (const [path, methods] of Object.entries(doc.paths)) {
    const hasParam = path.includes('{');
    for (const [method, op] of Object.entries(methods)) {
      const tag = op.tags?.[0];
      if (!tag || tag === 'App') continue;

      const entry = raw.get(tag) ?? { tag, fields: [] };
      if (hasParam) entry.itemPath = path;
      else entry.basePath = path;

      if (method === 'post' && !hasParam) {
        entry.hasPost = true;
        entry.fields = schemaToFields(doc, op.requestBody?.content?.['application/json']?.schema);
      }
      if (method === 'get' && !hasParam) entry.hasListGet = true;
      if (method === 'patch' && hasParam) entry.hasPatch = true;
      if (method === 'delete' && hasParam) entry.hasDelete = true;

      raw.set(tag, entry);
    }
  }

  const entities: EntityMeta[] = [];
  for (const e of raw.values()) {
    if (!e.basePath) continue;
    const isFullCrud = e.hasPost && e.hasListGet && e.hasPatch && e.hasDelete && e.itemPath;
    entities.push({
      tag: e.tag,
      basePath: e.basePath,
      itemPath: e.itemPath,
      fields: e.fields,
      kind: isFullCrud ? 'crud' : 'readonly',
    });
  }

  return entities.sort((a, b) => a.tag.localeCompare(b.tag));
}
