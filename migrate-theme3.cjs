const fs = require('fs');
const path = require('path');

const dirs = [path.join(__dirname, 'src/components'), path.join(__dirname, 'src')];

const replacements = [
  // Typography scaling
  { regex: /text-9xl/g, replacement: 'text-6xl' },
  { regex: /text-8xl/g, replacement: 'text-5xl' },
  { regex: /text-7xl/g, replacement: 'text-4xl' },
  { regex: /text-6xl/g, replacement: 'text-4xl' },

  // Warm Claude Grays (Stone)
  { regex: /bg-zinc-50/g, replacement: 'bg-stone-50' },
  { regex: /bg-zinc-100/g, replacement: 'bg-stone-100' },
  { regex: /bg-zinc-200/g, replacement: 'bg-stone-200' },
  { regex: /bg-zinc-800/g, replacement: 'bg-stone-800' },
  { regex: /bg-zinc-900/g, replacement: 'bg-stone-900' },
  { regex: /bg-zinc-950/g, replacement: 'bg-stone-950' },
  
  { regex: /text-zinc-50/g, replacement: 'text-stone-50' },
  { regex: /text-zinc-100/g, replacement: 'text-stone-100' },
  { regex: /text-zinc-300/g, replacement: 'text-stone-300' },
  { regex: /text-zinc-400/g, replacement: 'text-stone-400' },
  { regex: /text-zinc-500/g, replacement: 'text-stone-500' },
  { regex: /text-zinc-600/g, replacement: 'text-stone-600' },
  { regex: /text-zinc-700/g, replacement: 'text-stone-700' },
  { regex: /text-zinc-800/g, replacement: 'text-stone-800' },
  { regex: /text-zinc-900/g, replacement: 'text-stone-900' },

  { regex: /border-zinc-200/g, replacement: 'border-stone-200' },
  { regex: /border-zinc-300/g, replacement: 'border-stone-300' },
  { regex: /border-zinc-700/g, replacement: 'border-stone-700' },
  { regex: /border-zinc-800/g, replacement: 'border-stone-800' },

  { regex: /ring-zinc-400/g, replacement: 'ring-stone-400' },
  { regex: /ring-zinc-600/g, replacement: 'ring-stone-600' },

  // Same for slate (some components might still have slate)
  { regex: /bg-slate-50/g, replacement: 'bg-stone-50' },
  { regex: /bg-slate-100/g, replacement: 'bg-stone-100' },
  { regex: /bg-slate-200/g, replacement: 'bg-stone-200' },
  { regex: /bg-slate-800/g, replacement: 'bg-stone-800' },
  { regex: /bg-slate-900/g, replacement: 'bg-stone-900' },
  { regex: /bg-slate-950/g, replacement: 'bg-stone-950' },
  { regex: /text-slate-50/g, replacement: 'text-stone-50' },
  { regex: /text-slate-100/g, replacement: 'text-stone-100' },
  { regex: /text-slate-300/g, replacement: 'text-stone-300' },
  { regex: /text-slate-400/g, replacement: 'text-stone-400' },
  { regex: /text-slate-500/g, replacement: 'text-stone-500' },
  { regex: /text-slate-600/g, replacement: 'text-stone-600' },
  { regex: /text-slate-700/g, replacement: 'text-stone-700' },
  { regex: /text-slate-800/g, replacement: 'text-stone-800' },
  { regex: /text-slate-900/g, replacement: 'text-stone-900' },
  { regex: /border-slate-200/g, replacement: 'border-stone-200' },
  { regex: /border-slate-700/g, replacement: 'border-stone-700' },
  { regex: /border-slate-800/g, replacement: 'border-stone-800' },

  // Pastel Claude Accents (replace blue with elegant orange/peach)
  { regex: /bg-blue-100/g, replacement: 'bg-orange-100' },
  { regex: /bg-blue-500/g, replacement: 'bg-orange-500' },
  { regex: /bg-blue-600/g, replacement: 'bg-orange-600' },
  { regex: /bg-blue-900/g, replacement: 'bg-orange-900' },
  { regex: /text-blue-400/g, replacement: 'text-orange-400' },
  { regex: /text-blue-500/g, replacement: 'text-orange-500' },
  { regex: /text-blue-600/g, replacement: 'text-orange-600' },
  { regex: /border-blue-200/g, replacement: 'border-orange-200' },
  { regex: /border-blue-500/g, replacement: 'border-orange-500' },
  { regex: /shadow-blue-900/g, replacement: 'shadow-orange-900' },

  // Remove hardcoded text-white where it breaks the light theme.
  // We'll replace it with standard dark-mode responsive text OR leave it for buttons that are strictly primary
  // Many hardcoded `text-white` buttons in the codebase have `bg-stone-900` without a dark: bg, meaning they are black buttons. 
  // Let's replace generic bad button classes with semantic ones.
  { regex: /bg-zinc-900 text-white hover:bg-blue-500/g, replacement: 'zen-btn-primary' },
  { regex: /bg-stone-900 hover:bg-orange-500 text-white/g, replacement: 'zen-btn-primary' },
  { regex: /bg-stone-900 text-white shadow-sm shadow-orange-900\/20/g, replacement: 'zen-btn-primary' },
  { regex: /bg-stone-900 text-white animate-pulse/g, replacement: 'zen-btn-primary animate-pulse' },
  { regex: /bg-stone-900 border-orange-500 text-white/g, replacement: 'zen-btn-primary border-orange-500' },
  
  // Specific fix for ZenBreathing, HabitTracker, AgeCalculator hardcoded "text-white"
  { regex: /text-white dark:text-stone-800/g, replacement: 'text-stone-900 dark:text-stone-100' },
  { regex: /bg-stone-900 text-white px-8/g, replacement: 'zen-btn-primary px-8' },
  { regex: /bg-stone-900 text-white px-6/g, replacement: 'zen-btn-primary px-6' },
  
  // Clean up errant text-white that are not part of zen-btn-primary
  { regex: /text-white shadow-sm/g, replacement: 'text-white dark:text-stone-950 shadow-sm' }, // Habit colors
  { regex: /hover:text-white/g, replacement: 'hover:text-stone-900 dark:hover:text-stone-100' }, // Notes border hover

];

dirs.forEach(dir => {
  fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.jsx')) {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let original = content;
      
      replacements.forEach(({ regex, replacement }) => {
        content = content.replace(regex, replacement);
      });

      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
      }
    }
  });
});
