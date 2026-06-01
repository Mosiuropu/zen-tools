import React, { useState } from 'react';
import { Ruler, Calendar, Timer, Github, Shield, Sparkles, CheckCircle2, Brain, FileText } from 'lucide-react';
import UnitConverter from './components/UnitConverter';
import AgeCalculator from './components/AgeCalculator';
import CountdownTimer from './components/CountdownTimer';
import HabitTracker from './components/HabitTracker';
import ZenFocus from './components/ZenFocus';
import ZenNotes from './components/ZenNotes';

function App() {
  const [activeTab, setActiveTab] = useState('units');

  const tabs = [
    { id: 'units', label: 'Units', icon: <Ruler className="w-5 h-5" /> },
    { id: 'age', label: 'Age', icon: <Calendar className="w-5 h-5" /> },
    { id: 'habits', label: 'Habits', icon: <CheckCircle2 className="w-5 h-5" /> },
    { id: 'focus', label: 'Focus', icon: <Brain className="w-5 h-5" /> },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-5 h-5" /> },
    { id: 'countdown', label: 'Timer', icon: <Timer className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white">Zen Tools</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Minimal • Ad-Free • Powerful</p>
            </div>
          </div>

          <nav className="hidden lg:flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          <a 
            href="https://github.com/Mosiuropu/zen-tools" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <Github className="w-6 h-6" />
            <span className="hidden sm:inline font-bold text-sm">Star on GitHub</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-20">
        <div className="mb-16 text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            {activeTab === 'units' && "Convert units with zero friction."}
            {activeTab === 'age' && "Compare ages with precision."}
            {activeTab === 'countdown' && "Track your next big milestone."}
            {activeTab === 'habits' && "Master your daily routines."}
            {activeTab === 'focus' && "Enter a state of deep focus."}
            {activeTab === 'notes' && "Capture your best thoughts."}
          </h2>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
            A tool built for people who value time and clarity. No ads, no trackers, just clean functionality.
          </p>
        </div>

        {activeTab === 'units' && <UnitConverter />}
        {activeTab === 'age' && <AgeCalculator />}
        {activeTab === 'countdown' && <CountdownTimer />}
        {activeTab === 'habits' && <HabitTracker />}
        {activeTab === 'focus' && <ZenFocus />}
        {activeTab === 'notes' && <ZenNotes />}
      </main>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-2 rounded-3xl flex justify-between shadow-2xl z-50 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 p-3 min-w-[64px] rounded-2xl transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-slate-500'
            }`}
          >
            {tab.icon}
            <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-900 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <Shield className="w-4 h-4" />
            <span>Open Source • No Tracking • No Ads</span>
          </div>
          <div className="text-slate-600 text-sm">
            Created with passion to help people.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors font-bold text-sm">Privacy</a>
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors font-bold text-sm">Terms</a>
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors font-bold text-sm">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
