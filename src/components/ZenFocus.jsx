import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Brain, Volume2, VolumeX, Settings2 } from 'lucide-react';

const MODES = {
  focus: { label: 'Focus', minutes: 25, color: 'text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-accent-primary)]', bg: 'bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-card-dark)]/10 dark:bg-orange-500/10', border: 'border-blue-600 dark:border-orange-500' },
  short: { label: 'Short Break', minutes: 5, color: 'text-emerald-600 dark:text-emerald-500', bg: 'bg-emerald-600/10 dark:bg-emerald-500/10', border: 'border-emerald-600 dark:border-emerald-500' },
  long: { label: 'Long Break', minutes: 15, color: 'text-violet-600 dark:text-violet-500', bg: 'bg-violet-600/10 dark:bg-violet-500/10', border: 'border-violet-600 dark:border-violet-500' }
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
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
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
      audio.play().catch(e => console.log('Audio play failed'));
    }

    if (mode === 'focus') {
      setSessionCount(prev => prev + 1);
      const nextMode = (sessionCount + 1) % 4 === 0 ? 'long' : 'short';
      switchMode(nextMode);
    } else {
      switchMode('focus');
    }

    if (autoStart) {
      setTimeout(() => setIsActive(true), 1000);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].minutes * 60);
    setIsActive(false);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode].minutes * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-700">
      <div className="flex justify-center gap-4">
        {Object.entries(MODES).map(([key, data]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`px-6 py-2 rounded-md font-semibold text-sm transition-all ${
              mode === key 
                ? `${data.bg} ${data.color}` 
                : 'bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-card-dark)] text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)]0 hover:text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-muted-dark)] dark:hover:text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-muted-dark)] shadow-sm border border-stone-100 dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)]'
            }`}
          >
            {data.label}
          </button>
        ))}
      </div>

      <div className={`bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-card-dark)] border-4 ${MODES[mode].border} border-opacity-20 rounded-[4rem] p-16 shadow-2xl flex flex-col items-center space-y-10 transition-all duration-500`}>
        <div className="text-center space-y-2">
          <div className="text-4xl font-semibold text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)] tabular-nums tracking-tighter">
            {formatTime(timeLeft)}
          </div>
          <p className={`font-semibold uppercase tracking-[0.3em] text-sm ${MODES[mode].color}`}>
            {mode === 'focus' ? 'Deep Work Phase' : 'Resting Phase'}
          </p>
        </div>

        <div className="flex items-center gap-8">
          <button
            onClick={resetTimer}
            className="p-4 rounded-md bg-[var(--color-claude-bg-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-bg-dark)] text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-muted-dark)] hover:text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:hover:text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] hover:bg-[var(--color-claude-border-light)] dark:bg-[var(--color-claude-border-dark)] dark:hover:bg-[var(--color-claude-border-light)] dark:bg-[var(--color-claude-border-dark)] transition-all"
          >
            <RotateCcw className="w-8 h-8" />
          </button>

          <button
            onClick={toggleTimer}
            className={`w-24 h-24 rounded-md flex items-center justify-center transition-all active:scale-90 shadow-2xl ${
              isActive 
                ? 'bg-[var(--color-claude-border-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-border-dark)] text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)]' 
                : 'zen-btn-primary'
            }`}
          >
            {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-4 rounded-md bg-[var(--color-claude-bg-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-bg-dark)] text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-muted-dark)] hover:text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:hover:text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] hover:bg-[var(--color-claude-border-light)] dark:bg-[var(--color-claude-border-dark)] dark:hover:bg-[var(--color-claude-border-light)] dark:bg-[var(--color-claude-border-dark)] transition-all"
          >
            {soundEnabled ? <Volume2 className="w-8 h-8" /> : <VolumeX className="w-8 h-8" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-card-dark)]/50 border border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] rounded-md p-6 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-card-dark)]/10 dark:bg-orange-500/10 rounded-md text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-accent-primary)]">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)]">{sessionCount}</div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)]0">Total Pomodoros</div>
          </div>
        </div>

        <button
          onClick={() => setAutoStart(!autoStart)}
          className={`bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-card-dark)]/50 border rounded-md p-6 flex items-center justify-between transition-all shadow-sm ${autoStart ? 'border-blue-600/50 dark:border-orange-500/50' : 'border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)]'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-md ${autoStart ? 'bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-card-dark)]/20 dark:bg-orange-500/20 text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)]' : 'bg-[var(--color-claude-bg-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-bg-dark)] text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)]'}`}>
              <Settings2 className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className={`text-sm font-semibold ${autoStart ? 'text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)]' : 'text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)]0'}`}>Auto-Transition</div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-muted-dark)]">{autoStart ? 'Enabled' : 'Disabled'}</div>
            </div>
          </div>
          <div className={`w-10 h-6 rounded-md p-1 transition-all ${autoStart ? 'bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-card-dark)]' : 'bg-[var(--color-claude-border-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-border-dark)]'}`}>
            <div className={`w-4 h-4 bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-card-dark)] rounded-md transition-all ${autoStart ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </button>
      </div>
    </div>
  );
}
