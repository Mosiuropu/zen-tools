import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

export default function ZenPriorities() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('zen_priorities');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('zen_priorities', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || tasks.length >= 3) return;

    const newTask = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false
    };

    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-blue-500">The Rule of Three</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Choose exactly three high-impact tasks. Don't add more until one is finished.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl space-y-10">
        <form onSubmit={addTask} className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={tasks.length >= 3}
            placeholder={tasks.length >= 3 ? "List is full. Finish a task first." : "What is your next priority?"}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-5 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50 placeholder-slate-400 dark:placeholder-slate-700"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || tasks.length >= 3}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all disabled:opacity-0 disabled:scale-90"
          >
            <Plus className="w-6 h-6" />
          </button>
        </form>

        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={`group flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all ${
                task.completed 
                  ? 'bg-slate-50 dark:bg-slate-950/50 border-transparent opacity-50' 
                  : 'bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 hover:border-blue-500/30'
              }`}
            >
              <div className="flex items-center gap-6">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`transition-all active:scale-75 ${task.completed ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700 hover:text-blue-500'}`}
                >
                  {task.completed ? <CheckCircle2 className="w-10 h-10" /> : <Circle className="w-10 h-10" />}
                </button>
                <span className={`text-xl md:text-2xl font-black tracking-tight transition-all ${task.completed ? 'line-through text-slate-400 dark:text-slate-600' : 'text-slate-800 dark:text-slate-100'}`}>
                  {task.text}
                </span>
              </div>
              <button
                onClick={() => removeTask(task.id)}
                className="p-3 text-slate-200 dark:text-slate-800 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
          ))}
          
          {tasks.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center justify-center space-y-4 opacity-20">
              <AlertCircle className="w-16 h-16" />
              <p className="font-bold uppercase tracking-widest text-sm">No priorities set</p>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          <span>{tasks.filter(t => t.completed).length} / 3 Completed</span>
          <span>{3 - tasks.length} Slots Remaining</span>
        </div>
      </div>
    </div>
  );
}
