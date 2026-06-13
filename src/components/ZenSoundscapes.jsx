import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, CloudRain, Wind, Waves, Coffee, Trees as Forest, Zap, Music, ExternalLink, Radio, Headphones, Moon, Piano } from 'lucide-react';

const SOUNDS = [
  { id: 'rain', name: 'Rainfall', icon: CloudRain, color: '#4FA3F2' },
  { id: 'ocean', name: 'Ocean', icon: Waves, color: '#2DB39B' },
  { id: 'forest', name: 'Forest', icon: Forest, color: '#5BAE52' },
  { id: 'white', name: 'White Noise', icon: Zap, color: '#9B6DF2' },
  { id: 'cafe', name: 'Zen Cafe', icon: Coffee, color: '#F2A93B' },
];

const MUSIC_LINKS = [
  { name: 'Lofi Girl — beats to relax/study', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', icon: Headphones, color: '#9B6DF2' },
  { name: 'Chillhop Radio', url: 'https://www.youtube.com/watch?v=5yx6BWlEVcY', icon: Radio, color: '#F2A93B' },
  { name: 'Deep Focus — Spotify', url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ', icon: Music, color: '#2DB39B' },
  { name: 'Peaceful Piano — Spotify', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO', icon: Piano, color: '#4FA3F2' },
  { name: 'Sleep — Spotify', url: 'https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp', icon: Moon, color: '#F26D6D' },
  { name: 'Ambient Worlds — YouTube', url: 'https://www.youtube.com/c/AmbientWorlds', icon: Wind, color: '#5BAE52' },
];

export default function ZenSoundscapes() {
  const [activeSound, setActiveSound] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const audioCtx = useRef(null);
  const nodes = useRef({});

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
    } else if (type === 'cafe') {
      filter.type = 'bandpass';
      filter.frequency.value = 800;
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
    nodes.current = {};
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
    <div className="max-w-3xl mx-auto space-y-5 animate-fade-up">
      {/* Sound tiles */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {SOUNDS.map((sound) => {
          const Icon = sound.icon;
          const active = activeSound === sound.id;
          return (
            <button
              key={sound.id}
              onClick={() => (active ? stopAll() : startNoise(sound.id))}
              className={`zen-card flex flex-col items-center gap-2 px-3 py-4 transition-all hover:-translate-y-0.5 ${active ? 'ring-2 scale-[1.03]' : ''}`}
              style={active ? { '--tw-ring-color': sound.color } : undefined}
            >
              <div
                className="p-2.5 rounded-xl transition-all"
                style={{
                  background: `color-mix(in srgb, ${sound.color} ${active ? 18 : 10}%, transparent)`,
                  color: sound.color,
                }}
              >
                <Icon className={`w-5 h-5 ${active ? 'animate-pulse-soft' : ''}`} />
              </div>
              <span className="text-[11px] font-semibold tracking-tight">{sound.name}</span>
            </button>
          );
        })}
      </div>

      {/* Compact control bar */}
      <div className="zen-card px-5 py-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-3 sm:min-w-44">
          <div
            className={`p-2.5 rounded-xl ${activeSound ? 'animate-pulse-soft' : ''}`}
            style={
              activeSound
                ? { background: `color-mix(in srgb, ${SOUNDS.find((s) => s.id === activeSound)?.color} 15%, transparent)`, color: SOUNDS.find((s) => s.id === activeSound)?.color }
                : { background: 'var(--color-zen-bg-light)', color: 'var(--color-zen-muted-light)' }
            }
          >
            {activeSound ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-sm font-semibold leading-none">
              {activeSound ? SOUNDS.find((s) => s.id === activeSound)?.name : 'Silent'}
            </div>
            <div className="text-[9px] font-semibold uppercase tracking-widest text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] mt-1">
              {activeSound ? 'Now playing' : 'Pick a sound'}
            </div>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--color-zen-border-light)] dark:bg-[var(--color-zen-border-dark)] accent-[var(--color-zen-accent-primary-light)] dark:accent-[var(--color-zen-accent-primary-dark)]"
        />

        <button
          onClick={stopAll}
          disabled={!activeSound}
          className="zen-btn-secondary px-4 py-2 text-xs disabled:opacity-30 hover:text-[var(--color-zen-rose)]"
        >
          Stop
        </button>
      </div>

      {/* Music links */}
      <div className="zen-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Music className="w-4 h-4 text-[var(--color-zen-violet)]" />
          <h4 className="text-sm font-semibold">Focus music</h4>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {MUSIC_LINKS.map((m) => {
            const Icon = m.icon;
            return (
              <a
                key={m.url}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--color-zen-bg-light)] dark:bg-[var(--color-zen-bg-dark)] border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] hover:-translate-y-0.5 transition-all group"
              >
                <div className="p-1.5 rounded-lg" style={{ background: `color-mix(in srgb, ${m.color} 12%, transparent)`, color: m.color }}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="flex-1 text-xs font-semibold truncate">{m.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
