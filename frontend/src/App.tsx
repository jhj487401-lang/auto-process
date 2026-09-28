import { useEffect, useState } from 'react';
import { fetchEntities, type EntityMeta } from './lib/openapi';
import { Sidebar } from './components/Sidebar';
import { EntityPanel } from './components/EntityPanel';
import './App.css';

export default function App() {
  const [entities, setEntities] = useState<EntityMeta[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntities()
      .then((list) => {
        setEntities(list);
        setSelected(list[0]?.tag ?? null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, []);

  const active = entities.find((e) => e.tag === selected) ?? null;

  return (
    <div className="app-layout">
      <Sidebar entities={entities} selected={selected} onSelect={setSelected} />
      <main className="content">
        {loading && <p>Loading entity list from the API…</p>}
        {error && (
          <p className="form-error">
            Could not reach the API: {error}. Is the backend running (`npm run start:dev` in the project root) at
            the expected URL?
          </p>
        )}
        {active && <EntityPanel key={active.tag} entity={active} />}
      </main>
    </div>
  );
}
