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
  Settings as SettingsIcon,
  BarChartHorizontal,
  KeyRound,
  Type,
  Watch,
  Palette,
  Globe,
  Command,
  LayoutDashboard,
  History
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
import ZenTimeline from './components/ZenTimeline';
import ZenPassword from './components/ZenPassword';
import ZenText from './components/ZenText';
import ZenStopwatch from './components/ZenStopwatch';
import ZenColor from './components/ZenColor';
import ZenWorldClock from './components/ZenWorldClock';
import CommandPalette from './components/CommandPalette';
import MobileMenu from './components/MobileMenu';
import HomePage from './components/HomePage';
import ZenEvents from './components/ZenEvents';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [paletteOpen, setPaletteOpen] = useState(false);
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
    { id: 'home', label: 'Home', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'units', label: 'Units', icon: <Ruler className="w-4 h-4" /> },
    { id: 'age', label: 'Age', icon: <Calendar className="w-4 h-4" /> },
    { id: 'events', label: 'Events', icon: <History className="w-4 h-4" /> },
    { id: 'habits', label: 'Habits', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'focus', label: 'Focus', icon: <Brain className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" /> },
    { id: 'priorities', label: 'Priorities', icon: <Target className="w-4 h-4" /> },
    { id: 'breathing', label: 'Breathing', icon: <Wind className="w-4 h-4" /> },
    { id: 'sounds', label: 'Sounds', icon: <Music className="w-4 h-4" /> },
    { id: 'clock', label: 'Clock', icon: <Clock className="w-4 h-4" /> },
    { id: 'worldclock', label: 'World', icon: <Globe className="w-4 h-4" /> },
    { id: 'countdown', label: 'Timer', icon: <Timer className="w-4 h-4" /> },
    { id: 'stopwatch', label: 'Stopwatch', icon: <Watch className="w-4 h-4" /> },
    { id: 'timeline', label: 'Timeline', icon: <BarChartHorizontal className="w-4 h-4" /> },
    { id: 'password', label: 'Password', icon: <KeyRound className="w-4 h-4" /> },
    { id: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
    { id: 'color', label: 'Color', icon: <Palette className="w-4 h-4" /> },
    { id: 'settings', label: 'Data', icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  return (
    <div id="app-root" className="min-h-screen flex flex-col font-mono transition-colors duration-200">
      {/* Header */}
      <header className="border-b border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] bg-[var(--color-zen-bg-light)]/80 dark:bg-[var(--color-zen-bg-dark)]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md flex items-center justify-center bg-[var(--color-zen-card-light)] dark:bg-[var(--color-zen-card-dark)] text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] border border-transparent">
              <Sparkles className="w-3 h-3 text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">Zen Tools</h1>
            </div>
          </div>

          <nav className="hidden xl:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-all ${
                  activeTab === tab.id
                    ? 'zen-card shadow-sm font-medium text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]'
                    : 'text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-md text-[11px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] transition-all"
            >
              <Command className="w-3 h-3" />
              <span>Search</span>
              <kbd className="text-[9px] px-1 py-0.5 rounded bg-[var(--color-zen-card-light)] dark:bg-[var(--color-zen-card-dark)]">⌘K</kbd>
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-1.5 rounded-md text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] transition-all"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a 
              href="https://github.com/Mosiuropu/zen-tools" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 p-1.5 rounded-md text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12">
        <div className="mb-10 space-y-2">
          {activeTab !== 'home' && (
            <>
              <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] tracking-tight">
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
                {activeTab === 'worldclock' && "Keep time across the world."}
                {activeTab === 'stopwatch' && "Measure every passing second."}
                {activeTab === 'timeline' && "Visualize your year."}
                {activeTab === 'password' && "Generate strong, private passwords."}
                {activeTab === 'text' && "Inspect and reshape your text."}
                {activeTab === 'color' && "Build a palette you love."}
                {activeTab === 'events' && "Visualize your life events."}
                {activeTab === 'settings' && "Manage your local data."}
              </h2>
              <p className="text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] text-xs md:text-sm">
                Minimal. Local. Ad-free.
              </p>
            </>
          )}
        </div>

        <div className="animate-in fade-in duration-300">
          {activeTab === 'home' && <HomePage onNavigate={setActiveTab} isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />}
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
          {activeTab === 'worldclock' && <ZenWorldClock />}
          {activeTab === 'stopwatch' && <ZenStopwatch />}
          {activeTab === 'timeline' && <ZenTimeline />}
          {activeTab === 'password' && <ZenPassword />}
          {activeTab === 'text' && <ZenText />}
          {activeTab === 'color' && <ZenColor />}
          {activeTab === 'events' && <ZenEvents />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </main>

      {/* Mobile Menu (Hamburger) */}
      <MobileMenu
        tabs={tabs}
        activeTab={activeTab}
        onSelect={setActiveTab}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Footer */}
      <footer className="py-6 border-t border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] mt-auto">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] text-xs font-medium">
            <Shield className="w-3 h-3" />
            <span>Open Source • No Tracking • No Ads</span>
          </div>
          <div className="flex gap-4">
            <a href="https://github.com/Mosiuropu/zen-tools" className="text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:text-[var(--color-zen-text-light)] dark:hover:text-[var(--color-zen-text-dark)] transition-colors text-xs font-medium">GitHub</a>
          </div>
        </div>
      </footer>
      
      {/* Command Palette */}
      <CommandPalette
        tabs={tabs}
        open={paletteOpen}
        setOpen={setPaletteOpen}
        onSelect={setActiveTab}
        isDark={isDark}
        toggleTheme={() => setIsDark(!isDark)}
      />

      {/* Global Sound Player Placeholder (Invisible) */}
      <div id="zen-sound-engine" className="hidden" />
    </div>
  );
}

export default App;
