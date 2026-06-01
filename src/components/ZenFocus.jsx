import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Timer, Volume2, VolumeX, Settings2 } from 'lucide-react';

const MODES = {
  focus: { label: 'Focus', minutes: 25, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  short: { label: 'Short Break', minutes: 5, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  long: { label: 'Long Break', minutes: 15, color: 'text-violet-500', bg: 'bg-violet-500/10' }
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
            className={`px-6 py-2 rounded-2xl font-bold text-sm transition-all ${
              mode === key 
                ? `${data.bg} ${data.color}` 
                : 'bg-slate-900 text-slate-500 hover:text-slate-300'
            }`}
          >
            {data.label}
          </button>
        ))}
      </div>

      <div className={`bg-slate-900 border-4 ${MODES[mode].color.replace('text', 'border')} border-opacity-20 rounded-[4rem] p-16 shadow-2xl flex flex-col items-center space-y-10 transition-all duration-500`}>
        <div className="text-center space-y-2">
          <div className="text-9xl font-black text-white tabular-nums tracking-tighter">
            {formatTime(timeLeft)}
          </div>
          <p className={`font-bold uppercase tracking-[0.3em] text-sm ${MODES[mode].color}`}>
            {mode === 'focus' ? 'Deep Work Phase' : 'Resting Phase'}
          </p>
        </div>

        <div className="flex items-center gap-8">
          <button
            onClick={resetTimer}
            className="p-4 rounded-3xl bg-slate-950 text-slate-600 hover:text-slate-100 hover:bg-slate-800 transition-all"
          >
            <RotateCcw className="w-8 h-8" />
          </button>

          <button
            onClick={toggleTimer}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-2xl ${
              isActive 
                ? 'bg-slate-800 text-white' 
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/40'
            }`}
          >
            {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-4 rounded-3xl bg-slate-950 text-slate-600 hover:text-slate-100 hover:bg-slate-800 transition-all"
          >
            {soundEnabled ? <Volume2 className="w-8 h-8" /> : <VolumeX className="w-8 h-8" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{sessionCount}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Pomodoros</div>
          </div>
        </div>

        <button
          onClick={() => setAutoStart(!autoStart)}
          className={`bg-slate-900/50 border rounded-3xl p-6 flex items-center justify-between transition-all ${autoStart ? 'border-blue-500/50' : 'border-slate-800'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${autoStart ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-950 text-slate-700'}`}>
              <Settings2 className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className={`text-sm font-bold ${autoStart ? 'text-white' : 'text-slate-500'}`}>Auto-Transition</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{autoStart ? 'Enabled' : 'Disabled'}</div>
            </div>
          </div>
          <div className={`w-10 h-6 rounded-full p-1 transition-all ${autoStart ? 'bg-blue-600' : 'bg-slate-800'}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-all ${autoStart ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </button>
      </div>
    </div>
  );
}
