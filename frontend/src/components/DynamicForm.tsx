import { useState, type FormEvent } from 'react';
import type { FieldSchema } from '../lib/openapi';
import type { Row } from '../lib/api';

function toDatetimeLocal(value: unknown): string {
  if (!value || typeof value !== 'string') return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function buildInitialState(fields: FieldSchema[], initial?: Row): Record<string, string> {
  const state: Record<string, string> = {};
  for (const field of fields) {
    const value = initial?.[field.name];
    if (field.type === 'boolean') {
      state[field.name] = value ? 'true' : 'false';
    } else if (field.type === 'date-time') {
      state[field.name] = toDatetimeLocal(value);
    } else {
      state[field.name] = value === undefined || value === null ? '' : String(value);
    }
  }
  return state;
}

function toPayload(fields: FieldSchema[], state: Record<string, string>): Row {
  const payload: Row = {};
  for (const field of fields) {
    const raw = state[field.name];
    if (!field.required && raw === '') continue; // omit blank optional fields
    if (field.type === 'number') payload[field.name] = raw === '' ? undefined : Number(raw);
    else if (field.type === 'boolean') payload[field.name] = raw === 'true';
    else if (field.type === 'date-time') payload[field.name] = raw ? new Date(raw).toISOString() : undefined;
    else payload[field.name] = raw;
  }
  return payload;
}

export function DynamicForm({
  fields,
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  fields: FieldSchema[];
  initial?: Row;
  submitLabel: string;
  onSubmit: (payload: Row) => Promise<void>;
  onCancel: () => void;
}) {
  const [state, setState] = useState(() => buildInitialState(fields, initial));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (name: string, value: string) => setState((s) => ({ ...s, [name]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await onSubmit(toPayload(fields, state));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="entity-form" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <label key={field.name} className="entity-form-field">
          <span>
            {field.name}
            {field.required && <span className="required-mark"> *</span>}
          </span>
          {field.type === 'boolean' ? (
            <select value={state[field.name]} onChange={(e) => handleChange(field.name, e.target.value)}>
              <option value="false">false</option>
              <option value="true">true</option>
            </select>
          ) : field.type === 'date-time' ? (
            <input
              type="datetime-local"
              value={state[field.name]}
              required={field.required}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          ) : field.type === 'number' ? (
            <input
              type="number"
              value={state[field.name]}
              required={field.required}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          ) : (
            <input
              type="text"
              value={state[field.name]}
              required={field.required}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          )}
        </label>
      ))}

      {error && <p className="form-error">{error}</p>}

      <div className="entity-form-actions">
        <button type="submit" disabled={busy}>
          {busy ? 'Saving…' : submitLabel}
        </button>
        <button type="button" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
      </div>
    </form>
  );
}
