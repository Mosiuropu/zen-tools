import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Plus, Trash2, CalendarDays, List, LayoutGrid, Clock, Sparkles, Download, Upload, AlertCircle } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, differenceInDays } from 'date-fns';

const EVENT_COLORS = [
  { bg: '#4F6A33', light: 'rgba(79, 106, 51, 0.12)' },
  { bg: '#B8634A', light: 'rgba(184, 99, 74, 0.12)' },
  { bg: '#4A7B9D', light: 'rgba(74, 123, 157, 0.12)' },
  { bg: '#9B6B9E', light: 'rgba(155, 107, 158, 0.12)' },
  { bg: '#C8914A', light: 'rgba(200, 145, 74, 0.12)' },
  { bg: '#6B8E7B', light: 'rgba(107, 142, 123, 0.12)' },
  { bg: '#A05A6E', light: 'rgba(160, 90, 110, 0.12)' },
  { bg: '#5A7B8C', light: 'rgba(90, 123, 140, 0.12)' },
];

const VIEWS = [
  { id: 'day', label: 'Day', icon: Clock },
  { id: 'week', label: 'Week', icon: CalendarDays },
  { id: 'month', label: 'Month', icon: List },
  { id: 'year', label: 'Year', icon: LayoutGrid },
];

function getEventsForView(events, view, referenceDate) {
  const ref = new Date(referenceDate);
  let start, end;
  switch (view) {
    case 'day':
      start = new Date(ref);
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(end.getDate() + 1);
      break;
    case 'week':
      start = startOfWeek(ref, { weekStartsOn: 1 });
      end = endOfWeek(ref, { weekStartsOn: 1 });
      break;
    case 'month':
      start = startOfMonth(ref);
      end = endOfMonth(ref);
      break;
    case 'year':
      start = startOfYear(ref);
      end = endOfYear(ref);
      break;
    default:
      return [];
  }

  return events.filter(e => {
    const d = new Date(e.date);
    return d >= start && d < end;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
}

function getGroupedEvents(events, view) {
  const groups = {};
  events.forEach(e => {
    let key;
    const d = new Date(e.date);
    switch (view) {
      case 'day':
        key = format(d, 'yyyy-MM-dd');
        break;
      case 'week':
        key = `Week ${format(d, 'w')}, ${format(d, 'yyyy')}`;
        break;
      case 'month':
        key = format(d, 'MMMM yyyy');
        break;
      case 'year':
        key = format(d, 'yyyy');
        break;
      default:
        key = format(d, 'yyyy-MM-dd');
    }
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  });
  return groups;
}

export default function ZenEvents() {
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('zen_events');
      return saved ? JSON.parse(saved) : [
        { id: '1', date: new Date().toISOString().split('T')[0], title: 'Started using Zen Tools', color: 0 },
        { id: '2', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], title: 'First milestone achieved', color: 2 },
      ];
    } catch { return []; }
  });
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newColor, setNewColor] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [importMessage, setImportMessage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('zen_events', JSON.stringify(events));
  }, [events]);

  const filteredEvents = useMemo(() => getEventsForView(events, view, currentDate), [events, view, currentDate]);
  const groupedEvents = useMemo(() => getGroupedEvents(filteredEvents, view), [filteredEvents, view]);

  const addEvent = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setEvents([...events, {
      id: crypto.randomUUID(),
      date: newDate,
      title: newTitle.trim(),
      color: newColor,
    }]);
    setNewTitle('');
    setNewDate(new Date().toISOString().split('T')[0]);
    setShowForm(false);
  };

  const removeEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const navigateView = (direction) => {
    const d = new Date(currentDate);
    switch (view) {
      case 'day': d.setDate(d.getDate() + direction); break;
      case 'week': d.setDate(d.getDate() + direction * 7); break;
      case 'month': d.setMonth(d.getMonth() + direction); break;
      case 'year': d.setFullYear(d.getFullYear() + direction); break;
    }
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  const getViewTitle = () => {
    const d = new Date(currentDate);
    switch (view) {
      case 'day': return format(d, 'EEEE, d MMMM yyyy');
      case 'week': return `Week ${format(d, 'w')} — ${format(d, 'MMMM yyyy')}`;
      case 'month': return format(d, 'MMMM yyyy');
      case 'year': return format(d, 'yyyy');
    }
  };

  const canNavigateForward = () => {
    const d = new Date(currentDate);
    const today = new Date();
    let viewEnd;
    switch (view) {
      case 'day': viewEnd = new Date(d); viewEnd.setHours(23, 59, 59, 999); return viewEnd < today;
      case 'week': viewEnd = endOfWeek(d, { weekStartsOn: 1 }); return viewEnd < today;
      case 'month': viewEnd = endOfMonth(d); return viewEnd < today;
      case 'year': viewEnd = endOfYear(d); return viewEnd < today;
    }
    return false;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header Controls */}
      <div className="zen-card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* View switcher */}
          <div className="flex items-center gap-1 bg-[var(--color-zen-bg-light)] dark:bg-[var(--color-zen-bg-dark)] rounded-md p-0.5 border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] w-fit">
            {VIEWS.map(v => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] font-medium transition-all ${
                  view === v.id
                    ? 'bg-[var(--color-zen-card-light)] dark:bg-[var(--color-zen-card-dark)] shadow-sm text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]'
                    : 'text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:text-[var(--color-zen-text-light)] dark:hover:text-[var(--color-zen-text-dark)]'
                }`}
              >
                <v.icon className="w-3 h-3" />
                {v.label}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button onClick={() => navigateView(-1)} className="p-1.5 rounded-md text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] transition-all text-xs font-medium">◀ Prev</button>
              <button
                onClick={() => setCurrentDate(new Date().toISOString().split('T')[0])}
                className="px-2 py-1 rounded-md text-[10px] font-semibold text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] transition-all"
              >
                Today
              </button>
              {canNavigateForward() && (
                <button onClick={() => navigateView(1)} className="p-1.5 rounded-md text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] transition-all text-xs font-medium">Next ▶</button>
              )}
            </div>
          </div>

          {/* Add Event */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 zen-btn-primary px-3 py-1.5 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Event
          </button>
        </div>

        {/* View title */}
        <div className="mt-3 text-center">
          <h3 className="text-base font-semibold text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">{getViewTitle()}</h3>
          <p className="text-[11px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} in this {view}
          </p>
        </div>

        {/* Add Event Form */}
        {showForm && (
          <form onSubmit={addEvent} className="mt-4 pt-4 border-t border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)]">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Event title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="zen-input flex-1 text-sm"
                required
                autoFocus
              />
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="zen-input text-sm w-full sm:w-auto"
              />
              <div className="flex items-center gap-1.5">
                {EVENT_COLORS.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setNewColor(i)}
                    className={`w-5 h-5 rounded-full transition-all ${newColor === i ? 'scale-125 ring-2 ring-offset-1 ring-[var(--color-zen-accent-primary-light)] dark:ring-[var(--color-zen-accent-primary-dark)] dark:ring-offset-[var(--color-zen-bg-dark)]' : 'opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: c.bg }}
                  />
                ))}
              </div>
              <button type="submit" className="zen-btn-primary px-3 py-1.5 text-xs whitespace-nowrap">Add</button>
            </div>
          </form>
        )}
      </div>

      {/* Timeline Content */}
      {filteredEvents.length === 0 ? (
        <div className="zen-card p-10 text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-3 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] opacity-40" />
          <p className="text-sm text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">No events in this {view}. Add one to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedEvents).map(([groupKey, groupEvents]) => (
            <div key={groupKey} className="zen-card overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] bg-[var(--color-zen-bg-light)]/50 dark:bg-[var(--color-zen-bg-dark)]/50">
                <h4 className="text-xs font-semibold text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] uppercase tracking-wider">{groupKey}</h4>
              </div>
              <div className="divide-y divide-[var(--color-zen-border-light)] dark:divide-[var(--color-zen-border-dark)]">
                {groupEvents.map((event) => {
                  const color = EVENT_COLORS[event.color % EVENT_COLORS.length];
                  return (
                    <div key={event.id} className="flex items-start gap-3 p-3.5 group hover:bg-[var(--color-zen-bg-light)]/30 dark:hover:bg-white/[0.02] transition-colors">
                      {/* Timeline dot */}
                      <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.bg }} />
                        <div className="w-px flex-1 bg-[var(--color-zen-border-light)] dark:bg-[var(--color-zen-border-dark)] min-h-[24px]" />
                      </div>

                      {/* Event content */}
                      <div className="flex-1 min-w-0 pb-2 group-last:pb-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">{event.title}</p>
                            <p className="text-[11px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] mt-0.5">{format(new Date(event.date), 'dd MMM yyyy')}</p>
                          </div>
                          <button
                            onClick={() => removeEvent(event.id)}
                            className="p-1 shrink-0 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Import/Export & status */}
      <div className="flex flex-col items-center gap-3">
        {/* Import message */}
        {importMessage && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs ${importMessage.type === 'success' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
            <AlertCircle className="w-3 h-3" />
            {importMessage.text}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const data = JSON.stringify(events, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `zen-events-${format(new Date(), 'yyyy-MM-dd')}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-medium border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] transition-all"
          >
            <Download className="w-3 h-3" />
            Export JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-medium border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] transition-all"
          >
            <Upload className="w-3 h-3" />
            Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (evt) => {
                try {
                  const imported = JSON.parse(evt.target.result);
                  if (!Array.isArray(imported)) throw new Error('Invalid format');
                  // Validate each event has required fields
                  imported.forEach((ev, i) => {
                    if (!ev.id || !ev.date || !ev.title) throw new Error(`Event ${i + 1} missing required fields (id, date, title)`);
                  });
                  setEvents(imported);
                  setImportMessage({ type: 'success', text: `Imported ${imported.length} events successfully!` });
                  setTimeout(() => setImportMessage(null), 3000);
                } catch (err) {
                  setImportMessage({ type: 'error', text: `Import failed: ${err.message}` });
                  setTimeout(() => setImportMessage(null), 4000);
                }
              };
              reader.readAsText(file);
              // Reset input so the same file can be re-imported
              e.target.value = '';
            }}
          />
        </div>

        {events.length > 0 && (
          <div className="text-center text-[10px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
            {events.length} total event{events.length !== 1 ? 's' : ''} &middot; All data stored locally
          </div>
        )}
      </div>
    </div>
  );
}
