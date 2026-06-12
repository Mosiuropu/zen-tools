import React, { useState, useEffect } from 'react';
import {
  Clock, Timer, Watch, Globe, Play, Square, RotateCcw, Flag
} from 'lucide-react';
import { format, addDays } from 'date-fns';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function fmtStopwatch(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

// ===== Analog Clock Face =====
function AnalogClock({ time }) {
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();
  const secDeg = (seconds / 60) * 360;
  const minDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hrDeg = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 md:w-56 md:h-56">
      {/* Face */}
      <circle cx="100" cy="100" r="96" fill="none" stroke="var(--color-zen-border-light)" strokeWidth="2"
        className="dark:stroke-[var(--color-zen-border-dark)]" />
      {/* Hour markers */}
      {[...Array(12)].map((_, i) => {
        const ang = (i * 30 - 90) * Math.PI / 180;
        const r1 = i % 3 === 0 ? 78 : 83;
        const r2 = 90;
        return (
          <line key={i} x1={100 + r1 * Math.cos(ang)} y1={100 + r1 * Math.sin(ang)}
            x2={100 + r2 * Math.cos(ang)} y2={100 + r2 * Math.sin(ang)}
            stroke={i % 3 === 0 ? 'var(--color-zen-text-light)' : 'var(--color-zen-border-light)'}
            strokeWidth={i % 3 === 0 ? 2.5 : 1.2}
            className="dark:stroke-[var(--color-zen-text-dark)] dark:opacity-60"
          />
        );
      })}
      {/* Hour hand */}
      <line x1="100" y1="100" x2={100 + 45 * Math.cos((hrDeg - 90) * Math.PI / 180)}
        y2={100 + 45 * Math.sin((hrDeg - 90) * Math.PI / 180)}
        stroke="var(--color-zen-accent-primary-light)" strokeWidth="4" strokeLinecap="round"
        className="dark:stroke-[var(--color-zen-accent-primary-dark)]" />
      {/* Minute hand */}
      <line x1="100" y1="100" x2={100 + 65 * Math.cos((minDeg - 90) * Math.PI / 180)}
        y2={100 + 65 * Math.sin((minDeg - 90) * Math.PI / 180)}
        stroke="var(--color-zen-text-light)" strokeWidth="2.5" strokeLinecap="round"
        className="dark:stroke-[var(--color-zen-text-dark)]" />
      {/* Second hand */}
      <line x1="100" y1="100" x2={100 + 72 * Math.cos((secDeg - 90) * Math.PI / 180)}
        y2={100 + 72 * Math.sin((secDeg - 90) * Math.PI / 180)}
        stroke="#E74C3C" strokeWidth="1" strokeLinecap="round" />
      <circle cx="100" cy="100" r="4" fill="var(--color-zen-accent-primary-light)"
        className="dark:fill-[var(--color-zen-accent-primary-dark)]" />
    </svg>
  );
}

// ===== World Clock Subtab =====
function WorldClockTab() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);

  const zones = [
    { city: 'Local', tz: Intl.DateTimeFormat().resolvedOptions().timeZone },
    { city: 'London', tz: 'Europe/London' },
    { city: 'Dubai', tz: 'Asia/Dubai' },
    { city: 'Dhaka', tz: 'Asia/Dhaka' },
    { city: 'Tokyo', tz: 'Asia/Tokyo' },
    { city: 'New York', tz: 'America/New_York' },
  ];

  return (
    <div className="space-y-2">
      {zones.map(z => {
        const t = new Intl.DateTimeFormat('en-US', { timeZone: z.tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
        const day = new Intl.DateTimeFormat('en-US', { timeZone: z.tz, weekday: 'short' }).format(now);
        const h = +new Intl.DateTimeFormat('en-US', { timeZone: z.tz, hour: '2-digit', hour12: false }).format(now);
        const isNight = h < 6 || h >= 18;
        return (
          <div key={z.city} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[var(--color-zen-bg-light)] dark:bg-[var(--color-zen-bg-dark)]/50 border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)]">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{isNight ? '🌙' : '☀️'}</span>
              <div>
                <span className="text-xs font-semibold text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">{z.city}</span>
                <span className="text-[10px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] ml-2">{day}</span>
              </div>
            </div>
            <span className="text-lg font-semibold tabular-nums text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">{t}</span>
          </div>
        );
      })}
    </div>
  );
}

// ===== Sub-Tabs =====
function TimerTab() {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(minutes * 60);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let id;
    if (active && seconds > 0) {
      id = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0 && active) {
      setActive(false);
      new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {});
    }
    return () => clearInterval(id);
  }, [active, seconds]);

  const handleStart = () => { setSeconds(minutes * 60); setActive(true); };
  const pct = (seconds / (minutes * 60)) * 100;

  return (
    <div className="flex flex-col items-center space-y-4">
      {!active && (
        <div className="flex items-center gap-2">
          <button onClick={() => setMinutes(Math.max(1, minutes - 1))} className="w-8 h-8 rounded-lg zen-btn-secondary text-sm">-</button>
          <span className="text-xl font-semibold tabular-nums w-16 text-center text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">{minutes}:00</span>
          <button onClick={() => setMinutes(Math.min(99, minutes + 1))} className="w-8 h-8 rounded-lg zen-btn-secondary text-sm">+</button>
        </div>
      )}
      {active && (
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90">
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--color-zen-border-light)" strokeWidth="6"
              className="dark:stroke-[var(--color-zen-border-dark)]" />
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--color-zen-accent-primary-light)" strokeWidth="6"
              strokeDasharray={`${pct * 2.76} ${(100 - pct) * 2.76}`} strokeLinecap="round"
              className="dark:stroke-[var(--color-zen-accent-primary-dark)] transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold tabular-nums text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">
              {formatTime(seconds)}
            </span>
          </div>
        </div>
      )}
      <div className="flex gap-2">
        {!active ? (
          <button onClick={handleStart} className="flex items-center gap-1.5 px-4 py-2 zen-btn-primary text-xs">
            <Play className="w-3.5 h-3.5" /> Start
          </button>
        ) : (
          <button onClick={() => setActive(false)} className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-all">
            <Square className="w-3.5 h-3.5" /> Stop
          </button>
        )}
        <button onClick={() => { setActive(false); setSeconds(minutes * 60); }} className="flex items-center gap-1.5 px-4 py-2 zen-btn-secondary text-xs">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>
    </div>
  );
}

function StopwatchTab() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const startRef = React.useRef(0);
  const rafRef = React.useRef(0);

  useEffect(() => {
    if (running) {
      startRef.current = performance.now() - elapsed;
      const tick = () => {
        setElapsed(performance.now() - startRef.current);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);

  const fastest = laps.length > 1 ? Math.min(...laps.map(l => l.split)) : null;
  const slowest = laps.length > 1 ? Math.max(...laps.map(l => l.split)) : null;

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="text-2xl font-semibold tabular-nums text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">
        {fmtStopwatch(elapsed)}
      </div>
      <div className="flex gap-2">
        <button onClick={() => setRunning(r => !r)} className="flex items-center gap-1.5 px-4 py-2 zen-btn-primary text-xs">
          {running ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {running ? 'Stop' : elapsed ? 'Resume' : 'Start'}
        </button>
        <button onClick={running ? () => setLaps(l => [{ n: l.length + 1, t: elapsed, split: elapsed - (l[0]?.t || 0) }, ...l]) : () => { setElapsed(0); setLaps([]); }}
          className="flex items-center gap-1.5 px-4 py-2 zen-btn-secondary text-xs">
          {running ? <Flag className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
          {running ? 'Lap' : 'Reset'}
        </button>
      </div>
      {laps.length > 0 && (
        <div className="w-full max-h-32 overflow-y-auto space-y-1">
          {laps.map(l => (
            <div key={l.n} className="flex justify-between px-3 py-1.5 text-xs border-b border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)]/50">
              <span className="text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">Lap {l.n}</span>
              <span className={`font-medium ${l.split === fastest ? 'text-emerald-500' : l.split === slowest ? 'text-red-500' : 'text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]'}`}>
                {fmtStopwatch(l.split)}
              </span>
              <span className="text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">{fmtStopwatch(l.t)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== Main Clock Component =====
export default function ZenClock() {
  const [time, setTime] = useState(new Date());
  const [subTab, setSubTab] = useState('alarm');

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const subTabs = [
    { id: 'alarm', label: 'Clock', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'world', label: 'World', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'timer', label: 'Timer', icon: <Timer className="w-3.5 h-3.5" /> },
    { id: 'stopwatch', label: 'Stopwatch', icon: <Watch className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-up">
      {/* Sub tab navigation (Samsung OneUI style pill tabs) */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[var(--color-zen-bg-light)] dark:bg-[var(--color-zen-bg-dark)] border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)]">
          {subTabs.map(st => (
            <button key={st.id} onClick={() => setSubTab(st.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                subTab === st.id
                  ? 'bg-[var(--color-zen-accent-primary-light)] dark:bg-[var(--color-zen-accent-primary-dark)] text-white shadow-sm'
                  : 'text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:text-[var(--color-zen-text-light)] dark:hover:text-[var(--color-zen-text-dark)]'
              }`}>
              {st.icon}{st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clock Tab - Primary view with analog + digital */}
      {subTab === 'alarm' && (
        <div className="zen-card p-4 md:p-6 space-y-4">
          {/* Date Header */}
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
              {format(time, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {/* Analog clock */}
            <AnalogClock time={time} />

            {/* Digital time */}
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-semibold tabular-nums tracking-tight text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">
                {format(time, 'HH:mm')}
                <span className="text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)] text-2xl ml-1">
                  {format(time, ':ss')}
                </span>
              </div>
              <p className="text-xs text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] mt-1">
                {format(time, 'hh:mm a')} <span className="uppercase">{Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop()}</span>
              </p>
            </div>
          </div>

          {/* Alarm/Analog extras */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 text-center">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">Sunrise</p>
              <p className="text-sm font-semibold text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">
                {format(addDays(time, 1).setHours(6, 0, 0, 0) > time.getTime() ? new Date().setHours(6, 0, 0, 0) : addDays(time, 1).setHours(6, 0, 0, 0) > time.getTime() ? time.getTime() : addDays(time, 1).setHours(6, 0, 0, 0), 'HH:mm')}
              </p>
            </div>
            <div className="rounded-xl p-3 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800/30 text-center">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">Sunset</p>
              <p className="text-sm font-semibold text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">18:00</p>
            </div>
          </div>
        </div>
      )}

      {/* World Clock Tab */}
      {subTab === 'world' && (
        <div className="zen-card p-4">
          <WorldClockTab />
        </div>
      )}

      {/* Timer Tab */}
      {subTab === 'timer' && (
        <div className="zen-card p-4">
          <TimerTab />
        </div>
      )}

      {/* Stopwatch Tab */}
      {subTab === 'stopwatch' && (
        <div className="zen-card p-4">
          <StopwatchTab />
        </div>
      )}
    </div>
  );
}
