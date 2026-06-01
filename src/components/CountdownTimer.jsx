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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Project Countdown</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Set a target date and time for your next milestone.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="datetime-local"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            disabled={isActive}
            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50 dark:text-white"
          />
          <div className="flex gap-4">
            <button
              onClick={toggleTimer}
              disabled={!targetDate}
              className={`flex-1 md:flex-none px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                isActive 
                  ? 'bg-red-600/10 border-2 border-red-500/50 text-red-600 dark:text-red-500 hover:bg-red-600/20' 
                  : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/30'
              }`}
            >
              {isActive ? <><Square className="w-5 h-5 fill-current" /> Stop</> : <><Play className="w-5 h-5 fill-current" /> Start</>}
            </button>
            <button
              onClick={resetTimer}
              className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
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
            <div key={idx} className="bg-slate-50 dark:bg-slate-950 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800/50 flex flex-col items-center justify-center space-y-2">
              <span className="text-4xl font-black text-slate-900 dark:text-slate-100 tabular-nums">{item.value}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500/70">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
