import React, { useState, useEffect } from 'react';
import { Plus, X, Globe } from 'lucide-react';

const ZONES = [
  { city: 'Sydney', tz: 'Australia/Sydney' },
  { city: 'Tokyo', tz: 'Asia/Tokyo' },
  { city: 'Dhaka', tz: 'Asia/Dhaka' },
  { city: 'Dubai', tz: 'Asia/Dubai' },
  { city: 'London', tz: 'Europe/London' },
  { city: 'New York', tz: 'America/New_York' },
  { city: 'Los Angeles', tz: 'America/Los_Angeles' },
  { city: 'Berlin', tz: 'Europe/Berlin' },
  { city: 'Singapore', tz: 'Asia/Singapore' },
  { city: 'Auckland', tz: 'Pacific/Auckland' },
];

export default function ZenWorldClock() {
  const [now, setNow] = useState(new Date());
  const [cities, setCities] = useState(() => {
    const saved = localStorage.getItem('zen_worldclock');
    return saved ? JSON.parse(saved) : ['Australia/Sydney', 'Asia/Dhaka', 'Europe/London', 'America/New_York'];
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { localStorage.setItem('zen_worldclock', JSON.stringify(cities)); }, [cities]);

  const localOffset = -now.getTimezoneOffset() / 60;
  const tzInfo = (tz) => {
    const t = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now);
    const day = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', day: 'numeric', month: 'short' }).format(now);
    const hour = +new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', hour12: false }).format(now) % 24;
    const offMin = (() => {
      const dt = new Date(now.toLocaleString('en-US', { timeZone: tz }));
      const utc = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
      return Math.round((dt - utc) / 60000 / 60 * 10) / 10;
    })();
    return { t, day, hour, diff: offMin - localOffset };
  };

  const available = ZONES.filter((z) => !cities.includes(z.tz));

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="space-y-3">
        {cities.map((tz) => {
          const z = ZONES.find((x) => x.tz === tz) || { city: tz.split('/').pop().replace('_', ' '), tz };
          const info = tzInfo(tz);
          const night = info.hour < 6 || info.hour >= 19;
          return (
            <div key={tz} className="zen-card px-5 py-4 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <span className="text-lg">{night ? '🌙' : '☀️'}</span>
                <div>
                  <div className="font-semibold text-sm text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">{z.city}</div>
                  <div className="text-[11px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
                    {info.day} · {info.diff === 0 ? 'same as you' : `${info.diff > 0 ? '+' : ''}${info.diff}h`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold tabular-nums text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">{info.t}</span>
                <button onClick={() => setCities(cities.filter((c) => c !== tz))}
                  className="opacity-0 group-hover:opacity-100 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:text-red-500 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {adding ? (
        <div className="zen-card p-3 flex flex-wrap gap-2">
          {available.length === 0 && <span className="text-xs text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] px-2">All cities added.</span>}
          {available.map((z) => (
            <button key={z.tz} onClick={() => { setCities([...cities, z.tz]); setAdding(false); }}
              className="px-3 py-1.5 zen-btn-secondary text-xs">{z.city}</button>
          ))}
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="w-full flex items-center justify-center gap-2 py-3 zen-btn-secondary text-xs">
          <Plus className="w-4 h-4" /> Add city
        </button>
      )}

      <p className="flex items-center justify-center gap-2 text-[11px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
        <Globe className="w-3 h-3" /> Offsets shown relative to your local time.
      </p>
    </div>
  );
}
