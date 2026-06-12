import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Copy, Check, Shield } from 'lucide-react';

const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  number: '0123456789',
  symbol: '!@#$%^&*()-_=+[]{};:,.<>?',
};

function secureRandom(max) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

export default function ZenPassword() {
  const [length, setLength] = useState(20);
  const [opts, setOpts] = useState({ lower: true, upper: true, number: true, symbol: true });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const pool = Object.keys(opts).filter((k) => opts[k]).map((k) => SETS[k]).join('');
    if (!pool) { setPassword(''); return; }
    let out = '';
    for (let i = 0; i < length; i++) out += pool[secureRandom(pool.length)];
    setPassword(out);
    setCopied(false);
  }, [length, opts]);

  useEffect(() => { generate(); }, [generate]);

  const copy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const entropy = (() => {
    const poolSize = Object.keys(opts).filter((k) => opts[k]).reduce((s, k) => s + SETS[k].length, 0);
    return poolSize ? Math.round(length * Math.log2(poolSize)) : 0;
  })();

  const strength = entropy >= 100 ? { label: 'Fortress', color: 'text-emerald-500', w: '100%' }
    : entropy >= 70 ? { label: 'Strong', color: 'text-emerald-500', w: '75%' }
    : entropy >= 45 ? { label: 'Fair', color: 'text-amber-500', w: '50%' }
    : { label: 'Weak', color: 'text-red-500', w: '25%' };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="zen-card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <code className="flex-1 break-all text-base md:text-lg font-semibold tracking-tight min-h-[1.5em] text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">
            {password || '—'}
          </code>
          <button onClick={generate} className="p-2 zen-btn-secondary" title="Regenerate">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={copy} className="p-2 zen-btn-primary" title="Copy">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="space-y-2">
          <div className="h-1.5 w-full rounded-full bg-[var(--color-zen-border-light)] dark:bg-[var(--color-zen-border-dark)] overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-300 ${strength.color.replace('text', 'bg')}`} style={{ width: strength.w }} />
          </div>
          <div className="flex justify-between text-[11px] font-medium text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
            <span className={strength.color}>{strength.label}</span>
            <span>{entropy} bits entropy</span>
          </div>
        </div>
      </div>

      <div className="zen-card p-6 space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
            <span>Length</span>
            <span className="text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)] font-semibold">{length}</span>
          </div>
          <input type="range" min="6" max="64" value={length} onChange={(e) => setLength(+e.target.value)}
            className="w-full accent-[var(--color-zen-accent-primary-light)] dark:accent-[var(--color-zen-accent-primary-dark)]" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {Object.entries({ lower: 'Lowercase', upper: 'Uppercase', number: 'Numbers', symbol: 'Symbols' }).map(([k, label]) => (
            <button key={k} onClick={() => setOpts({ ...opts, [k]: !opts[k] })}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-xs font-medium border transition-all ${
                opts[k]
                  ? 'border-[var(--color-zen-accent-primary-light)] dark:border-[var(--color-zen-accent-primary-dark)] text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)] bg-[var(--color-zen-accent-primary-light)]/5 dark:bg-[var(--color-zen-accent-primary-dark)]/10'
                  : 'border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]'
              }`}>
              {opts[k] ? <Check className="w-3.5 h-3.5" /> : <span className="w-3.5 h-3.5" />}
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="flex items-center justify-center gap-2 text-[11px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
        <Shield className="w-3 h-3" /> Generated locally with the Web Crypto API. Nothing leaves your device.
      </p>
    </div>
  );
}
