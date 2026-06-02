import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Settings2, Wind, Info } from 'lucide-react';

const TECHNIQUES = {
  box: {
    name: 'Box Breathing',
    description: 'The Navy SEAL technique for stress management.',
    steps: [
      { label: 'Inhale', duration: 4, scale: 'scale-150', color: 'bg-orange-500' },
      { label: 'Hold', duration: 4, scale: 'scale-150', color: 'bg-emerald-500' },
      { label: 'Exhale', duration: 4, scale: 'scale-100', color: 'bg-violet-500' },
      { label: 'Hold', duration: 4, scale: 'scale-100', color: 'bg-[var(--color-zen-bg-light)] dark:bg-[var(--color-zen-bg-dark)]0' }
    ]
  },
  relax: {
    name: '4-7-8 Relax',
    description: 'Natural tranquilizer for the nervous system.',
    steps: [
      { label: 'Inhale', duration: 4, scale: 'scale-150', color: 'bg-orange-500' },
      { label: 'Hold', duration: 7, scale: 'scale-150', color: 'bg-emerald-500' },
      { label: 'Exhale', duration: 8, scale: 'scale-100', color: 'bg-violet-500' }
    ]
  }
};

export default function ZenBreathing() {
  const [technique, setTechnique] = useState('box');
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  const activeTech = TECHNIQUES[technique];
  const currentStep = activeTech.steps[currentStepIndex];

  useEffect(() => {
    if (isActive) {
      setTimeLeft(currentStep.duration);
      
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Next step
            setCurrentStepIndex((idx) => (idx + 1) % activeTech.steps.length);
            return 0; // Will be reset by the effect dependency on currentStepIndex
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setCurrentStepIndex(0);
      setTimeLeft(0);
    }
    
    return () => clearInterval(timerRef.current);
  }, [isActive, currentStepIndex, technique]);

  const toggleBreathing = () => setIsActive(!isActive);

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-center gap-4">
        {Object.entries(TECHNIQUES).map(([key, data]) => (
          <button
            key={key}
            onClick={() => { setTechnique(key); setIsActive(false); }}
            className={`px-8 py-3 rounded-md font-semibold text-sm transition-all border-2 ${
              technique === key 
                ? 'bg-[var(--color-zen-card-light)] dark:bg-[var(--color-zen-card-dark)]/10 border-orange-500 text-[var(--color-zen-accent-primary)]' 
                : 'bg-[var(--color-zen-card-light)] dark:bg-[var(--color-zen-bg-dark)] dark:bg-[var(--color-zen-card-dark)] border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] dark:border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] dark:hover:border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)]'
            }`}
          >
            {data.name}
          </button>
        ))}
      </div>

      <div className="bg-[var(--color-zen-card-light)] dark:bg-[var(--color-zen-bg-dark)] dark:bg-[var(--color-zen-card-dark)] border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] dark:border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] rounded-[4rem] p-12 md:p-24 shadow-2xl flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
        {/* Background Visualizer */}
        <div 
          className={`absolute w-64 h-64 md:w-80 md:h-80 rounded-md blur-[80px] opacity-20 transition-all duration-[4000ms] ease-in-out ${isActive ? currentStep.color : 'bg-[var(--color-zen-bg-light)] dark:bg-[var(--color-zen-bg-dark)]0'}`}
        />

        {/* The Breathing Circle */}
        <div className="relative z-10 flex flex-col items-center space-y-12">
          <div 
            className={`w-32 h-32 md:w-48 md:h-48 rounded-md border-8 border-white dark:border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] flex items-center justify-center transition-all duration-[4000ms] ease-in-out shadow-2xl ${isActive ? `${currentStep.scale} ${currentStep.color} border-transparent` : 'bg-[var(--color-zen-border-light)] dark:bg-[var(--color-zen-bg-dark)] dark:bg-[var(--color-zen-bg-dark)] scale-100'}`}
          >
            <div className="text-sm md:text-base font-semibold text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] dark:text-[var(--color-zen-text-dark)] tabular-nums">
              {isActive ? timeLeft : <Wind className="w-12 h-12 md:w-16 md:h-16 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-text-dark)] dark:text-[var(--color-zen-text-dark)]" />}
            </div>
          </div>

          <div className="text-center space-y-2">
            <h4 className={`text-sm md:text-base font-semibold tracking-tight transition-all duration-500 ${isActive ? 'text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] dark:text-[var(--color-zen-text-dark)]' : 'text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-text-dark)] dark:text-[var(--color-zen-text-dark)]'}`}>
              {isActive ? currentStep.label : 'Ready?'}
            </h4>
            <p className="text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-text-dark)] dark:text-[var(--color-zen-text-dark)]0 font-semibold uppercase tracking-[0.2em] text-xs">
              {isActive ? `${activeTech.name} Active` : activeTech.description}
            </p>
          </div>

          <button
            onClick={toggleBreathing}
            className={`px-12 py-5 rounded-[2rem] font-semibold text-sm flex items-center gap-3 transition-all active:scale-95 shadow-2xl ${
              isActive 
                ? 'bg-[var(--color-zen-border-light)] dark:bg-[var(--color-zen-bg-dark)] dark:bg-[var(--color-zen-border-dark)] text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] dark:text-[var(--color-zen-text-dark)] hover:bg-red-500/10 hover:text-red-500' 
                : 'zen-btn-primary'
            }`}
          >
            {isActive ? <><Square className="w-5 h-5 fill-current" /> Stop</> : <><Play className="w-5 h-5 fill-current" /> Begin Session</>}
          </button>
        </div>
      </div>

      <div className="bg-[var(--color-zen-card-light)] dark:bg-[var(--color-zen-card-dark)]/5 dark:bg-blue-950/20 border border-orange-500/20 rounded-md p-6 flex items-start gap-4">
        <Info className="w-6 h-6 text-[var(--color-zen-accent-primary)] mt-1 shrink-0" />
        <p className="text-sm text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-text-dark)] dark:text-[var(--color-zen-muted-dark)] leading-relaxed">
          <strong>Tip:</strong> Find a comfortable seated position, keep your back straight, and let your breath flow naturally with the visual pacer. This practice helps lower cortisol and improves mental focus.
        </p>
      </div>
    </div>
  );
}
