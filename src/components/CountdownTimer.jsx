import React, { useState, useEffect } from 'react';
import { Timer, Play, Square, RefreshCcw } from 'lucide-react';

export default function CountdownTimer() {
  const [targetDate, setTargetDate] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && targetDate) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const target = new Date(targetDate).getTime();
        const difference = target - now;

        if (difference <= 0) {
          clearInterval(interval);
          setIsActive(false);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        } else {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
          });
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, targetDate]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in zoom-in-95 duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
        <div className="space-y-4 text-center">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Project Countdown</h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">Set a target date and time for your next milestone.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="datetime-local"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            disabled={isActive}
            className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100/50 transition-all disabled:opacity-50 dark:text-zinc-50"
          />
          <div className="flex gap-4">
            <button
              onClick={toggleTimer}
              disabled={!targetDate}
              className={`flex-1 md:flex-none px-8 py-4 rounded-md font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                isActive 
                  ? 'bg-red-600/10 border-2 border-red-500/50 text-red-600 dark:text-red-500 hover:bg-red-600/20' 
                  : 'bg-zinc-900 text-white hover:bg-blue-500 shadow-sm shadow-blue-900/30'
              }`}
            >
              {isActive ? <><Square className="w-5 h-5 fill-current" /> Stop</> : <><Play className="w-5 h-5 fill-current" /> Start</>}
            </button>
            <button
              onClick={resetTimer}
              className="p-4 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-slate-100 hover:bg-zinc-200 dark:hover:bg-slate-700 transition-all"
            >
              <RefreshCcw className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Days', value: timeLeft?.days ?? '--' },
            { label: 'Hours', value: timeLeft?.hours ?? '--' },
            { label: 'Minutes', value: timeLeft?.minutes ?? '--' },
            { label: 'Seconds', value: timeLeft?.seconds ?? '--' }
          ].map((item, idx) => (
            <div key={idx} className="bg-zinc-50 dark:bg-zinc-950 rounded-[2rem] p-6 border border-zinc-200 dark:border-zinc-800/50 flex flex-col items-center justify-center space-y-2">
              <span className="text-sm font-semibold text-zinc-900 dark:text-slate-100 tabular-nums">{item.value}</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-900 dark:text-blue-500/70">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
