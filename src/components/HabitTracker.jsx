import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  LayoutGrid, 
  ListTodo, 
  ChevronRight, 
  Flame,
  Activity,
  Shield,
  Sparkles
} from 'lucide-react';
import { 
  format, 
  subDays, 
  isSameDay, 
} from 'date-fns';

const COLORS = [
  { name: 'Blue', class: 'bg-orange-500', text: 'text-[var(--color-claude-accent-primary)] dark:text-[var(--color-claude-text-dark)]', border: 'border-orange-500' },
  { name: 'Green', class: 'bg-emerald-500', text: 'text-emerald-500 dark:text-emerald-400', border: 'border-emerald-500' },
  { name: 'Purple', class: 'bg-violet-500', text: 'text-violet-500 dark:text-violet-400', border: 'border-violet-500' },
  { name: 'Orange', class: 'bg-orange-500', text: 'text-[var(--color-claude-accent-primary)] dark:text-[var(--color-claude-accent-primary)]', border: 'border-orange-500' },
  { name: 'Pink', class: 'bg-pink-500', text: 'text-pink-500 dark:text-pink-400', border: 'border-pink-500' },
];

export default function HabitTracker() {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('zen_habits');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('zen_habit_logs');
    return saved ? JSON.parse(saved) : {};
  });

  const [view, setView] = useState('daily');
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedHabitId, setSelectedHabitId] = useState(null);

  useEffect(() => {
    localStorage.setItem('zen_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('zen_habit_logs', JSON.stringify(logs));
  }, [logs]);

  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    
    const newHabit = {
      id: Math.random().toString(36).substr(2, 9),
      name: newHabitName.trim(),
      color: selectedColor,
      createdAt: new Date().toISOString(),
    };
    
    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
    if (selectedHabitId === id) setSelectedHabitId(null);
  };

  const toggleHabit = (habitId, dateStr = format(new Date(), 'yyyy-MM-dd')) => {
    const currentLogs = logs[dateStr] || [];
    const isCompleted = currentLogs.includes(habitId);
    
    setLogs({
      ...logs,
      [dateStr]: isCompleted 
        ? currentLogs.filter(id => id !== habitId)
        : [...currentLogs, habitId]
    });
  };

  const calculateStreak = (habitId) => {
    let streak = 0;
    let checkDate = new Date();
    
    while (true) {
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      if (logs[dateStr]?.includes(habitId)) {
        streak++;
        checkDate = subDays(checkDate, 1);
      } else {
        if (!isSameDay(checkDate, new Date())) break;
        checkDate = subDays(checkDate, 1);
        if (!logs[format(checkDate, 'yyyy-MM-dd')]?.includes(habitId)) break;
      }
    }
    return streak;
  };

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const pastDays = useMemo(() => {
    return Array.from({ length: 90 }, (_, i) => format(subDays(new Date(), i), 'yyyy-MM-dd')).reverse();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)] flex items-center gap-3">
            <Activity className="w-8 h-8 text-[var(--color-claude-accent-primary)]" />
            Habit Mastery
          </h2>
          <p className="text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)]0 dark:text-[var(--color-claude-text-dark)] font-medium">Small daily actions lead to massive results.</p>
        </div>

        <div className="flex bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-card-dark)]/50 p-1 rounded-md border border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] self-stretch md:self-auto shadow-sm">
          <button 
            onClick={() => setView('daily')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-md font-semibold text-sm transition-all ${view === 'daily' ? 'zen-btn-primary' : 'text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-muted-dark)] hover:text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-muted-dark)] dark:hover:text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)]'}`}
          >
            <ListTodo className="w-4 h-4" />
            Daily
          </button>
          <button 
            onClick={() => setView('grid')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-md font-semibold text-sm transition-all ${view === 'grid' ? 'zen-btn-primary' : 'text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-muted-dark)] hover:text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-muted-dark)] dark:hover:text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)]'}`}
          >
            <LayoutGrid className="w-4 h-4" />
            Grid
          </button>
        </div>
      </div>

      <form onSubmit={addHabit} className="bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-card-dark)] border border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] rounded-md p-6 shadow-sm flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex gap-4 items-center">
          <div className="flex gap-2">
            {COLORS.map(color => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-md transition-all ${color.class} ${selectedColor.name === color.name ? 'ring-4 ring-offset-4 ring-offset-white dark:ring-offset-stone-900 ring-blue-500' : 'opacity-40 hover:opacity-100'}`}
              />
            ))}
          </div>
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="New habit (e.g., Meditate 10m)"
            className="flex-1 bg-transparent border-none text-base font-semibold text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)] focus:ring-0 placeholder-stone-300 dark:placeholder-stone-700"
          />
        </div>
        <button
          type="submit"
          className="zen-btn-primary px-8 py-3 rounded-md font-semibold transition-all shadow-sm shadow-orange-900/20 active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Habit
        </button>
      </form>

      <div className="space-y-6">
        {view === 'daily' ? (
          <div className="grid lg:grid-cols-[1fr,350px] gap-8">
            <div className="space-y-4">
              {habits.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center bg-[var(--color-claude-border-light)] dark:bg-[var(--color-claude-border-dark)]/50 dark:bg-[var(--color-claude-bg-dark)]/30 border-2 border-dashed border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] rounded-md text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-muted-dark)]">
                  <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium italic text-sm">Your journey starts here. Add a habit above.</p>
                </div>
              ) : (
                habits.map(habit => {
                  const isDone = logs[todayStr]?.includes(habit.id);
                  const streak = calculateStreak(habit.id);
                  return (
                    <div 
                      key={habit.id}
                      onClick={() => setSelectedHabitId(habit.id)}
                      className={`group flex items-center justify-between p-6 rounded-md border transition-all cursor-pointer ${selectedHabitId === habit.id ? 'bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-card-dark)] border-orange-500/50 shadow-2xl' : 'bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-card-dark)]/50 dark:bg-[var(--color-claude-bg-dark)]/50 border-stone-100 dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] hover:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] dark:hover:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] shadow-sm'}`}
                    >
                      <div className="flex items-center gap-5">
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleHabit(habit.id); }}
                          className={`transition-transform active:scale-90 ${isDone ? habit.color.text : 'text-stone-200 dark:text-[var(--color-claude-text-dark)] hover:text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-muted-dark)] dark:hover:text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-muted-dark)]'}`}
                        >
                          {isDone ? <CheckCircle2 className="w-10 h-10" /> : <Circle className="w-10 h-10" />}
                        </button>
                        <div>
                          <h3 className={`text-base font-semibold tracking-tight transition-all ${isDone ? 'text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)]0 line-through' : 'text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)]'}`}>
                            {habit.name}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-widest ${streak > 0 ? 'text-[var(--color-claude-accent-primary)]' : 'text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-muted-dark)]'}`}>
                              <Flame className="w-3 h-3 fill-current" />
                              {streak} Day Streak
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <ChevronRight className={`w-6 h-6 transition-all ${selectedHabitId === habit.id ? 'text-[var(--color-claude-accent-primary)] translate-x-1' : 'text-stone-200 dark:text-[var(--color-claude-text-dark)] opacity-0 group-hover:opacity-100'}`} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="space-y-6">
              {selectedHabitId ? (
                (() => {
                  const habit = habits.find(h => h.id === selectedHabitId);
                  if (!habit) return null;
                  const streak = calculateStreak(habit.id);
                  return (
                    <div className="bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-card-dark)] border border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] rounded-[2.5rem] p-8 shadow-2xl sticky top-28 space-y-8 animate-in slide-in-from-right-4 duration-500">
                      <div className="flex justify-between items-start">
                        <div className={`p-4 rounded-md ${habit.color.class} bg-opacity-10 ${habit.color.text}`}>
                          <Activity className="w-8 h-8" />
                        </div>
                        <button 
                          onClick={() => deleteHabit(habit.id)}
                          className="p-3 text-stone-200 dark:text-[var(--color-claude-text-dark)] hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)]">{habit.name}</h4>
                        <p className="text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)]0 dark:text-[var(--color-claude-text-dark)]0 text-sm font-medium">Tracking since {format(new Date(habit.createdAt), 'MMM d, yyyy')}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-[var(--color-claude-bg-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-bg-dark)] p-6 rounded-md border border-stone-100 dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)]/50 flex flex-col items-center text-center space-y-1">
                          <Flame className="w-8 h-8 text-[var(--color-claude-accent-primary)] fill-current mb-2" />
                          <span className="text-sm font-semibold text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)]">{streak}</span>
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)]0">Current Streak</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                          <h5 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)]0">Consistency (90 Days)</h5>
                        </div>
                        <div className="flex flex-wrap gap-1.5 p-4 bg-[var(--color-claude-bg-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-bg-dark)] rounded-md border border-stone-100 dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)]/50">
                          {pastDays.map(date => {
                            const done = logs[date]?.includes(habit.id);
                            return (
                              <div 
                                key={date} 
                                title={date}
                                className={`w-3 h-3 rounded-sm transition-all ${done ? habit.color.class : 'bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-card-dark)] border border-stone-100 dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)]'}`} 
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-card-dark)]/50 dark:bg-[var(--color-claude-bg-dark)]/50 border border-dashed border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center space-y-4 h-full min-h-[400px] shadow-sm">
                  <Activity className="w-12 h-12 text-stone-200 dark:text-[var(--color-claude-text-dark)]" />
                  <p className="text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-muted-dark)] font-medium italic text-sm">Select a habit to view progress</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-card-dark)] border border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] rounded-[2.5rem] shadow-2xl overflow-hidden transition-all">
            <div className="overflow-x-auto p-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 text-left min-w-[200px] bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-card-dark)] sticky left-0 z-10 border-b border-stone-100 dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)]">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)]0">Habit</span>
                    </th>
                    {Array.from({ length: 14 }, (_, i) => {
                      const date = subDays(new Date(), 13 - i);
                      return (
                        <th key={i} className="p-4 text-center border-b border-stone-100 dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] min-w-[60px]">
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] font-semibold uppercase tracking-tighter text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-muted-dark)]">{format(date, 'EEE')}</span>
                            <span className={`text-sm font-semibold mt-1 ${isSameDay(date, new Date()) ? 'text-[var(--color-claude-accent-primary)]' : 'text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-muted-dark)]'}`}>{format(date, 'd')}</span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {habits.map(habit => (
                    <tr key={habit.id} className="group hover:bg-[var(--color-claude-bg-light)] dark:bg-[var(--color-claude-bg-dark)] dark:hover:bg-[var(--color-claude-bg-light)] dark:bg-[var(--color-claude-bg-dark)]/50 transition-colors">
                      <td className="p-4 bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-card-dark)] sticky left-0 z-10 border-b border-stone-50 dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)]/50 group-hover:bg-[var(--color-claude-bg-light)] dark:bg-[var(--color-claude-bg-dark)] dark:group-hover:bg-[var(--color-claude-bg-light)] dark:bg-[var(--color-claude-bg-dark)] transition-colors">
                        <span className="font-semibold text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-stone-200">{habit.name}</span>
                      </td>
                      {Array.from({ length: 14 }, (_, i) => {
                        const date = subDays(new Date(), 13 - i);
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const isDone = logs[dateStr]?.includes(habit.id);
                        return (
                          <td key={i} className="p-4 text-center border-b border-stone-50 dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)]/50">
                            <button
                              onClick={() => toggleHabit(habit.id, dateStr)}
                              className={`w-8 h-8 rounded-md flex items-center justify-center transition-all active:scale-90 ${isDone ? habit.color.class + ' text-white dark:text-stone-950 shadow-sm' : 'bg-[var(--color-claude-border-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-border-dark)] text-transparent hover:bg-[var(--color-claude-border-light)] dark:bg-[var(--color-claude-border-dark)] dark:hover:bg-[var(--color-claude-border-light)] dark:hover:bg-[var(--color-claude-border-dark)]'}`}
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-[var(--color-claude-bg-light)] dark:bg-[var(--color-claude-bg-dark)] dark:bg-[var(--color-claude-bg-dark)]/50 p-6 px-10 flex items-center justify-between border-t border-stone-100 dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)]">
               <p className="text-xs text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)]0 font-semibold uppercase tracking-widest flex items-center gap-2">
                 <Shield className="w-4 h-4" /> All data saved locally.
               </p>
               <p className="text-xs text-[var(--color-claude-muted-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-muted-dark)] italic">Showing last 14 days.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
