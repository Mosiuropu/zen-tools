import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, CloudRain, Wind, Waves, Coffee, Trees as Forest, Zap } from 'lucide-react';

const SOUNDS = [
  { id: 'rain', name: 'Rainfall', icon: <CloudRain />, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }, // Placeholders, but I'll use pure noise synths for better "Zen"
  { id: 'ocean', name: 'Ocean Waves', icon: <Waves />, type: 'ocean' },
  { id: 'forest', name: 'Deep Forest', icon: <Forest />, type: 'forest' },
  { id: 'white', name: 'White Noise', icon: <Zap />, type: 'white' },
  { id: 'cafe', name: 'Zen Cafe', icon: <Coffee />, type: 'cafe' },
];

export default function ZenSoundscapes() {
  const [activeSound, setActiveSound] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const audioCtx = useRef(null);
  const nodes = useRef({});

  // Initialize Web Audio API for synthetic sounds
  useEffect(() => {
    return () => {
      if (audioCtx.current) {
        audioCtx.current.close();
      }
    };
  }, []);

  const initAudio = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  const startNoise = (type) => {
    initAudio();
    stopAll();

    const bufferSize = 2 * audioCtx.current.sampleRate;
    const buffer = audioCtx.current.createBuffer(1, bufferSize, audioCtx.current.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = audioCtx.current.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    const filter = audioCtx.current.createBiquadFilter();
    
    if (type === 'white') {
      filter.type = 'lowpass';
      filter.frequency.value = 20000;
    } else if (type === 'ocean') {
      filter.type = 'lowpass';
      filter.frequency.value = 500;
      // Add LFO for wave effect
      const lfo = audioCtx.current.createOscillator();
      const lfoGain = audioCtx.current.createGain();
      lfo.frequency.value = 0.1;
      lfoGain.gain.value = 300;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      nodes.current.lfo = lfo;
    } else if (type === 'forest' || type === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.value = 1000;
    }

    const gainNode = audioCtx.current.createGain();
    gainNode.gain.value = volume;

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.current.destination);

    whiteNoise.start();
    
    nodes.current.source = whiteNoise;
    nodes.current.gain = gainNode;
    setActiveSound(type);
  };

  const stopAll = () => {
    if (nodes.current.source) {
      nodes.current.source.stop();
      nodes.current.source.disconnect();
    }
    if (nodes.current.lfo) {
      nodes.current.lfo.stop();
      nodes.current.lfo.disconnect();
    }
    setActiveSound(null);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (nodes.current.gain) {
      nodes.current.gain.gain.setValueAtTime(val, audioCtx.current.currentTime);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-500">Synthetic Zen</h3>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          Pure, algorithmically generated soundscapes. No loops, no gaps, just infinite focus.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {SOUNDS.map((sound) => (
          <button
            key={sound.id}
            onClick={() => activeSound === sound.id ? stopAll() : startNoise(sound.id)}
            className={`flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 transition-all group ${
              activeSound === sound.id 
                ? 'bg-zinc-900 border-blue-500 text-white shadow-sm shadow-blue-900/40 scale-105' 
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-slate-400 hover:border-blue-500/50 hover:text-zinc-600 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-4 rounded-md mb-4 transition-all ${activeSound === sound.id ? 'bg-white/20' : 'bg-zinc-50 dark:bg-zinc-950 group-hover:scale-110'}`}>
              {React.cloneElement(sound.icon, { className: "w-8 h-8" })}
            </div>
            <span className="font-semibold text-sm tracking-tight">{sound.name}</span>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] p-8 md:p-12 shadow-2xl space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
             <div className={`p-5 rounded-md ${activeSound ? 'bg-zinc-900 text-white animate-pulse' : 'bg-zinc-100 dark:bg-zinc-950 text-slate-400'}`}>
                {activeSound ? <Volume2 className="w-8 h-8" /> : <VolumeX className="w-8 h-8" />}
             </div>
             <div>
               <h4 className="text-base font-semibold text-slate-800 dark:text-zinc-50">
                 {activeSound ? SOUNDS.find(s => s.id === activeSound)?.name : 'System Silent'}
               </h4>
               <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                 {activeSound ? 'Active Soundscape' : 'Select a sound to begin'}
               </p>
             </div>
          </div>

          <div className="flex-1 w-full max-w-md space-y-3">
             <div className="flex justify-between text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">
               <span>Mute</span>
               <span>Intensity</span>
             </div>
             <input
               type="range"
               min="0"
               max="1"
               step="0.01"
               value={volume}
               onChange={handleVolumeChange}
               className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-md appearance-none cursor-pointer accent-blue-600"
             />
          </div>

          <button
            onClick={stopAll}
            disabled={!activeSound}
            className="px-8 py-4 rounded-md bg-slate-950 text-white font-semibold hover:bg-red-600 transition-all disabled:opacity-0"
          >
            Stop All
          </button>
        </div>
      </div>
    </div>
  );
}
