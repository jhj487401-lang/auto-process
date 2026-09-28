const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export type Row = Record<string, unknown>;

async function handle(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json();
}

/** GET a plain endpoint (paginated {data,total,...} or a plain object). */
export async function fetchJson(path: string): Promise<unknown> {
  const res = await fetch(`${API_BASE}${path}`);
  return handle(res);
}

export async function listRows(basePath: string): Promise<Row[]> {
  const json = (await fetchJson(basePath)) as { data?: Row[] } | Row[];
  if (Array.isArray(json)) return json;
  return json.data ?? [];
}

export async function createRow(basePath: string, payload: Row): Promise<Row> {
  const res = await fetch(`${API_BASE}${basePath}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function updateRow(itemPath: string, id: number | string, payload: Row): Promise<Row> {
  const res = await fetch(`${API_BASE}${itemPath.replace('{id}', String(id))}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function deleteRow(itemPath: string, id: number | string): Promise<void> {
  const res = await fetch(`${API_BASE}${itemPath.replace('{id}', String(id))}`, { method: 'DELETE' });
  await handle(res);
}
