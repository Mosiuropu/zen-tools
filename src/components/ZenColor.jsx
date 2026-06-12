import React, { useState, useCallback } from 'react';
import { RefreshCw, Copy, Check, Lock, Unlock } from 'lucide-react';

function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function randColor() {
  const h = Math.floor(Math.random() * 360);
  const s = 55 + Math.floor(Math.random() * 35);
  const l = 45 + Math.floor(Math.random() * 25);
  return hslToHex(h, s, l);
}

function readable(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140 ? '#1a1a1a' : '#ffffff';
}

export default function ZenColor() {
  const [palette, setPalette] = useState(() => Array.from({ length: 5 }, () => ({ hex: randColor(), locked: false })));
  const [copied, setCopied] = useState(null);

  const shuffle = useCallback(() => {
    setPalette((p) => p.map((c) => (c.locked ? c : { ...c, hex: randColor() })));
  }, []);

  const copy = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
          Lock the shades you like, then shuffle the rest. Click a swatch to copy.
        </p>
        <button onClick={shuffle} className="flex items-center gap-2 px-4 py-2 zen-btn-primary text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> Shuffle
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {palette.map((c, i) => {
          const fg = readable(c.hex);
          return (
            <div key={i} className="rounded-md overflow-hidden border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] shadow-sm group">
              <button onClick={() => copy(c.hex)} className="h-32 sm:h-44 w-full flex items-center justify-center relative" style={{ background: c.hex }}>
                <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5" style={{ color: fg }}>
                  {copied === c.hex ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === c.hex ? 'Copied' : 'Copy'}
                </span>
              </button>
              <div className="flex items-center justify-between px-3 py-2 bg-[var(--color-zen-card-light)] dark:bg-[var(--color-zen-card-dark)]">
                <code className="text-xs font-semibold uppercase text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">{c.hex}</code>
                <button onClick={() => setPalette((p) => p.map((x, j) => (j === i ? { ...x, locked: !x.locked } : x)))}
                  className="text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:text-[var(--color-zen-accent-primary-light)] dark:hover:text-[var(--color-zen-accent-primary-dark)]">
                  {c.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
