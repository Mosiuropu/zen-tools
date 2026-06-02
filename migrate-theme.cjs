const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components');

const replacements = [
  { regex: /bg-slate-50/g, replacement: 'bg-[#F9F8F6]' },
  { regex: /dark:bg-slate-950/g, replacement: 'dark:bg-[#1E1D1B]' },
  { regex: /dark:bg-slate-900/g, replacement: 'dark:bg-[#2A2A29]' },
  { regex: /bg-slate-100/g, replacement: 'bg-[#F0EFEA]' },
  { regex: /dark:bg-slate-800/g, replacement: 'dark:bg-[#3A3A39]' },
  { regex: /bg-slate-200/g, replacement: 'bg-[#E6E4E0]' },
  { regex: /dark:bg-slate-700/g, replacement: 'dark:bg-[#4A4A49]' },
  
  { regex: /text-slate-900/g, replacement: 'text-[#2D2D2D]' },
  { regex: /dark:text-white/g, replacement: 'dark:text-[#E8E6E3]' },
  { regex: /text-slate-600/g, replacement: 'text-[#5C5A56]' },
  { regex: /text-slate-500/g, replacement: 'text-[#73716D]' },
  { regex: /dark:text-slate-400/g, replacement: 'dark:text-[#8C8A86]' },
  { regex: /dark:text-slate-300/g, replacement: 'dark:text-[#B5B3AD]' },
  
  { regex: /border-slate-200/g, replacement: 'border-[#E6E4E0]' },
  { regex: /dark:border-slate-800/g, replacement: 'dark:border-[#3A3A39]' },
  { regex: /border-slate-100/g, replacement: 'border-[#F0EFEA]' },
  
  { regex: /bg-blue-600/g, replacement: 'bg-[#D97757]' },
  { regex: /hover:bg-blue-700/g, replacement: 'hover:bg-[#c4684b]' },
  { regex: /text-blue-600/g, replacement: 'text-[#D97757]' },
  { regex: /dark:text-blue-400/g, replacement: 'dark:text-[#E28F73]' },
  { regex: /hover:text-blue-500/g, replacement: 'hover:text-[#D97757] dark:hover:text-[#E28F73]' },
  
  { regex: /focus:ring-blue-500/g, replacement: 'focus:ring-[#D97757] dark:focus:ring-[#E28F73]' },
  { regex: /focus:border-blue-500/g, replacement: 'focus:border-[#D97757] dark:focus:border-[#E28F73]' },
];

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
