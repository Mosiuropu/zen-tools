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
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-[#E6E4E0] dark:border-[#3A3A39] bg-[#F9F8F6]/80 dark:bg-[#1E1D1B]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#F0EFEA] dark:bg-[#3A3A39] border border-[#E6E4E0] dark:border-[#4A4A49]">
              <Sparkles className="w-4 h-4 text-[#D97757] dark:text-[#E28F73]" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-medium tracking-tight text-[#2D2D2D] dark:text-[#E8E6E3]">Zen Tools</h1>
            </div>
          </div>

          <nav className="hidden xl:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  activeTab === tab.id
                    ? 'zen-card shadow-sm font-medium text-[#D97757] dark:text-[#E28F73]'
                    : 'text-[#73716D] dark:text-[#8C8A86] hover:bg-[#F0EFEA] dark:hover:bg-[#3A3A39]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg text-[#73716D] dark:text-[#8C8A86] hover:bg-[#F0EFEA] dark:hover:bg-[#3A3A39] transition-all"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a 
              href="https://github.com/Mosiuropu/zen-tools" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 p-2 rounded-lg text-[#73716D] dark:text-[#8C8A86] hover:bg-[#F0EFEA] dark:hover:bg-[#3A3A39] transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12">
        <div className="mb-12 text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-serif font-medium text-[#2D2D2D] dark:text-[#E8E6E3] tracking-tight">
            {activeTab === 'units' && "Convert units seamlessly"}
            {activeTab === 'age' && "Compare ages with precision"}
            {activeTab === 'countdown' && "Track your next milestone"}
            {activeTab === 'habits' && "Master your daily routines"}
            {activeTab === 'focus' && "Enter a state of deep focus"}
            {activeTab === 'notes' && "Capture your thoughts"}
            {activeTab === 'priorities' && "Focus on what truly matters"}
            {activeTab === 'breathing' && "Take a moment to reset"}
            {activeTab === 'sounds' && "Curate your ambient workspace"}
            {activeTab === 'clock' && "Master your current moment"}
            {activeTab === 'settings' && "Manage your local data"}
          </h2>
          <p className="text-[#73716D] dark:text-[#8C8A86] text-sm md:text-base max-w-xl mx-auto font-sans">
            Minimal. Local. Ad-free.
          </p>
        </div>

        <div className="animate-in fade-in duration-500">
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
      <nav className="xl:hidden fixed bottom-4 left-4 right-4 bg-[#F9F8F6]/90 dark:bg-[#1E1D1B]/90 backdrop-blur-md border border-[#E6E4E0] dark:border-[#3A3A39] p-2 rounded-2xl flex justify-start sm:justify-center shadow-lg z-50 overflow-x-auto no-scrollbar gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 p-2 min-w-[60px] rounded-xl transition-all ${
              activeTab === tab.id
                ? 'zen-card text-[#D97757] dark:text-[#E28F73]'
                : 'text-[#73716D] dark:text-[#8C8A86]'
            }`}
          >
            {tab.icon}
            <span className="text-[9px] font-medium tracking-wide">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <footer className="py-8 border-t border-[#E6E4E0] dark:border-[#3A3A39] mt-auto mb-20 xl:mb-0">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-[#73716D] dark:text-[#8C8A86] text-xs font-medium">
            <Shield className="w-3 h-3" />
            <span>Open Source • No Tracking • No Ads</span>
          </div>
          <div className="flex gap-4">
            <a href="https://github.com/Mosiuropu/zen-tools" className="text-[#73716D] dark:text-[#8C8A86] hover:text-[#D97757] dark:hover:text-[#E28F73] transition-colors text-xs font-medium">GitHub</a>
          </div>
        </div>
      </footer>
      
      {/* Global Sound Player Placeholder (Invisible) */}
      <div id="zen-sound-engine" className="hidden" />
    </div>
  );
}

export default App;
