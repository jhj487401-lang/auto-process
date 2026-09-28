import { useEffect, useState } from 'react';
import type { EntityMeta } from '../lib/openapi';
import { createRow, deleteRow, fetchJson, listRows, updateRow, type Row } from '../lib/api';
import { DynamicForm } from './DynamicForm';

type Mode = { kind: 'list' } | { kind: 'create' } | { kind: 'edit'; row: Row };

export function EntityPanel({ entity }: { entity: EntityMeta }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [readonlyData, setReadonlyData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>({ kind: 'list' });
  const [pendingDeleteId, setPendingDeleteId] = useState<unknown>(null);

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      if (entity.kind === 'crud') {
        setRows(await listRows(entity.basePath));
      } else {
        setReadonlyData(await fetchJson(entity.basePath));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMode({ kind: 'list' });
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity.tag]);

  if (entity.kind === 'readonly') {
    return (
      <section>
        <div className="panel-header">
          <h2>{entity.tag}</h2>
          <button onClick={() => void reload()}>Refresh</button>
        </div>
        {loading && <p>Loading…</p>}
        {error && <p className="form-error">{error}</p>}
        {!loading && !error && <pre className="readonly-json">{JSON.stringify(readonlyData, null, 2)}</pre>}
      </section>
    );
  }

  const columns = rows.length > 0 ? Object.keys(rows[0]) : ['id', ...entity.fields.map((f) => f.name)];

  const handleCreate = async (payload: Row) => {
    await createRow(entity.basePath, payload);
    setMode({ kind: 'list' });
    await reload();
  };

  const handleUpdate = async (id: unknown, payload: Row) => {
    if (!entity.itemPath) return;
    await updateRow(entity.itemPath, id as number, payload);
    setMode({ kind: 'list' });
    await reload();
  };

  const handleDelete = async (id: unknown) => {
    if (!entity.itemPath) return;
    await deleteRow(entity.itemPath, id as number);
    setPendingDeleteId(null);
    await reload();
  };

  return (
    <section>
      <div className="panel-header">
        <h2>{entity.tag}</h2>
        <div>
          <button onClick={() => void reload()}>Refresh</button>
          <button onClick={() => setMode({ kind: 'create' })}>+ New</button>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      {mode.kind === 'create' && (
        <DynamicForm
          fields={entity.fields}
          submitLabel="Create"
          onSubmit={handleCreate}
          onCancel={() => setMode({ kind: 'list' })}
        />
      )}

      {mode.kind === 'edit' && (
        <DynamicForm
          fields={entity.fields}
          initial={mode.row}
          submitLabel="Save"
          onSubmit={(payload) => handleUpdate(mode.row.id, payload)}
          onCancel={() => setMode({ kind: 'list' })}
        />
      )}

      {mode.kind === 'list' && (
        <>
          {loading && <p>Loading…</p>}
          {!loading && rows.length === 0 && <p>No records yet.</p>}
          {!loading && rows.length > 0 && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {columns.map((c) => (
                      <th key={c}>{c}</th>
                    ))}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={String(row.id)}>
                      {columns.map((c) => (
                        <td key={c}>{String(row[c] ?? '')}</td>
                      ))}
                      <td className="row-actions">
                        {pendingDeleteId === row.id ? (
                          <>
                            <span className="confirm-text">Delete?</span>
                            <button className="danger" onClick={() => void handleDelete(row.id)}>
                              Confirm
                            </button>
                            <button onClick={() => setPendingDeleteId(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setMode({ kind: 'edit', row })}>Edit</button>
                            <button onClick={() => setPendingDeleteId(row.id)}>Delete</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}
