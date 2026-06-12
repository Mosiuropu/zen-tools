import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, CornerDownLeft } from 'lucide-react';

export default function CommandPalette({ tabs, open, setOpen, onSelect, isDark, toggleTheme }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  const items = useMemo(() => {
    const tools = tabs.map((t) => ({ ...t, kind: 'Tool' }));
    const actions = [
      { id: '__theme', label: isDark ? 'Switch to Light mode' : 'Switch to Dark mode', kind: 'Action', icon: tabs[0].icon },
    ];
    const all = [...tools, ...actions];
    if (!query.trim()) return all;
    const q = query.toLowerCase();
    return all.filter((i) => i.label.toLowerCase().includes(q));
  }, [tabs, query, isDark]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  useEffect(() => {
    if (open) { setQuery(''); setActive(0); setTimeout(() => inputRef.current?.focus(), 30); }
  }, [open]);

  useEffect(() => { setActive(0); }, [query]);

  if (!open) return null;

  const run = (item) => {
    if (item.id === '__theme') toggleTheme();
    else onSelect(item.id);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, items.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === 'Enter' && items[active]) run(items[active]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/40 backdrop-blur-sm"
      onClick={() => setOpen(false)}>
      <div className="w-full max-w-lg zen-card shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 border-b border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)]">
          <Search className="w-4 h-4 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Jump to a tool..."
            className="flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-[var(--color-zen-muted-light)] dark:placeholder:text-[var(--color-zen-muted-dark)] text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">ESC</kbd>
        </div>
        <div className="max-h-72 overflow-y-auto no-scrollbar py-2">
          {items.length === 0 && (
            <div className="px-4 py-8 text-center text-xs text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">No matches.</div>
          )}
          {items.map((item, i) => (
            <button key={item.id} onMouseEnter={() => setActive(i)} onClick={() => run(item)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                i === active
                  ? 'bg-[var(--color-zen-border-light)] dark:bg-[var(--color-zen-border-dark)] text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]'
                  : 'text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]'
              }`}>
              <span className="text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              <span className="text-[10px] uppercase tracking-wider opacity-60">{item.kind}</span>
              {i === active && <CornerDownLeft className="w-3.5 h-3.5 opacity-60" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
