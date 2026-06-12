import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, CloudRain, Wind, Waves, Coffee, Trees as Forest, Zap, Moon, Flame, Music } from 'lucide-react';

const SOUNDS = [
  { id: 'rain', name: 'Rainfall', icon: <CloudRain />, type: 'rain' },
  { id: 'ocean', name: 'Ocean Waves', icon: <Waves />, type: 'ocean' },
  { id: 'forest', name: 'Deep Forest', icon: <Forest />, type: 'forest' },
  { id: 'white', name: 'White Noise', icon: <Zap />, type: 'white' },
  { id: 'cafe', name: 'Zen Cafe', icon: <Coffee />, type: 'cafe' },
  { id: 'brown', name: 'Brown Noise', icon: <Moon />, type: 'brown' },
  { id: 'fire', name: 'Campfire', icon: <Flame />, type: 'fire' },
  { id: 'wind', name: 'Wind', icon: <Wind />, type: 'wind' },
];

export default function ZenSoundscapes() {
  const [activeSound, setActiveSound] = useState(null);
  const [volume, setVolume] = useState(0.4);
  const audioCtx = useRef(null);
  const nodes = useRef({});

  useEffect(() => {
    return () => {
      if (audioCtx.current) audioCtx.current.close();
    };
  }, []);

  const initAudio = () => {
    if (!audioCtx.current)
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
  };

  const startNoise = (type) => {
    initAudio();
    stopAll();
    const bufSize = 2 * audioCtx.current.sampleRate;
    const buf = audioCtx.current.createBuffer(1, bufSize, audioCtx.current.sampleRate);
    const out = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) out[i] = Math.random() * 2 - 1;
    const wNoise = audioCtx.current.createBufferSource();
    wNoise.buffer = buf;
    wNoise.loop = true;
    const filter = audioCtx.current.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = type === 'white' ? 20000 : type === 'brown' ? 200 : type === 'ocean' ? 500 : type === 'fire' ? 600 : type === 'wind' ? 3000 : 1000;
    if (type === 'ocean') {
      const lfo = audioCtx.current.createOscillator();
      const lfoG = audioCtx.current.createGain();
      lfo.frequency.value = 0.08;
      lfoG.gain.value = 400;
      lfo.connect(lfoG);
      lfoG.connect(filter.frequency);
      lfo.start();
      nodes.current.lfo = lfo;
    }
    const gain = audioCtx.current.createGain();
    gain.gain.value = volume;
    wNoise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.current.destination);
    wNoise.start();
    nodes.current = { ...nodes.current, source: wNoise, gain };
    setActiveSound(type);
  };

  const stopAll = () => {
    if (nodes.current.source) { try { nodes.current.source.stop(); } catch {} }
    if (nodes.current.lfo) { try { nodes.current.lfo.stop(); } catch {} }
    setActiveSound(null);
  };

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (nodes.current.gain)
      nodes.current.gain.gain.setValueAtTime(v, audioCtx.current.currentTime);
  };

  return (
    <div className="max-w-md mx-auto space-y-3 animate-fade-up">
      {/* Sound grid - compact 4-column */}
      <div className="grid grid-cols-4 gap-2">
        {SOUNDS.map((snd) => {
          const isActive = activeSound === snd.id;
          return (
            <button key={snd.id} onClick={() => isActive ? stopAll() : startNoise(snd.type)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all active:scale-95 ${
                isActive
                  ? 'border-[var(--color-zen-accent-primary-light)] dark:border-[var(--color-zen-accent-primary-dark)] bg-[var(--color-zen-accent-primary-light)]/10 dark:bg-[var(--color-zen-accent-primary-dark)]/10 shadow-md'
                  : 'border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] bg-[var(--color-zen-card-light)] dark:bg-[var(--color-zen-card-dark)] hover:border-[var(--color-zen-accent-primary-light)]/50 dark:hover:border-[var(--color-zen-accent-primary-dark)]/50'
              }`}>
              <div className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
                {React.cloneElement(snd.icon, {
                  className: `w-5 h-5 ${isActive ? 'text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]' : 'text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]'}`,
                })}
              </div>
              <span className={`text-[9px] font-semibold mt-1 ${isActive ? 'text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]' : 'text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]'}`}>
                {snd.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Player controls - compact */}
      <div className="zen-card p-3 flex items-center gap-3">
        <div className={`p-2 rounded-lg ${activeSound ? 'text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)] animate-pulse-soft' : 'text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]'}`}>
          {activeSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] truncate">
            {activeSound ? SOUNDS.find(s => s.id === activeSound)?.name : 'Silent'}
          </p>
          <p className="text-[9px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
            {activeSound ? 'Active' : 'Select a sound'}
          </p>
        </div>
        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolume}
          className="w-20 h-1.5 rounded-full appearance-none cursor-pointer accent-[var(--color-zen-accent-primary-light)] dark:accent-[var(--color-zen-accent-primary-dark)]" />
        <button onClick={stopAll} disabled={!activeSound}
          className="px-2.5 py-1.5 rounded-lg text-[10px] font-medium bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-30 disabled:cursor-default">
          Stop
        </button>
      </div>
    </div>
  );
}
