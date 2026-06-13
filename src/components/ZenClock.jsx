import React, { useState, useEffect, useRef } from 'react';
import { AlarmClock, Plus, Trash2, Globe, BellRing, X } from 'lucide-react';
import { format } from 'date-fns';

const WORLD_CITIES = [
  { city: 'Sydney', tz: 'Australia/Sydney' },
  { city: 'Dhaka', tz: 'Asia/Dhaka' },
  { city: 'London', tz: 'Europe/London' },
  { city: 'New York', tz: 'America/New_York' },
  { city: 'Tokyo', tz: 'Asia/Tokyo' },
];

function cityTime(tz, date) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', timeZone: tz,
  }).format(date);
}

function cityOffsetLabel(tz, date) {
  const local = new Date(date.toLocaleString('en-US'));
  const remote = new Date(date.toLocaleString('en-US', { timeZone: tz }));
  const diff = Math.round((remote - local) / 3600000);
  if (diff === 0) return 'Same time';
  return `${diff > 0 ? '+' : ''}${diff}h`;
}

export default function ZenClock() {
  const [time, setTime] = useState(new Date());
  const [alarms, setAlarms] = useState(() => {
    try { return JSON.parse(localStorage.getItem('zen_alarms')) || []; } catch { return []; }
  });
  const [newAlarm, setNewAlarm] = useState('');
  const [ringing, setRinging] = useState(null);
  const firedRef = useRef(new Set());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 250);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    localStorage.setItem('zen_alarms', JSON.stringify(alarms));
  }, [alarms]);

  // alarm check
  useEffect(() => {
    const hm = format(time, 'HH:mm');
    alarms.forEach((a) => {
      if (a.enabled && a.time === hm && !firedRef.current.has(`${a.id}-${hm}`)) {
        firedRef.current.add(`${a.id}-${hm}`);
        setRinging(a);
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play().catch(() => {});
        } catch {}
      }
    });
  }, [time, alarms]);

  const addAlarm = () => {
    if (!newAlarm) return;
    setAlarms((prev) => [...prev, { id: Date.now(), time: newAlarm, enabled: true }]);
    setNewAlarm('');
  };

  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  const hand = (deg, lengthPct, width, color, extraClass = '') => (
    <div
      className={`absolute left-1/2 bottom-1/2 rounded-full ${color} ${extraClass}`}
      style={{
        width,
        height: `${lengthPct}%`,
        transform: `translateX(-50%) rotate(${deg}deg)`,
        transformOrigin: '50% 100%',
      }}
    />
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
      {/* Ringing banner */}
      {ringing && (
        <div className="zen-card p-4 flex items-center justify-between border-2 border-[var(--color-zen-rose)] bg-[var(--color-zen-rose)]/10">
          <div className="flex items-center gap-3">
            <BellRing className="w-5 h-5 text-[var(--color-zen-rose)] animate-pulse" />
            <span className="font-semibold text-sm">Alarm — {ringing.time}</span>
          </div>
          <button onClick={() => setRinging(null)} className="zen-btn-secondary px-4 py-1.5 text-xs flex items-center gap-1.5">
            <X className="w-3.5 h-3.5" /> Dismiss
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 items-stretch">
        {/* Analog + digital */}
        <div className="zen-card p-8 flex flex-col items-center justify-center gap-6">
          {/* Clock face */}
          <div className="relative w-60 h-60 md:w-72 md:h-72 rounded-full bg-[var(--color-zen-bg-light)] dark:bg-[var(--color-zen-bg-dark)] border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] shadow-inner">
            {/* ticks */}
            {[...Array(60)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0"
                style={{ transform: `rotate(${i * 6}deg)` }}
              >
                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-1.5 rounded-full ${i % 5 === 0 ? 'bg-[var(--color-zen-text-light)] dark:bg-[var(--color-zen-text-dark)]' : 'bg-[var(--color-zen-border-light)] dark:bg-[var(--color-zen-border-dark)]'}`}
                  style={{ width: i % 5 === 0 ? 3 : 1, height: i % 5 === 0 ? 12 : 6 }}
                />
              </div>
            ))}
            {/* numerals */}
            {[12, 3, 6, 9].map((n, i) => {
              const pos = [
                { top: '8%', left: '50%', tx: '-50%' },
                { top: '50%', left: '92%', tx: '-100%' },
                { top: '88%', left: '50%', tx: '-50%' },
                { top: '50%', left: '8%', tx: '0%' },
              ][i];
              return (
                <span
                  key={n}
                  className="absolute text-sm font-semibold text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]"
                  style={{ top: pos.top, left: pos.left, transform: `translate(${pos.tx}, -50%)` }}
                >
                  {n}
                </span>
              );
            })}
            {/* hands — anchored bottom-center at clock center */}
            {hand(hours * 30, 26, 5, 'bg-[var(--color-zen-text-light)] dark:bg-[var(--color-zen-text-dark)]')}
            {hand(minutes * 6, 36, 3, 'bg-[var(--color-zen-text-light)] dark:bg-[var(--color-zen-text-dark)] opacity-80')}
            {hand(seconds * 6, 42, 1.5, 'bg-[var(--color-zen-rose)]')}
            {/* hub */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[var(--color-zen-rose)] border-2 border-white dark:border-[var(--color-zen-card-dark)] z-10" />
          </div>

          <div className="text-center">
            <div className="text-4xl md:text-5xl font-semibold tabular-nums tracking-tight">
              {format(time, 'HH:mm')}
              <span className="text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)] text-2xl md:text-3xl ml-1">{format(time, ':ss')}</span>
            </div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] mt-1">
              {format(time, 'EEEE, MMMM do yyyy')}
            </div>
          </div>
        </div>

        {/* Alarms */}
        <div className="zen-card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <AlarmClock className="w-4 h-4 text-[var(--color-zen-amber)]" />
            <h4 className="text-sm font-semibold">Alarms</h4>
          </div>

          <div className="flex gap-2">
            <input
              type="time"
              value={newAlarm}
              onChange={(e) => setNewAlarm(e.target.value)}
              className="zen-input flex-1"
            />
            <button onClick={addAlarm} className="zen-btn-primary px-4 py-2 text-sm flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto max-h-64">
            {alarms.length === 0 && (
              <p className="text-xs text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] text-center py-6">No alarms set. Add one above.</p>
            )}
            {alarms.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-zen-bg-light)] dark:bg-[var(--color-zen-bg-dark)] border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)]">
                <span className={`text-xl font-semibold tabular-nums ${a.enabled ? '' : 'opacity-40 line-through'}`}>{a.time}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAlarms((prev) => prev.map((x) => x.id === a.id ? { ...x, enabled: !x.enabled } : x))}
                    className={`w-10 h-6 rounded-full p-0.5 transition-all ${a.enabled ? 'bg-[var(--color-zen-teal)]' : 'bg-[var(--color-zen-border-light)] dark:bg-[var(--color-zen-border-dark)]'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-all ${a.enabled ? 'translate-x-4' : ''}`} />
                  </button>
                  <button
                    onClick={() => setAlarms((prev) => prev.filter((x) => x.id !== a.id))}
                    className="p-1.5 rounded-lg text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:text-[var(--color-zen-rose)] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* World clock strip */}
      <div className="zen-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-[var(--color-zen-sky)]" />
          <h4 className="text-sm font-semibold">Around the world</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {WORLD_CITIES.map((c) => (
            <div key={c.tz} className="rounded-xl px-4 py-3 bg-[var(--color-zen-bg-light)] dark:bg-[var(--color-zen-bg-dark)] border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] text-center">
              <div className="text-lg font-semibold tabular-nums">{cityTime(c.tz, time)}</div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">{c.city}</div>
              <div className="text-[10px] text-[var(--color-zen-sky)]">{cityOffsetLabel(c.tz, time)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
