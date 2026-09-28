import type { EntityMeta } from '../lib/openapi';

export function Sidebar({
  entities,
  selected,
  onSelect,
}: {
  entities: EntityMeta[];
  selected: string | null;
  onSelect: (tag: string) => void;
}) {
  return (
    <nav className="sidebar">
      <h1>auto-process</h1>
      <ul>
        {entities.map((e) => (
          <li key={e.tag}>
            <button className={e.tag === selected ? 'active' : ''} onClick={() => onSelect(e.tag)}>
              {e.tag}
              {e.kind === 'readonly' && <span className="badge">view</span>}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
