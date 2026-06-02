import React, { useState, useEffect } from 'react';
import { Clock, Info } from 'lucide-react';
import { format } from 'date-fns';

export default function ZenClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 100); // 100ms for smoother hand movement
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  // Degrees for analog hands
  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDeg = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-claude-accent-primary)]">Temporal Zen</h3>
        <p className="text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)]0 dark:text-[var(--color-claude-text-dark)] max-w-md mx-auto">
          Watch time flow. The pendulum swings to the rhythm of seconds, grounding you in the present.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-16 md:gap-24">
        {/* Digital Section */}
        <div className="bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-card-dark)] border border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] rounded-[3rem] p-10 md:p-16 shadow-2xl flex flex-col items-center justify-center space-y-4 min-w-[320px]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-muted-dark)]">Current Time</div>
          <div className="text-base md:text-5xl font-semibold text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)] tabular-nums tracking-tighter">
            {format(time, 'HH:mm')}
            <span className="text-[var(--color-claude-accent-primary)] ml-1 opacity-80">{format(time, ':ss')}</span>
          </div>
          <div className="text-sm font-semibold text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)]0 uppercase tracking-widest">
            {format(time, 'EEEE, MMMM do')}
          </div>
        </div>

        {/* Analog Section with Pendulum */}
        <div className="flex flex-col items-center">
          {/* Clock Face */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-bg-dark)] rounded-md border-8 border-stone-100 dark:border-stone-900 shadow-2xl flex items-center justify-center z-10">
            {/* Center Point */}
            <div className="absolute w-4 h-4 bg-orange-500 rounded-md z-40 shadow-sm" />
            
            {/* Hour Hand */}
            <div 
              className="absolute w-1.5 h-20 md:h-24 bg-[var(--color-claude-border-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-border-dark)] rounded-md origin-bottom transition-all duration-300 ease-out"
              style={{ transform: `translateY(-50%) rotate(${hourDeg}deg)` }}
            />
            
            {/* Minute Hand */}
            <div 
              className="absolute w-1 h-28 md:h-32 bg-stone-600 dark:bg-stone-400 rounded-md origin-bottom transition-all duration-300 ease-out"
              style={{ transform: `translateY(-50%) rotate(${minuteDeg}deg)` }}
            />
            
            {/* Second Hand */}
            <div 
              className="absolute w-0.5 h-32 md:h-36 bg-orange-500 rounded-md origin-bottom transition-all duration-100 ease-linear"
              style={{ transform: `translateY(-50%) rotate(${secondDeg}deg)` }}
            />

            {/* Tick Marks (Minimalist) */}
            {[...Array(12)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-3 bg-[var(--color-claude-border-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-border-dark)]"
                style={{ transform: `rotate(${i * 30}deg) translateY(-110px) translateY(${i % 3 === 0 ? '-4px' : '0'})`, height: i % 3 === 0 ? '12px' : '6px', width: i % 3 === 0 ? '2px' : '1px' }}
              />
            ))}
          </div>

          {/* Pendulum Base & Rod */}
          <div className="relative flex flex-col items-center mt-[-4px]">
            {/* Pendulum Swing Component */}
            <div className="animate-zen-pendulum origin-top flex flex-col items-center">
               <div className="w-1 h-32 md:h-40 bg-gradient-to-b from-stone-200 to-stone-400 dark:from-stone-900 dark:to-stone-700" />
               <div className="w-10 h-10 md:w-14 md:h-10 bg-stone-400 dark:bg-[var(--color-claude-bg-dark)] rounded-md border-4 border-stone-100 dark:border-stone-900 shadow-sm flex items-center justify-center">
                 <div className="w-2 h-2 bg-orange-500 rounded-md animate-pulse" />
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-card-dark)]/5 dark:bg-blue-950/20 border border-orange-500/20 rounded-md p-6 flex items-start gap-4">
        <Info className="w-6 h-6 text-[var(--color-claude-accent-primary)] mt-1 shrink-0" />
        <p className="text-sm text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-muted-dark)] leading-relaxed">
          <strong>Zen Insight:</strong> The pendulum completes a full swing every 2 seconds. In many meditative traditions, observing the rhythmic movement of time helps reduce cognitive load and brings the observer into a state of "Flow".
        </p>
      </div>
    </div>
  );
}
