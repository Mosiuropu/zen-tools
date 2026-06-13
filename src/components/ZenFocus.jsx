import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Brain, Volume2, VolumeX, Zap } from 'lucide-react';

const MODES = {
  focus: { label: 'Focus', minutes: 25, ring: '#E5484D' },
  short: { label: 'Short Break', minutes: 5, ring: '#2DB39B' },
  long: { label: 'Long Break', minutes: 15, ring: '#9B6DF2' },
};

export default function ZenFocus() {
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(() => {
    const saved = localStorage.getItem('zen_focus_sessions');
    return saved ? parseInt(saved) : 0;
  });
  const [autoStart, setAutoStart] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('zen_focus_sessions', sessionCount.toString());
  }, [sessionCount]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    clearInterval(timerRef.current);
    if (soundEnabled) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
    }
    if (mode === 'focus') {
      setSessionCount((p) => p + 1);
      switchMode((sessionCount + 1) % 4 === 0 ? 'long' : 'short');
    } else {
      switchMode('focus');
    }
    if (autoStart) setTimeout(() => setIsActive(true), 1000);
  };

  const switchMode = (m) => {
    setMode(m);
    setTimeLeft(MODES[m].minutes * 60);
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode].minutes * 60);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${s % 60 < 10 ? '0' : ''}${s % 60}`;
  const total = MODES[mode].minutes * 60;
  const progress = 1 - timeLeft / total;
  const R = 118;
  const CIRC = 2 * Math.PI * R;

  return (
    <div className="max-w-md mx-auto space-y-5 animate-fade-up">
      {/* Mode chips */}
      <div className="flex justify-center gap-2">
        {Object.entries(MODES).map(([key, data]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className="zen-chip"
            style={
              mode === key
                ? { background: `${data.ring}1a`, color: data.ring, borderColor: data.ring }
                : { borderColor: 'var(--color-zen-border-light)', color: 'var(--color-zen-muted-light)' }
            }
          >
            {data.label}
          </button>
        ))}
      </div>

      {/* Tomato */}
      <div className="relative flex flex-col items-center">
        <div className={`relative ${isActive ? 'animate-tomato' : ''}`}>
          {/* Stem + leaves */}
          <svg width="80" height="36" viewBox="0 0 80 36" className="mx-auto -mb-2 relative z-10">
            <path d="M40 30 Q38 14 40 4" stroke="#3E7C3A" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M40 18 Q24 8 12 16 Q24 26 40 20 Z" fill="#4C9A45" />
            <path d="M40 18 Q56 8 68 16 Q56 26 40 20 Z" fill="#5BAE52" />
          </svg>

          {/* Tomato body with progress ring */}
          <div
            className="relative w-64 h-64 rounded-full shadow-2xl"
            style={{
              background: 'radial-gradient(circle at 32% 28%, #FF7B72 0%, #F0473F 45%, #C92F2B 100%)',
              boxShadow: '0 20px 50px -12px rgba(229,72,77,0.5), inset 0 -14px 28px rgba(0,0,0,0.18), inset 0 10px 20px rgba(255,255,255,0.25)',
            }}
          >
            {/* highlight */}
            <div className="absolute top-7 left-10 w-16 h-9 rounded-full bg-white/30 blur-md rotate-[-20deg]" />

            {/* progress ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 256 256">
              <circle cx="128" cy="128" r={R} stroke="rgba(255,255,255,0.25)" strokeWidth="6" fill="none" />
              <circle
                cx="128" cy="128" r={R}
                stroke="#FFF4D6" strokeWidth="6" fill="none" strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - progress)}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>

            {/* time */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span className="text-6xl font-bold tabular-nums tracking-tight drop-shadow-md">{formatTime(timeLeft)}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80 mt-1">
                {mode === 'focus' ? 'Deep Work' : 'Rest'}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-5 -mt-7 relative z-10">
          <button onClick={resetTimer} className="zen-btn-secondary p-3" title="Reset">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsActive(!isActive)}
            className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl active:scale-90 transition-all"
            style={{ background: isActive ? '#1A1A1E' : MODES[mode].ring }}
          >
            {isActive ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
          </button>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="zen-btn-secondary p-3" title="Sound">
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="zen-card px-4 py-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--color-zen-rose)]/10 text-[var(--color-zen-rose)]">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-semibold leading-none">{sessionCount}</div>
            <div className="text-[9px] font-semibold uppercase tracking-widest text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] mt-0.5">Pomodoros</div>
          </div>
        </div>
        <button
          onClick={() => setAutoStart(!autoStart)}
          className={`zen-card px-4 py-3 flex items-center gap-3 transition-all ${autoStart ? 'ring-2 ring-[var(--color-zen-teal)]/50' : ''}`}
        >
          <div className={`p-2 rounded-lg ${autoStart ? 'bg-[var(--color-zen-teal)]/10 text-[var(--color-zen-teal)]' : 'bg-[var(--color-zen-bg-light)] dark:bg-[var(--color-zen-bg-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]'}`}>
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold leading-none">Auto-start</div>
            <div className="text-[9px] font-semibold uppercase tracking-widest text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] mt-0.5">{autoStart ? 'On' : 'Off'}</div>
          </div>
        </button>
      </div>
    </div>
  );
}
