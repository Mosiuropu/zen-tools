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
      <div className="bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-card-dark)] border border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] rounded-[2.5rem] p-10 shadow-2xl space-y-8">
        <div className="space-y-4 text-center">
          <h2 className="text-base font-semibold text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)] tracking-tight">Project Countdown</h2>
          <p className="text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)]0 dark:text-[var(--color-claude-text-dark)] font-medium">Set a target date and time for your next milestone.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="datetime-local"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            disabled={isActive}
            className="flex-1 bg-[var(--color-claude-bg-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-bg-dark)] border border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] rounded-md px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100/50 transition-all disabled:opacity-50 dark:text-[var(--color-claude-text-dark)]"
          />
          <div className="flex gap-4">
            <button
              onClick={toggleTimer}
              disabled={!targetDate}
              className={`flex-1 md:flex-none px-8 py-4 rounded-md font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                isActive 
                  ? 'bg-red-600/10 border-2 border-red-500/50 text-red-600 dark:text-red-500 hover:bg-red-600/20' 
                  : 'zen-btn-primary'
              }`}
            >
              {isActive ? <><Square className="w-5 h-5 fill-current" /> Stop</> : <><Play className="w-5 h-5 fill-current" /> Start</>}
            </button>
            <button
              onClick={resetTimer}
              className="p-4 rounded-md bg-[var(--color-claude-border-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-border-dark)] text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)]0 dark:text-[var(--color-claude-text-dark)] hover:text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:hover:text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] hover:bg-[var(--color-claude-border-light)] dark:bg-[var(--color-claude-border-dark)] dark:hover:bg-[var(--color-claude-border-light)] dark:hover:bg-[var(--color-claude-border-dark)] transition-all"
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
            <div key={idx} className="bg-[var(--color-claude-bg-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-bg-dark)] rounded-[2rem] p-6 border border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)]/50 flex flex-col items-center justify-center space-y-2">
              <span className="text-sm font-semibold text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)] tabular-nums">{item.value}</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-accent-primary)]/70">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
