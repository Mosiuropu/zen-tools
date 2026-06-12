import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

function fmt(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

export default function ZenStopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const startRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (running) {
      startRef.current = performance.now() - elapsed;
      const tick = () => {
        setElapsed(performance.now() - startRef.current);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);

  const reset = () => { setRunning(false); setElapsed(0); setLaps([]); };
  const lap = () => setLaps((l) => [{ n: l.length + 1, t: elapsed, split: elapsed - (l[0]?.t || 0) }, ...l]);

  const fastest = laps.length > 1 ? Math.min(...laps.map((l) => l.split)) : null;
  const slowest = laps.length > 1 ? Math.max(...laps.map((l) => l.split)) : null;

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="zen-card p-10 text-center">
        <div className="text-5xl md:text-7xl font-semibold tabular-nums tracking-tight text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">
          {fmt(elapsed)}
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button onClick={() => setRunning((r) => !r)} className="flex items-center gap-2 px-6 py-3 zen-btn-primary text-sm">
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {running ? 'Pause' : elapsed ? 'Resume' : 'Start'}
        </button>
        <button onClick={running ? lap : reset} className="flex items-center gap-2 px-6 py-3 zen-btn-secondary text-sm">
          {running ? <Flag className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
          {running ? 'Lap' : 'Reset'}
        </button>
      </div>

      {laps.length > 0 && (
        <div className="zen-card divide-y divide-[var(--color-zen-border-light)] dark:divide-[var(--color-zen-border-dark)] max-h-64 overflow-y-auto no-scrollbar">
          {laps.map((l) => (
            <div key={l.n} className="flex items-center justify-between px-5 py-3 text-sm tabular-nums">
              <span className="text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">Lap {l.n}</span>
              <span className={`font-medium ${
                l.split === fastest ? 'text-emerald-500' : l.split === slowest ? 'text-red-500' : 'text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]'
              }`}>{fmt(l.split)}</span>
              <span className="text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] text-xs">{fmt(l.t)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
