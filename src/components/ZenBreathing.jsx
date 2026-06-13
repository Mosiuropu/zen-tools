import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Wind, Info } from 'lucide-react';

const TECHNIQUES = {
  box: {
    name: 'Box Breathing',
    description: 'Navy SEAL technique for stress management',
    steps: [
      { label: 'Inhale', duration: 4, scale: 1.45, color: '#F2A93B' },
      { label: 'Hold', duration: 4, scale: 1.45, color: '#2DB39B' },
      { label: 'Exhale', duration: 4, scale: 1, color: '#9B6DF2' },
      { label: 'Hold', duration: 4, scale: 1, color: '#4FA3F2' },
    ],
  },
  relax: {
    name: '4-7-8 Relax',
    description: 'Natural tranquilizer for the nervous system',
    steps: [
      { label: 'Inhale', duration: 4, scale: 1.45, color: '#F2A93B' },
      { label: 'Hold', duration: 7, scale: 1.45, color: '#2DB39B' },
      { label: 'Exhale', duration: 8, scale: 1, color: '#9B6DF2' },
    ],
  },
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
            setCurrentStepIndex((idx) => (idx + 1) % activeTech.steps.length);
            return 0;
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

  return (
    <div className="max-w-lg mx-auto space-y-5 animate-fade-up">
      {/* Technique chips */}
      <div className="flex justify-center gap-2">
        {Object.entries(TECHNIQUES).map(([key, data]) => (
          <button
            key={key}
            onClick={() => { setTechnique(key); setIsActive(false); }}
            className="zen-chip"
            style={
              technique === key
                ? { background: 'color-mix(in srgb, var(--color-zen-violet) 12%, transparent)', color: 'var(--color-zen-violet)', borderColor: 'var(--color-zen-violet)' }
                : { borderColor: 'var(--color-zen-border-light)', color: 'var(--color-zen-muted-light)' }
            }
          >
            {data.name}
          </button>
        ))}
      </div>

      {/* Breathing card — compact */}
      <div className="zen-card p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[340px]">
        {/* soft glow */}
        <div
          className="absolute w-56 h-56 rounded-full blur-[70px] transition-all duration-[3000ms] ease-in-out"
          style={{ background: isActive ? currentStep.color : 'var(--color-zen-violet)', opacity: isActive ? 0.25 : 0.1 }}
        />

        <div className="relative z-10 flex flex-col items-center gap-7">
          {/* circle */}
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center shadow-xl transition-all ease-in-out"
            style={{
              transform: `scale(${isActive ? currentStep.scale : 1})`,
              background: isActive ? currentStep.color : 'var(--color-zen-card-light)',
              border: isActive ? '4px solid rgba(255,255,255,0.4)' : '4px solid var(--color-zen-border-light)',
              transitionDuration: `${(isActive ? currentStep.duration : 1) * 1000}ms`,
            }}
          >
            {isActive ? (
              <span className="text-3xl font-bold text-white tabular-nums drop-shadow">{timeLeft}</span>
            ) : (
              <Wind className="w-9 h-9 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]" />
            )}
          </div>

          <div className="text-center space-y-1">
            <h4 className="text-lg font-semibold tracking-tight" style={isActive ? { color: currentStep.color } : undefined}>
              {isActive ? currentStep.label : 'Ready?'}
            </h4>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
              {isActive ? `${activeTech.name} active` : activeTech.description}
            </p>
          </div>

          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-8 py-3 rounded-full font-semibold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-lg ${
              isActive
                ? 'zen-btn-secondary hover:text-[var(--color-zen-rose)]'
                : 'zen-btn-primary'
            }`}
          >
            {isActive ? <><Square className="w-4 h-4 fill-current" /> Stop</> : <><Play className="w-4 h-4 fill-current" /> Begin</>}
          </button>
        </div>
      </div>

      {/* Step legend */}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${activeTech.steps.length}, minmax(0, 1fr))` }}>
        {activeTech.steps.map((s, i) => (
          <div
            key={i}
            className={`zen-card px-3 py-2.5 text-center transition-all ${isActive && i === currentStepIndex ? 'ring-2' : ''}`}
            style={isActive && i === currentStepIndex ? { '--tw-ring-color': s.color } : undefined}
          >
            <div className="w-2 h-2 rounded-full mx-auto mb-1.5" style={{ background: s.color }} />
            <div className="text-xs font-semibold leading-none">{s.label}</div>
            <div className="text-[9px] font-semibold text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] mt-0.5">{s.duration}s</div>
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="zen-card px-4 py-3 flex items-start gap-3">
        <Info className="w-4 h-4 text-[var(--color-zen-sky)] mt-0.5 shrink-0" />
        <p className="text-xs text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] leading-relaxed">
          Sit comfortably, keep your back straight, and let your breath follow the pacer. Lowers cortisol, improves focus.
        </p>
      </div>
    </div>
  );
}
