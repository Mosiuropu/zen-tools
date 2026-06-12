import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Wind } from 'lucide-react';

const TECHNIQUES = {
  box: {
    name: 'Box Breathing',
    desc: 'Navy SEAL technique · 4-4-4-4',
    accent: '#E74C3C',
    steps: [
      { label: 'Inhale', dur: 4, color: '#f59e0b' },
      { label: 'Hold', dur: 4, color: '#10b981' },
      { label: 'Exhale', dur: 4, color: '#8b5cf6' },
      { label: 'Hold', dur: 4, color: '#06b6d4' },
    ],
  },
  relax: {
    name: '4-7-8 Relax',
    desc: 'Natural tranquilizer · 4-7-8',
    accent: '#8b5cf6',
    steps: [
      { label: 'Inhale', dur: 4, color: '#f59e0b' },
      { label: 'Hold', dur: 7, color: '#10b981' },
      { label: 'Exhale', dur: 8, color: '#8b5cf6' },
    ],
  },
  deep: {
    name: 'Deep Calm',
    desc: 'Slow deep breathing · 4-2-6',
    accent: '#06b6d4',
    steps: [
      { label: 'Inhale', dur: 4, color: '#f59e0b' },
      { label: 'Pause', dur: 2, color: '#10b981' },
      { label: 'Exhale', dur: 6, color: '#8b5cf6' },
    ],
  },
};

export default function ZenBreathing() {
  const [tech, setTech] = useState('box');
  const [active, setActive] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const aTech = TECHNIQUES[tech];
  const curStep = aTech.steps[stepIdx];
  const totalDur = aTech.steps.reduce((s, st) => s + st.dur, 0);

  useEffect(() => {
    if (active && curStep) {
      setTimeLeft(curStep.dur);
      timerRef.current = setInterval(() => {
        setTimeLeft(p => {
          if (p <= 1) {
            setStepIdx(idx => (idx + 1) % aTech.steps.length);
            return 0;
          }
          return p - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setStepIdx(0);
      setTimeLeft(0);
    }
    return () => clearInterval(timerRef.current);
  }, [active, stepIdx, tech]);

  const pct = curStep ? ((curStep.dur - timeLeft) / curStep.dur) * 100 : 0;

  return (
    <div className="max-w-xs mx-auto flex flex-col items-center space-y-4 animate-fade-up">
      {/* Technique picker */}
      <div className="flex gap-1.5 p-1 rounded-xl bg-[var(--color-zen-bg-light)] dark:bg-[var(--color-zen-bg-dark)] border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)]">
        {Object.entries(TECHNIQUES).map(([key, data]) => (
          <button key={key} onClick={() => { setTech(key); setActive(false); }}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
              tech === key ? 'text-white shadow-sm' : 'text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:text-[var(--color-zen-text-light)] dark:hover:text-[var(--color-zen-text-dark)]'
            }`}
            style={tech === key ? { backgroundColor: data.accent } : {}}>
            {data.name}
          </button>
        ))}
      </div>

      {/* Main circle */}
      <div className="zen-card p-5 flex flex-col items-center w-full max-w-xs">
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Ring */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--color-zen-border-light)" strokeWidth="6"
              className="dark:stroke-[var(--color-zen-border-dark)]" />
            {curStep && (
              <circle cx="50" cy="50" r="44" fill="none" stroke={curStep.color} strokeWidth="6"
                strokeDasharray={`${(pct / 100) * 276} 276`} strokeLinecap="round"
                className="transition-all duration-500" />
            )}
          </svg>
          {/* Inner circle with wave */}
          <div className="absolute inset-4 rounded-full overflow-hidden" style={{ backgroundColor: curStep?.color || 'transparent', opacity: 0.08 }}>
            <div className="w-full h-full animate-breathe rounded-full" />
          </div>
          <div className="relative text-center">
            {active ? (
              <>
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: curStep?.color }}>
                  {curStep?.label}
                </div>
                <div className="text-2xl font-semibold tabular-nums text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] mt-1">
                  {timeLeft}
                </div>
              </>
            ) : (
              <Wind className="w-10 h-10 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]" />
            )}
          </div>
        </div>

        <p className="text-[10px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] mt-2 text-center">
          {active ? `${aTech.name}` : aTech.desc}
        </p>

        <button onClick={() => setActive(!active)}
          className={`mt-3 flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-md ${
            active ? 'bg-stone-200 dark:bg-stone-700 text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]' : 'text-white'
          }`}
          style={!active ? { backgroundColor: aTech.accent } : {}}>
          {active ? <><Square className="w-3.5 h-3.5" /> Stop</> : <><Play className="w-3.5 h-3.5 fill-current" /> Begin</>}
        </button>

        {/* Step indicators */}
        <div className="flex gap-1.5 mt-3">
          {aTech.steps.map((st, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full transition-all ${i === stepIdx && active ? 'scale-125' : ''}`}
                style={{ backgroundColor: i === stepIdx && active ? st.color : 'var(--color-zen-border-light)' }} />
              <span className="text-[8px] font-medium text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
                {st.dur}s
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
