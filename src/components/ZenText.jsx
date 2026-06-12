import React, { useState, useMemo } from 'react';
import { Copy, Check, Trash2, Type } from 'lucide-react';

const transforms = {
  'UPPERCASE': (s) => s.toUpperCase(),
  'lowercase': (s) => s.toLowerCase(),
  'Title Case': (s) => s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()),
  'Sentence case': (s) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
  'camelCase': (s) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
  'snake_case': (s) => s.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_'),
  'kebab-case': (s) => s.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-'),
  'Reverse': (s) => [...s].reverse().join(''),
  'Trim spaces': (s) => s.replace(/\s+/g, ' ').trim(),
};

export default function ZenText() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? (text.match(/[.!?]+(\s|$)/g) || []).length || 1 : 0;
    const lines = text ? text.split('\n').length : 0;
    return {
      chars: text.length,
      charsNoSpace: text.replace(/\s/g, '').length,
      words,
      sentences,
      lines,
      readMin: Math.max(words ? Math.ceil(words / 200) : 0, 0),
    };
  }, [text]);

  const copy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const Stat = ({ label, value }) => (
    <div className="zen-card px-4 py-3 text-center">
      <div className="text-xl font-semibold text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] mt-1">{label}</div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <Stat label="Words" value={stats.words} />
        <Stat label="Chars" value={stats.chars} />
        <Stat label="No space" value={stats.charsNoSpace} />
        <Stat label="Sentences" value={stats.sentences} />
        <Stat label="Lines" value={stats.lines} />
        <Stat label="Read min" value={stats.readMin} />
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste text here..."
          rows={10}
          className="zen-input w-full resize-y leading-relaxed"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <button onClick={copy} className="p-1.5 zen-btn-secondary" title="Copy">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => setText('')} className="p-1.5 zen-btn-secondary" title="Clear">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="flex items-center gap-2 text-xs font-medium text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
          <Type className="w-3.5 h-3.5" /> Transform
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(transforms).map((name) => (
            <button key={name} onClick={() => setText((t) => transforms[name](t))}
              className="px-3 py-1.5 zen-btn-secondary text-xs">
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
