import React, { useState, useEffect } from 'react';
import { 
  Ruler, 
  Calendar, 
  Timer, 
  Github, 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  Brain, 
  FileText, 
  Music, 
  Target, 
  Wind,
  Sun,
  Moon,
  Clock,
  Settings as SettingsIcon
} from 'lucide-react';
import UnitConverter from './components/UnitConverter';
import AgeCalculator from './components/AgeCalculator';
import CountdownTimer from './components/CountdownTimer';
import HabitTracker from './components/HabitTracker';
import ZenFocus from './components/ZenFocus';
import ZenNotes from './components/ZenNotes';
import ZenPriorities from './components/ZenPriorities';
import ZenBreathing from './components/ZenBreathing';
import ZenSoundscapes from './components/ZenSoundscapes';
import ZenClock from './components/ZenClock';
import Settings from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('units');
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('zen_theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('zen_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('zen_theme', 'light');
    }
  }, [isDark]);

  const tabs = [
    { id: 'units', label: 'Units', icon: <Ruler className="w-4 h-4" /> },
    { id: 'age', label: 'Age', icon: <Calendar className="w-4 h-4" /> },
    { id: 'habits', label: 'Habits', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'focus', label: 'Focus', icon: <Brain className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" /> },
    { id: 'priorities', label: 'Priorities', icon: <Target className="w-4 h-4" /> },
    { id: 'breathing', label: 'Breathing', icon: <Wind className="w-4 h-4" /> },
    { id: 'sounds', label: 'Sounds', icon: <Music className="w-4 h-4" /> },
    { id: 'clock', label: 'Clock', icon: <Clock className="w-4 h-4" /> },
    { id: 'countdown', label: 'Timer', icon: <Timer className="w-4 h-4" /> },
    { id: 'settings', label: 'Data', icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col font-mono transition-colors duration-200">
      {/* Header */}
      <header className="border-b border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)]/80 bg-[var(--color-claude-bg-light)] dark:bg-[var(--color-claude-bg-dark)]/80 dark:bg-[var(--color-claude-bg-dark)]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md flex items-center justify-center bg-[var(--color-claude-card-light)] dark:bg-[var(--color-claude-card-dark)] text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:bg-[var(--color-claude-bg-dark)] dark:text-[var(--color-claude-text-dark)] border border-transparent">
              <Sparkles className="w-3 h-3" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)]">Zen Tools</h1>
            </div>
          </div>

          <nav className="hidden xl:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-all ${
                  activeTab === tab.id
                    ? 'zen-card shadow-sm font-medium text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)]'
                    : 'text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)]0 dark:text-[var(--color-claude-text-dark)] hover:bg-[var(--color-claude-border-light)] dark:bg-[var(--color-claude-border-dark)] dark:hover:bg-[var(--color-claude-border-light)] dark:bg-[var(--color-claude-border-dark)]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-1.5 rounded-md text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)]0 dark:text-[var(--color-claude-text-dark)] hover:bg-[var(--color-claude-border-light)] dark:bg-[var(--color-claude-border-dark)] dark:hover:bg-[var(--color-claude-border-light)] dark:bg-[var(--color-claude-border-dark)] transition-all"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a 
              href="https://github.com/Mosiuropu/zen-tools" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 p-1.5 rounded-md text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)]0 dark:text-[var(--color-claude-text-dark)] hover:bg-[var(--color-claude-border-light)] dark:bg-[var(--color-claude-border-dark)] dark:hover:bg-[var(--color-claude-border-light)] dark:bg-[var(--color-claude-border-dark)] transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12">
        <div className="mb-10 space-y-2">
          <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)] tracking-tight">
            {activeTab === 'units' && "Convert units seamlessly."}
            {activeTab === 'age' && "Compare ages with precision."}
            {activeTab === 'countdown' && "Track your next milestone."}
            {activeTab === 'habits' && "Master your daily routines."}
            {activeTab === 'focus' && "Enter a state of deep focus."}
            {activeTab === 'notes' && "Capture your thoughts."}
            {activeTab === 'priorities' && "Focus on what truly matters."}
            {activeTab === 'breathing' && "Take a moment to reset."}
            {activeTab === 'sounds' && "Curate your ambient workspace."}
            {activeTab === 'clock' && "Master your current moment."}
            {activeTab === 'settings' && "Manage your local data."}
          </h2>
          <p className="text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)]0 dark:text-[var(--color-claude-text-dark)] text-xs md:text-sm">
            Minimal. Local. Ad-free.
          </p>
        </div>

        <div className="animate-in fade-in duration-300">
          {activeTab === 'units' && <UnitConverter />}
          {activeTab === 'age' && <AgeCalculator />}
          {activeTab === 'countdown' && <CountdownTimer />}
          {activeTab === 'habits' && <HabitTracker />}
          {activeTab === 'focus' && <ZenFocus />}
          {activeTab === 'notes' && <ZenNotes />}
          {activeTab === 'priorities' && <ZenPriorities />}
          {activeTab === 'breathing' && <ZenBreathing />}
          {activeTab === 'sounds' && <ZenSoundscapes />}
          {activeTab === 'clock' && <ZenClock />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="xl:hidden fixed bottom-4 left-4 right-4 bg-[var(--color-claude-bg-light)] dark:bg-[var(--color-claude-bg-dark)]/90 dark:bg-[var(--color-claude-bg-dark)]/90 backdrop-blur-md border border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] p-1.5 rounded-md flex justify-start sm:justify-center shadow-lg z-50 overflow-x-auto no-scrollbar gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 p-2 min-w-[56px] rounded-md transition-all ${
              activeTab === tab.id
                ? 'zen-card text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:text-[var(--color-claude-text-dark)]'
                : 'text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)]0 dark:text-[var(--color-claude-text-dark)]'
            }`}
          >
            {tab.icon}
            <span className="text-[9px] font-medium tracking-wide">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <footer className="py-6 border-t border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)] dark:border-[var(--color-claude-border-light)] dark:border-[var(--color-claude-border-dark)]/80 mt-auto mb-20 xl:mb-0">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)]0 dark:text-[var(--color-claude-text-dark)] text-xs font-medium">
            <Shield className="w-3 h-3" />
            <span>Open Source • No Tracking • No Ads</span>
          </div>
          <div className="flex gap-4">
            <a href="https://github.com/Mosiuropu/zen-tools" className="text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)]0 dark:text-[var(--color-claude-text-dark)] hover:text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] dark:hover:text-[var(--color-claude-text-light)] dark:text-[var(--color-claude-text-dark)] transition-colors text-xs font-medium">GitHub</a>
          </div>
        </div>
      </footer>
      
      {/* Global Sound Player Placeholder (Invisible) */}
      <div id="zen-sound-engine" className="hidden" />
    </div>
  );
}

export default App;
