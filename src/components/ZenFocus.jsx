import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Brain, Volume2, VolumeX } from 'lucide-react';

const MODES = {
  focus: { label: 'Focus', minutes: 25, color: '#E74C3C', text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/15' },
  short: { label: 'Break', minutes: 5, color: '#10b981', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/15' },
  long: { label: 'Long', minutes: 15, color: '#8b5cf6', text: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/15' },
};

function TomatoSVG({ size, color, pct }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" className="drop-shadow-md">
      {/* Background tomato */}
      <ellipse cx="80" cy="80" rx="65" ry="60" fill={color} opacity="0.15" />
      {/* Progress ring */}
      <circle cx="80" cy="80" r="56" fill="none" stroke="var(--color-zen-border-light)" strokeWidth="6"
        className="dark:stroke-[var(--color-zen-border-dark)]" />
      <circle cx="80" cy="80" r="56" fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${(pct / 100) * 352} ${352 - (pct / 100) * 352}`} strokeLinecap="round"
        className="transition-all duration-1000 ease-linear -rotate-90 origin-center"
        style={{ transformOrigin: '80px 80px' }} />
      {/* Tomato top stem */}
      <path d="M75 5 Q80 -10 85 5 Q80 0 75 5Z" fill={color} />
      <path d="M72 10 L88 10" stroke="#2d5016" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function ZenFocus() {
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(() => {
    const saved = localStorage.getItem('zen_focus_sessions');
    return saved ? parseInt(saved) : 0;
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoStart, setAutoStart] = useState(false);
  const timerRef = useRef(null);
  const totalTime = MODES[mode].minutes * 60;

  useEffect(() => {
    localStorage.setItem('zen_focus_sessions', sessionCount.toString());
  }, [sessionCount]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(p => p - 1), 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    clearInterval(timerRef.current);
    if (soundEnabled) {
      new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {});
    }
    let nextMode;
    if (mode === 'focus') {
      setSessionCount(p => p + 1);
      nextMode = (sessionCount + 1) % 4 === 0 ? 'long' : 'short';
    } else {
      nextMode = 'focus';
    }
    switchMode(nextMode);
    if (autoStart) {
      setTimeout(() => setIsActive(true), 1000);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].minutes * 60);
    setIsActive(false);
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const pct = ((totalTime - timeLeft) / totalTime) * 100;
  const currentMode = MODES[mode];

  return (
    <div className="max-w-md mx-auto flex flex-col items-center space-y-4 animate-fade-up">
      {/* Mode pills */}
      <div className="flex gap-1.5 p-1 rounded-xl bg-[var(--color-zen-bg-light)] dark:bg-[var(--color-zen-bg-dark)] border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)]">
        {Object.entries(MODES).map(([key, data]) => (
          <button key={key} onClick={() => switchMode(key)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              mode === key ? `${data.bg} ${data.text} shadow-sm` : 'text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:text-[var(--color-zen-text-light)] dark:hover:text-[var(--color-zen-text-dark)]'
            }`}>
            {data.label}
          </button>
        ))}
      </div>

      {/* Tomato timer */}
      <div className="zen-card p-6 flex flex-col items-center w-full max-w-sm">
        <div className="relative">
          <TomatoSVG size={160} color={currentMode.color} pct={pct} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-3xl font-semibold tabular-nums tracking-tight ${currentMode.text}`}>
                {formatTime(timeLeft)}
              </div>
              <p className={`text-[9px] font-semibold uppercase tracking-[0.2em] mt-0.5 ${currentMode.text}`}>
                {mode === 'focus' ? 'Focus Phase' : mode === 'short' ? 'Short Break' : 'Long Break'}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-4">
          <button onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg zen-btn-secondary text-xs">
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => { setIsActive(!isActive); }}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-md ${
              isActive ? 'bg-stone-200 dark:bg-stone-700 text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]' : 'text-white shadow-lg'
            }`}
            style={!isActive ? { backgroundColor: currentMode.color } : {}}>
            {isActive ? <><Pause className="w-3.5 h-3.5" /> Pause</> : <><Play className="w-3.5 h-3.5 fill-current" /> {timeLeft < totalTime ? 'Resume' : 'Start'}</>}
          </button>
          <button onClick={() => { setIsActive(false); setTimeLeft(totalTime); }}
            className="p-2 rounded-lg zen-btn-secondary text-xs">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] w-full justify-center">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
            <Brain className="w-3.5 h-3.5" />
            <span className="font-semibold">{sessionCount} sessions</span>
          </div>
          <button onClick={() => setAutoStart(!autoStart)}
            className={`px-2 py-1 rounded-lg text-[9px] font-semibold border transition-all ${
              autoStart
                ? 'bg-[var(--color-zen-accent-primary-light)]/10 dark:bg-[var(--color-zen-accent-primary-dark)]/10 border-[var(--color-zen-accent-primary-light)] dark:border-[var(--color-zen-accent-primary-dark)] text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]'
                : 'border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]'
            }`}>
            Auto {autoStart ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
}
