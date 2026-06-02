import React, { useState, useEffect } from 'react';
import { Plus, X, ListPlus, ChevronDown, ChevronRight, BarChartHorizontal } from 'lucide-react';

const COLORS = [
  { id: 'peach', class: 'bg-[#D97757]' },
  { id: 'blue', class: 'bg-[#3b82f6]' },
  { id: 'green', class: 'bg-[#10b981]' },
  { id: 'purple', class: 'bg-[#8b5cf6]' },
  { id: 'pink', class: 'bg-[#ec4899]' },
  { id: 'yellow', class: 'bg-[#eab308]' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ZenTimeline = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('zen_timeline');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [newTaskName, setNewTaskName] = useState('');
  const [newStartMonth, setNewStartMonth] = useState(1);
  const [newEndMonth, setNewEndMonth] = useState(1);
  const [newColor, setNewColor] = useState(COLORS[0].class);
  
  const [subtaskId, setSubtaskId] = useState(null); // Which task is adding a subtask

  useEffect(() => {
    localStorage.setItem('zen_timeline', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    if (subtaskId) {
      setTasks(tasks.map(t => {
        if (t.id === subtaskId) {
          return {
            ...t,
            subtasks: [...t.subtasks, {
              id: crypto.randomUUID(),
              name: newTaskName,
              start: Number(newStartMonth),
              end: Number(newEndMonth),
              color: newColor
            }]
          };
        }
        return t;
      }));
      setSubtaskId(null);
      // Ensure expanded
      const newExpanded = new Set(expandedTasks);
      newExpanded.add(subtaskId);
      setExpandedTasks(newExpanded);
    } else {
      setTasks([...tasks, {
        id: crypto.randomUUID(),
        name: newTaskName,
        start: Number(newStartMonth),
        end: Number(newEndMonth),
        color: newColor,
        subtasks: []
      }]);
    }

    setNewTaskName('');
    setNewStartMonth(1);
    setNewEndMonth(1);
  };

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedTasks(newExpanded);
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const removeSubtask = (taskId, subId) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, subtasks: t.subtasks.filter(s => s.id !== subId) };
      }
      return t;
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Form */}
      <div className="zen-card p-4 sm:p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BarChartHorizontal className="w-5 h-5 text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]" />
          <h3 className="font-semibold text-lg">{subtaskId ? 'Add Sub-Task' : 'Add New Task'}</h3>
          {subtaskId && (
            <button 
              onClick={() => setSubtaskId(null)}
              className="ml-auto text-xs text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:text-red-500 underline"
            >
              Cancel Sub-task
            </button>
          )}
        </div>
        
        <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder={subtaskId ? "Sub-task name..." : "Project or task name..."}
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            className="zen-input flex-1"
            required
          />
          
          <div className="flex gap-4 w-full md:w-auto">
            <select
              value={newStartMonth}
              onChange={(e) => {
                setNewStartMonth(e.target.value);
                if (Number(e.target.value) > Number(newEndMonth)) {
                  setNewEndMonth(e.target.value);
                }
              }}
              className="zen-input w-24"
            >
              {MONTHS.map((m, i) => <option key={`start-${i}`} value={i + 1}>{m}</option>)}
            </select>
            <span className="flex items-center text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">-</span>
            <select
              value={newEndMonth}
              onChange={(e) => setNewEndMonth(e.target.value)}
              className="zen-input w-24"
              min={newStartMonth}
            >
              {MONTHS.map((m, i) => (
                <option key={`end-${i}`} value={i + 1} disabled={i + 1 < newStartMonth}>{m}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            {COLORS.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setNewColor(c.class)}
                className={`w-6 h-6 rounded-full transition-transform ${c.class} ${newColor === c.class ? 'scale-125 ring-2 ring-offset-2 ring-[var(--color-zen-accent-primary-light)] dark:ring-[var(--color-zen-accent-primary-dark)] dark:ring-offset-[var(--color-zen-bg-dark)]' : 'opacity-70'}`}
              />
            ))}
          </div>

          <button type="submit" className="zen-btn-primary px-4 py-2 flex items-center justify-center gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Add
          </button>
        </form>
      </div>

      {/* Gantt Chart / Timeline */}
      <div className="zen-card overflow-x-auto">
        <div className="min-w-[768px]">
          {/* Header Row */}
          <div className="flex border-b border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] bg-[var(--color-zen-bg-light)] dark:bg-[var(--color-zen-bg-dark)] rounded-t-md">
            <div className="w-1/4 p-4 font-semibold text-xs text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] border-r border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)]">
              Task
            </div>
            <div className="w-3/4 grid grid-cols-12 text-center text-xs font-semibold text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
              {MONTHS.map((m, i) => (
                <div key={m} className={`py-4 ${i !== 11 ? 'border-r border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)]' : ''}`}>
                  {m}
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {tasks.length === 0 && (
            <div className="p-12 text-center text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] text-sm">
              No tasks added yet. Start planning your year!
            </div>
          )}

          {/* Tasks */}
          <div className="divide-y divide-[var(--color-zen-border-light)] dark:divide-[var(--color-zen-border-dark)]">
            {tasks.map(task => (
              <div key={task.id} className="flex flex-col">
                {/* Main Task Row */}
                <div className="flex group hover:bg-[var(--color-zen-bg-light)]/50 dark:hover:bg-white/5 transition-colors">
                  <div className="w-1/4 p-3 flex items-center gap-2 border-r border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)]">
                    <button 
                      onClick={() => toggleExpand(task.id)}
                      className={`p-1 rounded-md hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] transition-colors ${task.subtasks.length === 0 ? 'opacity-0 cursor-default' : ''}`}
                    >
                      {expandedTasks.has(task.id) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>
                    <span className="font-semibold text-sm truncate" title={task.name}>{task.name}</span>
                    <div className="ml-auto flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSubtaskId(task.id)}
                        className="p-1 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:text-[var(--color-zen-accent-primary-light)] dark:hover:text-[var(--color-zen-accent-primary-dark)]"
                        title="Add Sub-task"
                      >
                        <ListPlus className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => removeTask(task.id)}
                        className="p-1 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:text-red-500"
                        title="Delete Task"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Timeline Grid */}
                  <div className="w-3/4 grid grid-cols-12 relative p-2">
                    {/* Background grid lines */}
                    {MONTHS.map((_, i) => (
                      <div key={i} className="border-r border-transparent" />
                    ))}
                    
                    {/* The Task Bar */}
                    <div 
                      className={`absolute top-1/2 -translate-y-1/2 h-6 ${task.color} rounded-md shadow-sm opacity-90 hover:opacity-100 transition-opacity`}
                      style={{
                        left: `${((task.start - 1) / 12) * 100}%`,
                        width: `${((task.end - task.start + 1) / 12) * 100}%`,
                        marginLeft: '4px',
                        marginRight: '4px'
                      }}
                    />
                  </div>
                </div>

                {/* Subtasks */}
                {expandedTasks.has(task.id) && task.subtasks.map(sub => (
                  <div key={sub.id} className="flex bg-[var(--color-zen-bg-light)]/50 dark:bg-black/20 group border-t border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)]/50">
                    <div className="w-1/4 p-3 pl-10 flex items-center gap-2 border-r border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)]">
                      <span className="text-xs text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] truncate" title={sub.name}>{sub.name}</span>
                      <button 
                        onClick={() => removeSubtask(task.id, sub.id)}
                        className="ml-auto p-1 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="w-3/4 grid grid-cols-12 relative p-2">
                      <div 
                        className={`absolute top-1/2 -translate-y-1/2 h-4 ${sub.color} rounded-md shadow-sm opacity-70 hover:opacity-100 transition-opacity`}
                        style={{
                          left: `${((sub.start - 1) / 12) * 100}%`,
                          width: `${((sub.end - sub.start + 1) / 12) * 100}%`,
                          marginLeft: '4px',
                          marginRight: '4px'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZenTimeline;
