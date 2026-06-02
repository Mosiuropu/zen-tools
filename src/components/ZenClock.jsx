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
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-500">Temporal Zen</h3>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          Watch time flow. The pendulum swings to the rhythm of seconds, grounding you in the present.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-16 md:gap-24">
        {/* Digital Section */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] p-10 md:p-16 shadow-2xl flex flex-col items-center justify-center space-y-4 min-w-[320px]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-400">Current Time</div>
          <div className="text-base md:text-8xl font-semibold text-zinc-900 dark:text-zinc-50 tabular-nums tracking-tighter">
            {format(time, 'HH:mm')}
            <span className="text-blue-500 ml-1 opacity-80">{format(time, ':ss')}</span>
          </div>
          <div className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">
            {format(time, 'EEEE, MMMM do')}
          </div>
        </div>

        {/* Analog Section with Pendulum */}
        <div className="flex flex-col items-center">
          {/* Clock Face */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 bg-white dark:bg-zinc-950 rounded-md border-8 border-zinc-100 dark:border-slate-900 shadow-2xl flex items-center justify-center z-10">
            {/* Center Point */}
            <div className="absolute w-4 h-4 bg-blue-500 rounded-md z-40 shadow-sm" />
            
            {/* Hour Hand */}
            <div 
              className="absolute w-1.5 h-20 md:h-24 bg-slate-800 dark:bg-zinc-200 rounded-md origin-bottom transition-all duration-300 ease-out"
              style={{ transform: `translateY(-50%) rotate(${hourDeg}deg)` }}
            />
            
            {/* Minute Hand */}
            <div 
              className="absolute w-1 h-28 md:h-32 bg-slate-600 dark:bg-slate-400 rounded-md origin-bottom transition-all duration-300 ease-out"
              style={{ transform: `translateY(-50%) rotate(${minuteDeg}deg)` }}
            />
            
            {/* Second Hand */}
            <div 
              className="absolute w-0.5 h-32 md:h-36 bg-blue-500 rounded-md origin-bottom transition-all duration-100 ease-linear"
              style={{ transform: `translateY(-50%) rotate(${secondDeg}deg)` }}
            />

            {/* Tick Marks (Minimalist) */}
            {[...Array(12)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-3 bg-zinc-200 dark:bg-zinc-800"
                style={{ transform: `rotate(${i * 30}deg) translateY(-110px) translateY(${i % 3 === 0 ? '-4px' : '0'})`, height: i % 3 === 0 ? '12px' : '6px', width: i % 3 === 0 ? '2px' : '1px' }}
              />
            ))}
          </div>

          {/* Pendulum Base & Rod */}
          <div className="relative flex flex-col items-center mt-[-4px]">
            {/* Pendulum Swing Component */}
            <div className="animate-zen-pendulum origin-top flex flex-col items-center">
               <div className="w-1 h-32 md:h-40 bg-gradient-to-b from-slate-200 to-slate-400 dark:from-slate-900 dark:to-slate-700" />
               <div className="w-10 h-10 md:w-14 md:h-10 bg-slate-400 dark:bg-zinc-800 rounded-md border-4 border-zinc-100 dark:border-slate-900 shadow-sm flex items-center justify-center">
                 <div className="w-2 h-2 bg-blue-500 rounded-md animate-pulse" />
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/5 dark:bg-blue-950/20 border border-blue-500/20 rounded-md p-6 flex items-start gap-4">
        <Info className="w-6 h-6 text-blue-500 mt-1 shrink-0" />
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <strong>Zen Insight:</strong> The pendulum completes a full swing every 2 seconds. In many meditative traditions, observing the rhythmic movement of time helps reduce cognitive load and brings the observer into a state of "Flow".
        </p>
      </div>
    </div>
  );
}
