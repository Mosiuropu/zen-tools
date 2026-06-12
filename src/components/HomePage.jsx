import React, { useState, useEffect, useMemo } from 'react';
import {
  Ruler,
  Calendar,
  Timer,
  CheckCircle2,
  Brain,
  FileText,
  Target,
  Wind,
  Music,
  Clock,
  Watch,
  BarChartHorizontal,
  KeyRound,
  Type,
  Palette,
  Globe,
  Sparkles,
  Github,
  ChevronRight,
  ArrowUpRight,
  Quote,
  Zap,
  Lock,
  Heart,
  Layers,
  Gauge,
  Moon,
  Sun,
  Search,
  X,
} from 'lucide-react';

const tools = [
  { id: 'units', icon: Ruler, title: 'Unit Converter', desc: 'Fast, real-time conversion for Length, Weight, Temperature, and Data Size.', color: 'from-blue-500/20 to-cyan-500/20' },
  { id: 'age', icon: Calendar, title: 'Age Calculator', desc: 'Compare ages across dates with precision down to the day.', color: 'from-emerald-500/20 to-teal-500/20' },
  { id: 'countdown', icon: Timer, title: 'Countdown Timer', desc: 'A distraction-free countdown for your projects and milestones.', color: 'from-rose-500/20 to-pink-500/20' },
  { id: 'habits', icon: CheckCircle2, title: 'Habit Tracker', desc: 'World-class habit tracking with consistency grids and heatmaps.', color: 'from-amber-500/20 to-orange-500/20' },
  { id: 'focus', icon: Brain, title: 'Zen Focus', desc: 'Premium Pomodoro timer with auto-transitions and ambient cues.', color: 'from-violet-500/20 to-purple-500/20' },
  { id: 'notes', icon: FileText, title: 'Zen Notes', desc: 'Distraction-free markdown sanctuary with Focus Mode and auto-save.', color: 'from-sky-500/20 to-indigo-500/20' },
  { id: 'priorities', icon: Target, title: 'Daily Priorities', desc: 'The Rule of 3 — exactly three high-impact tasks to master your day.', color: 'from-red-500/20 to-rose-500/20' },
  { id: 'breathing', icon: Wind, title: 'Zen Breathing', desc: 'Visual meditation guides for Box Breathing and 4-7-8 Stress Relief.', color: 'from-green-500/20 to-emerald-500/20' },
  { id: 'sounds', icon: Music, title: 'Soundscapes', desc: 'Algorithmically generated ambient noise using the Web Audio API.', color: 'from-fuchsia-500/20 to-pink-500/20' },
  { id: 'clock', icon: Clock, title: 'Zen Clock', desc: 'Combined digital and analog clock with a swinging pendulum.', color: 'from-slate-500/20 to-gray-500/20' },
  { id: 'worldclock', icon: Globe, title: 'World Clock', desc: 'Track time across multiple cities with day/night indicators.', color: 'from-cyan-500/20 to-blue-500/20' },
  { id: 'stopwatch', icon: Watch, title: 'Stopwatch', desc: 'Precise rAF-driven stopwatch with laps and split highlighting.', color: 'from-yellow-500/20 to-amber-500/20' },
  { id: 'timeline', icon: BarChartHorizontal, title: 'Timeline', desc: 'Visualize your year at a glance with an interactive timeline.', color: 'from-indigo-500/20 to-violet-500/20' },
  { id: 'password', icon: KeyRound, title: 'Password Generator', desc: 'Cryptographically secure passwords with a live entropy meter.', color: 'from-teal-500/20 to-emerald-500/20' },
  { id: 'text', icon: Type, title: 'Text Toolkit', desc: 'Live word stats and nine one-click case transforms.', color: 'from-orange-500/20 to-amber-500/20' },
  { id: 'color', icon: Palette, title: 'Color Palette', desc: 'Generate harmonious palettes, lock shades, copy hex with a click.', color: 'from-purple-500/20 to-fuchsia-500/20' },
];

const stats = [
  { icon: Zap, label: 'Zero Tracking', value: '100%' },
  { icon: Gauge, label: 'Performance', value: 'Lightning' },
  { icon: Lock, label: 'Privacy First', value: 'Local-Only' },
  { icon: Layers, label: 'Tools', value: '16+' },
];

const testimonials = [
  {
    quote: 'Finally, a tool collection that respects my privacy. No ads, no tracking, just pure utility.',
    author: 'Alex Chen',
    role: 'Software Engineer',
  },
  {
    quote: 'The Habit Tracker and Pomodoro timer alone transformed my workflow. Clean, fast, beautiful.',
    author: 'Sarah Mitchell',
    role: 'Product Designer',
  },
  {
    quote: 'I replaced five separate bookmarklets with this single page. Everything I need, nothing I don\'t.',
    author: 'Marcus Rivera',
    role: 'Independent Developer',
  },
];

function handleSmoothNavigate(onNavigate, toolId) {
  // Animate out, then navigate
  const root = document.getElementById('app-root');
  if (root) {
    root.style.opacity = '0';
    root.style.transform = 'translateY(8px)';
    root.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  }
  setTimeout(() => {
    onNavigate(toolId);
    // Restore opacity after navigation triggers re-render
    requestAnimationFrame(() => {
      if (root) {
        root.style.opacity = '1';
        root.style.transform = 'translateY(0)';
      }
    });
  }, 180);
}

export default function HomePage({ onNavigate, isDark, onToggleTheme }) {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setVisible(true);
  }, []);

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools;
    const q = searchQuery.toLowerCase().trim();
    return tools.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-zen-accent-primary-light)]/3 dark:bg-[var(--color-zen-accent-primary-dark)]/3 rounded-full blur-3xl translate-x-1/2 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--color-zen-accent-primary-light)]/2 dark:bg-[var(--color-zen-accent-primary-dark)]/2 rounded-full blur-3xl -translate-x-1/3 translate-y-1/4" />
        </div>

        <div className={`max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 md:pt-28 md:pb-20 relative z-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center max-w-3xl mx-auto mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] bg-[var(--color-zen-card-light)]/50 dark:bg-[var(--color-zen-card-dark)]/50 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] mb-6 backdrop-blur-sm animate-fade-up">
              <Sparkles className="w-3 h-3 text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]" />
              <span>Open Source &bull; No Tracking &bull; No Ads</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] mb-6 leading-tight animate-fade-up animation-delay-100">
              A minimalist toolkit
              <br />
              <span className="text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]">for a focused mind</span>
            </h1>

            <p className="text-lg text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] max-w-xl mx-auto mb-10 animate-fade-up animation-delay-200 leading-relaxed">
              Zen Tools is a curated collection of fast, private, ad-free utilities — 
              built for people who value their time and appreciate clean design.
            </p>

            <div className="flex items-center justify-center gap-4 animate-fade-up animation-delay-300">
              <button
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium bg-[var(--color-zen-accent-primary-light)] dark:bg-[var(--color-zen-accent-primary-dark)] text-white hover:bg-[var(--color-zen-accent-hover-light)] dark:hover:bg-[var(--color-zen-accent-hover-dark)] transition-all shadow-sm hover:shadow-md"
              >
                Explore Tools
                <ChevronRight className="w-4 h-4" />
              </button>
              <a
                href="https://github.com/Mosiuropu/zen-tools"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] transition-all"
              >
                <Github className="w-4 h-4" />
                View on GitHub
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] bg-[var(--color-zen-card-light)]/50 dark:bg-[var(--color-zen-card-dark)]/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`text-center animate-fade-up animation-delay-${(i + 1) * 100}`}>
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]" />
                <div className="text-lg font-semibold text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">{stat.value}</div>
                <div className="text-xs text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] font-medium tracking-wide uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] mb-3 tracking-tight">
              Everything you need, nothing you don't
            </h2>
            <p className="text-sm text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] max-w-lg mx-auto mb-6">
              Sixteen thoughtfully crafted tools, each designed with one thing in mind: getting out of your way.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]" />
              </div>
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-md text-xs bg-[var(--color-zen-card-light)] dark:bg-[var(--color-zen-card-dark)] border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] placeholder:text-[var(--color-zen-muted-light)] dark:placeholder:text-[var(--color-zen-muted-dark)] focus:ring-1 focus:ring-[var(--color-zen-accent-primary-light)] dark:focus:ring-[var(--color-zen-accent-primary-dark)] focus:border-[var(--color-zen-accent-primary-light)] dark:focus:border-[var(--color-zen-accent-primary-dark)] outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:text-[var(--color-zen-text-light)] dark:hover:text-[var(--color-zen-text-dark)] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {searchQuery && (
              <p className="text-xs text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] mt-3">
                {filteredTools.length === 0
                  ? 'No tools match your search.'
                  : `Found ${filteredTools.length} tool${filteredTools.length === 1 ? '' : 's'}.`}
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {filteredTools.map((tool, i) => (
              <button
                key={tool.id}
                onClick={() => handleSmoothNavigate(onNavigate, tool.id)}
                className="group relative text-left p-4 md:p-5 rounded-lg border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] bg-[var(--color-zen-card-light)] dark:bg-[var(--color-zen-card-dark)] hover:border-[var(--color-zen-accent-primary-light)] dark:hover:border-[var(--color-zen-accent-primary-dark)] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 animate-fade-up"
                style={{ animationDelay: `${(i % 8) * 80 + 100}ms` }}
              >
                <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${tool.color} pointer-events-none`} />

                <div className="relative z-10">
                  <div className="w-9 h-9 rounded-md flex items-center justify-center bg-[var(--color-zen-bg-light)] dark:bg-[var(--color-zen-bg-dark)] border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] mb-3 group-hover:border-[var(--color-zen-accent-primary-light)] dark:group-hover:border-[var(--color-zen-accent-primary-dark)] transition-colors">
                    <tool.icon className="w-4 h-4 text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]" />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] mb-1.5 group-hover:text-[var(--color-zen-accent-primary-light)] dark:group-hover:text-[var(--color-zen-accent-primary-dark)] transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {filteredTools.length === 0 && searchQuery && (
            <div className="text-center py-12 animate-fade-up">
              <Search className="w-8 h-8 mx-auto mb-3 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] opacity-40" />
              <p className="text-sm text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
                Try a different search term.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 border-t border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] bg-[var(--color-zen-card-light)]/30 dark:bg-[var(--color-zen-card-dark)]/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] mb-3 tracking-tight">
              Loved by people who value focus
            </h2>
            <p className="text-sm text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
              What our users are saying
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-5 md:p-6 rounded-lg border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] bg-[var(--color-zen-card-light)] dark:bg-[var(--color-zen-card-dark)] animate-fade-up"
                style={{ animationDelay: `${i * 150 + 200}ms` }}
              >
                <Quote className="w-5 h-5 text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)] mb-3 opacity-60" />
                <p className="text-sm text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] mb-4 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-[var(--color-zen-accent-primary-light)] dark:bg-[var(--color-zen-accent-primary-dark)] text-white">
                    {t.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">{t.author}</div>
                    <div className="text-[10px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="p-8 md:p-10 rounded-lg border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] bg-[var(--color-zen-card-light)] dark:bg-[var(--color-zen-card-dark)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-zen-accent-primary-light)]/5 dark:bg-[var(--color-zen-accent-primary-dark)]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <Heart className="w-8 h-8 mx-auto mb-4 text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]" />
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] mb-3 tracking-tight">
                Start your focused journey
              </h2>
              <p className="text-sm text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] mb-8 max-w-md mx-auto leading-relaxed">
                No sign-up required. No data collection. Just tools that work,
                instantly, in your browser. Always free, forever.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => handleSmoothNavigate(onNavigate, 'units')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium bg-[var(--color-zen-accent-primary-light)] dark:bg-[var(--color-zen-accent-primary-dark)] text-white hover:bg-[var(--color-zen-accent-hover-light)] dark:hover:bg-[var(--color-zen-accent-hover-dark)] transition-all shadow-sm"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onToggleTheme}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] transition-all"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  Try {isDark ? 'Light' : 'Dark'} Mode
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
