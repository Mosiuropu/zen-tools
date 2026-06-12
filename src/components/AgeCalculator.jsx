import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Plus, Trash2, Calendar, User, BarChartHorizontal, Download, Cake, ChevronRight } from 'lucide-react';
import { intervalToDuration, differenceInDays, differenceInMonths, format } from 'date-fns';
import html2canvas from 'html2canvas';

const PERSON_COLORS = [
  { bar: '#4F6A33', light: 'rgba(79, 106, 51, 0.15)', name: 'Sage' },
  { bar: '#B8634A', light: 'rgba(184, 99, 74, 0.15)', name: 'Terracotta' },
  { bar: '#4A7B9D', light: 'rgba(74, 123, 157, 0.15)', name: 'Steel Blue' },
  { bar: '#9B6B9E', light: 'rgba(155, 107, 158, 0.15)', name: 'Mauve' },
  { bar: '#C8914A', light: 'rgba(200, 145, 74, 0.15)', name: 'Amber' },
  { bar: '#6B8E7B', light: 'rgba(107, 142, 123, 0.15)', name: 'Moss' },
  { bar: '#A05A6E', light: 'rgba(160, 90, 110, 0.15)', name: 'Rose' },
  { bar: '#5A7B8C', light: 'rgba(90, 123, 140, 0.15)', name: 'Slate' },
];

function calculateAgeData(dob, targetDate) {
  try {
    const birth = new Date(dob);
    const target = new Date(targetDate);
    if (isNaN(birth.getTime()) || isNaN(target.getTime())) return null;
    if (target < birth) return null;

    const duration = intervalToDuration({ start: birth, end: target });
    const totalDays = differenceInDays(target, birth);
    const totalMonths = differenceInMonths(target, birth);
    const years = duration.years || 0;
    const months = duration.months || 0;
    const days = duration.days || 0;

    return { years, months, days, totalDays, totalMonths };
  } catch (e) {
    return null;
  }
}

function getUpcomingBirthdays(people, today) {
  const now = new Date(today);
  const currentYear = now.getFullYear();
  const birthdays = [];

  people.forEach(p => {
    const dob = new Date(p.dob);
    if (isNaN(dob.getTime())) return;
    
    // This year's birthday
    const thisYearBday = new Date(currentYear, dob.getMonth(), dob.getDate());
    // If already passed this year, use next year
    let nextBday = thisYearBday;
    if (thisYearBday < now) {
      nextBday = new Date(currentYear + 1, dob.getMonth(), dob.getDate());
    }
    
    const daysUntil = differenceInDays(nextBday, now);
    const age = nextBday.getFullYear() - dob.getFullYear();
    
    birthdays.push({
      personId: p.id,
      name: p.name,
      nextBday,
      daysUntil,
      age,
      colorIndex: p.colorIndex,
    });
  });

  return birthdays.sort((a, b) => a.daysUntil - b.daysUntil);
}

export default function AgeCalculator() {
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [people, setPeople] = useState(() => {
    try {
      const saved = localStorage.getItem('zen_age_people');
      return saved ? JSON.parse(saved) : [
        { id: '1', name: 'Me', dob: '1990-01-01', colorIndex: 0 }
      ];
    } catch { return [{ id: '1', name: 'Me', dob: '1990-01-01', colorIndex: 0 }]; }
  });
  const ganttRef = useRef(null);

  const today = new Date().toISOString().split('T')[0];

  // Persist people to localStorage
  React.useEffect(() => {
    localStorage.setItem('zen_age_people', JSON.stringify(people));
  }, [people]);

  const addPerson = () => {
    const idx = people.length % PERSON_COLORS.length;
    setPeople([...people, {
      id: crypto.randomUUID(),
      name: `Person ${people.length + 1}`,
      dob: '2000-01-01',
      colorIndex: idx
    }]);
  };

  const removePerson = (id) => {
    if (people.length > 1) {
      setPeople(people.filter(p => p.id !== id));
    }
  };

  const updatePerson = (id, field, value) => {
    setPeople(people.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  // Compute date range for Gantt
  const dateRange = useMemo(() => {
    if (people.length === 0) return null;
    const allDobs = people.map(p => new Date(p.dob));
    const target = new Date(targetDate);
    const minDate = new Date(Math.min(...allDobs.map(d => d.getTime())));
    const maxDate = target;
    const totalSpan = differenceInDays(maxDate, minDate);
    if (totalSpan <= 0) return null;
    return { minDate, maxDate, totalSpan };
  }, [people, targetDate]);

  const peopleData = useMemo(() => {
    return people.map(p => ({
      ...p,
      age: calculateAgeData(p.dob, targetDate),
      dobDate: new Date(p.dob),
      color: PERSON_COLORS[p.colorIndex % PERSON_COLORS.length]
    }));
  }, [people, targetDate]);

  // Birthday reminders
  const upcomingBirthdays = useMemo(() => getUpcomingBirthdays(people, today), [people, today]);

  const chartStart = dateRange?.minDate;
  const chartEnd = dateRange?.maxDate;
  const totalSpan = dateRange?.totalSpan || 1;

  const getLeftPct = (d) => {
    if (!chartStart || !totalSpan) return 0;
    const offset = differenceInDays(new Date(d), chartStart);
    return Math.max(0, (offset / totalSpan) * 100);
  };

  const getWidthPct = (dob, target) => {
    if (!totalSpan) return 0;
    const span = differenceInDays(new Date(target), new Date(dob));
    return Math.max(1, (span / totalSpan) * 100);
  };

  // Export Gantt as PNG
  const exportGanttAsPNG = useCallback(async () => {
    if (!ganttRef.current) return;
    try {
      const canvas = await html2canvas(ganttRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `age-gantt-${format(new Date(), 'yyyy-MM-dd')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to export Gantt chart:', err);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Birthday Reminders */}
      {upcomingBirthdays.length > 0 && (
        <div className="zen-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Cake className="w-4 h-4 text-pink-500" />
            <h3 className="text-xs font-semibold text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] uppercase tracking-wider">Upcoming Birthdays</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {upcomingBirthdays.map(bd => {
              const color = PERSON_COLORS[bd.colorIndex % PERSON_COLORS.length];
              return (
                <div
                  key={`${bd.personId}-${bd.nextBday.getTime()}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs"
                  style={{ backgroundColor: color.light }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color.bar }} />
                  <span className="font-medium text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">{bd.name}</span>
                  {bd.daysUntil === 0 ? (
                    <span className="font-bold text-pink-500">🎉 Today!</span>
                  ) : (
                    <span className="text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
                      in {bd.daysUntil}d ({format(bd.nextBday, 'dd MMM')})
                    </span>
                  )}
                  <ChevronRight className="w-3 h-3 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]" />
                  <span className="text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">turning {bd.age}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Global Target Date Picker */}
      <div className="zen-card p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">
            <Calendar className="w-4 h-4 text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]" />
            Target Date
          </div>
          <input
            type="date"
            value={targetDate}
            max={today}
            onChange={(e) => setTargetDate(e.target.value)}
            className="zen-input text-sm w-full sm:w-auto"
          />
          <button
            onClick={() => setTargetDate(today)}
            className="text-xs text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)] hover:underline transition-all"
          >
            Reset to today
          </button>
        </div>
      </div>

      {/* People Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] uppercase tracking-wider">
            People ({people.length})
          </h3>
          <button
            onClick={addPerson}
            className="flex items-center gap-1.5 zen-btn-primary px-3 py-1.5 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Person
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {peopleData.map((person) => {
            const color = person.color;
            return (
              <div
                key={person.id}
                className="zen-card p-4 relative overflow-hidden group transition-all duration-200 hover:shadow-md"
                style={{ borderLeftColor: color.bar, borderLeftWidth: '3px' }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: color.light }}
                  >
                    <User className="w-4 h-4" style={{ color: color.bar }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={person.name}
                        onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                        className="bg-transparent border-none text-sm font-semibold focus:ring-0 p-0 w-full text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] placeholder-[var(--color-zen-muted-light)] dark:placeholder-[var(--color-zen-muted-dark)]"
                        placeholder="Name"
                      />
                      {people.length > 1 && (
                        <button
                          onClick={() => removePerson(person.id)}
                          className="p-1 shrink-0 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2 items-center">
                      <span className="text-[10px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] font-medium uppercase tracking-wider">DOB</span>
                      <input
                        type="date"
                        value={person.dob}
                        onChange={(e) => updatePerson(person.id, 'dob', e.target.value)}
                        className="zen-input text-xs py-1 px-2 w-auto"
                      />
                    </div>

                    {person.age ? (
                      <div className="grid grid-cols-4 gap-2 mt-3">
                        <div className="rounded-md text-center py-2" style={{ backgroundColor: color.light }}>
                          <div className="text-sm font-bold" style={{ color: color.bar }}>{person.age.years}</div>
                          <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">Years</div>
                        </div>
                        <div className="rounded-md text-center py-2" style={{ backgroundColor: color.light }}>
                          <div className="text-sm font-bold" style={{ color: color.bar }}>{person.age.months}</div>
                          <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">Months</div>
                        </div>
                        <div className="rounded-md text-center py-2" style={{ backgroundColor: color.light }}>
                          <div className="text-sm font-bold" style={{ color: color.bar }}>{person.age.days}</div>
                          <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">Days</div>
                        </div>
                        <div className="rounded-md text-center py-2" style={{ backgroundColor: color.light }}>
                          <div className="text-sm font-bold" style={{ color: color.bar }}>{person.age.totalDays.toLocaleString()}</div>
                          <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">Total</div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 text-xs italic text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
                        {new Date(person.dob) > new Date(targetDate) ? 'DOB must be before target date' : 'Invalid date'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gantt Chart */}
      {dateRange && peopleData.some(p => p.age) && (
        <div className="zen-card overflow-hidden">
          <div className="p-4 border-b border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChartHorizontal className="w-4 h-4 text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]" />
              <h3 className="text-xs font-semibold text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] uppercase tracking-wider">Age Span Gantt Chart</h3>
            </div>
            <button
              onClick={exportGanttAsPNG}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-medium border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] transition-all"
            >
              <Download className="w-3 h-3" />
              Export PNG
            </button>
          </div>

          <div className="overflow-x-auto" ref={ganttRef}>
            <div className="min-w-[600px] p-4">
              {/* Timeline header */}
              <div className="flex mb-3">
                <div className="w-[140px] shrink-0 pr-3">
                  <span className="text-[10px] font-semibold text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] uppercase tracking-wider">Person</span>
                </div>
                <div className="flex-1 relative h-6">
                  {chartStart && chartEnd && (() => {
                    const markers = [];
                    const totalMonths = differenceInMonths(chartEnd, chartStart);
                    const step = Math.max(1, Math.floor(totalMonths / 10));
                    
                    for (let i = 0; i <= totalMonths; i += step) {
                      const d = new Date(chartStart);
                      d.setMonth(d.getMonth() + i);
                      const pct = (differenceInDays(d, chartStart) / totalSpan) * 100;
                      if (pct <= 100) {
                        markers.push(
                          <div key={i} className="absolute top-0 text-[9px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] -translate-x-1/2" style={{ left: `${pct}%` }}>
                            {format(d, 'MMM yy')}
                          </div>
                        );
                      }
                    }
                    return markers;
                  })()}
                </div>
              </div>

              {/* Rows */}
              <div className="space-y-2">
                {peopleData.filter(p => p.age).map((person) => {
                  const color = person.color;
                  const left = getLeftPct(person.dob);
                  const width = getWidthPct(person.dob, targetDate);

                  return (
                    <div key={person.id} className="flex items-center group">
                      <div className="w-[140px] shrink-0 pr-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color.bar }} />
                        <span className="text-xs font-medium text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] truncate">{person.name}</span>
                      </div>
                      <div className="flex-1 relative h-9">
                        <div className="absolute inset-0 rounded-md" style={{ backgroundColor: 'var(--color-zen-bg-light)', opacity: 0.5 }} />
                        
                        <div
                          className="absolute top-1/2 -translate-y-1/2 h-6 rounded-md shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:h-7 flex items-center"
                          style={{
                            left: `${left}%`,
                            width: `max(2%, ${width}%)`,
                            backgroundColor: color.bar,
                            opacity: 0.85,
                          }}
                        >
                          {width > 8 && (
                            <span className="text-[9px] font-medium text-white px-2 truncate">
                              {person.age.years}y {person.age.months}m ({person.age.totalDays.toLocaleString()}d)
                            </span>
                          )}
                        </div>

                        <div className="absolute -bottom-4 left-0 right-0 flex justify-between text-[8px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>{format(new Date(person.dob), 'dd MMM yyyy')}</span>
                          <span>{format(new Date(targetDate), 'dd MMM yyyy')}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)]">
                <div className="flex items-center text-[10px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
                  <span className="w-[140px] shrink-0">Total span</span>
                  <span>{format(chartStart, 'dd MMM yyyy')} — {format(chartEnd, 'dd MMM yyyy')} ({totalSpan.toLocaleString()} days)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data saved indicator */}
      <div className="text-center text-[10px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
        Data auto-saved locally &middot; {people.length} person{people.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
