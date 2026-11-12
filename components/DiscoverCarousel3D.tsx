'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Track } from '@/lib/types';
import { SafeImage } from './SafeImage';

export interface DiscoverItem {
  id: string;
  trackNumber: string;
  bpm: number;
  mode: string;
  title: string;
  subtitle: string;
  coverUrl: string;
  track: Track;
}

interface DiscoverCarousel3DProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  theme?: 'dark' | 'light';
  onPlayTrack: (track: Track) => void;
}

const DISCOVER_ITEMS: DiscoverItem[] = [
  {
    id: 'disc-1',
    trackNumber: '01 / 06',
    bpm: 128,
    mode: 'Neon Synth',
    title: 'MIDNIGHT DRIVE',
    subtitle: 'Chasing electric horizons across the midnight city',
    coverUrl: '/album-midnight-drive.jpg',
    track: {
      id: 'trk-midnight',
      title: 'Midnight Drive',
      artist: 'Sonic Synth',
      album: 'Night Visions',
      duration: 218,
      coverUrl: '/album-midnight-drive.jpg',
      youtubeId: 'MV_3Dpw-BRY',
      youtubeUrl: 'https://www.youtube.com/watch?v=MV_3Dpw-BRY',
      genre: 'Retrowave',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
  },
  {
    id: 'disc-2',
    trackNumber: '02 / 06',
    bpm: 84,
    mode: 'Lydian 48kHz',
    title: 'CELESTIAL TEMPLE',
    subtitle: 'Sanctuary above the clouds of dawn • Ethereal choir & sub drone',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80',
    track: {
      id: 'trk-celestial',
      title: 'Celestial Temple',
      artist: 'Sonic Ambient Studio',
      album: 'Sanctuary Masters',
      duration: 245,
      coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80',
      youtubeId: 'TWcyIpul8OE',
      youtubeUrl: 'https://www.youtube.com/watch?v=TWcyIpul8OE',
      genre: 'Ambient Master',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
  },
  {
    id: 'disc-3',
    trackNumber: '03 / 06',
    bpm: 96,
    mode: 'Aeolian Deep',
    title: 'LIVING LAGOON',
    subtitle: 'Subaquatic bioluminescence & resonant analog harmonics',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
    track: {
      id: 'trk-lagoon',
      title: 'Living Lagoon',
      artist: 'Lumina Echo',
      album: 'Deep Tides',
      duration: 210,
      coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
      youtubeId: '8inJtTG_leQ',
      youtubeUrl: 'https://www.youtube.com/watch?v=8inJtTG_leQ',
      genre: 'Chillwave',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
  },
  {
    id: 'disc-4',
    trackNumber: '04 / 06',
    bpm: 72,
    mode: 'Warm Acoustic',
    title: 'LOST IN YOU',
    subtitle: 'Golden hour amber whispers • Intimate fingerstyle strings',
    coverUrl: '/album-lost-in-you.jpg',
    track: {
      id: 'trk-lost-in-you',
      title: 'Lost in You',
      artist: 'Lumina',
      album: 'Acoustic Journeys',
      duration: 185,
      coverUrl: '/album-lost-in-you.jpg',
      youtubeId: '3AtDnEC4zak',
      youtubeUrl: 'https://www.youtube.com/watch?v=3AtDnEC4zak',
      genre: 'Indie Folk',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
  },
  {
    id: 'disc-5',
    trackNumber: '05 / 06',
    bpm: 110,
    mode: 'Sunset Amber',
    title: 'BETTER DAYS',
    subtitle: 'Misty mountain reverberations & cinematic orchestral crescendos',
    coverUrl: '/album-better-days.jpg',
    track: {
      id: 'trk-better-days',
      title: 'Better Days',
      artist: 'Lumina Echo',
      album: 'Mountain Air',
      duration: 232,
      coverUrl: '/album-better-days.jpg',
      youtubeId: 'hT_nvWreIhg',
      youtubeUrl: 'https://www.youtube.com/watch?v=hT_nvWreIhg',
      genre: 'Cinematic Ambient',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
  },
  {
    id: 'disc-6',
    trackNumber: '06 / 06',
    bpm: 140,
    mode: 'Analog Drift',
    title: 'MIDNIGHT TOKYO',
    subtitle: 'Rain-soaked asphalt, halogen reflections & deep analog bassline',
    coverUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000&auto=format&fit=crop&q=80',
    track: {
      id: 'trk-tokyo',
      title: 'Midnight Tokyo',
      artist: 'Sonic Synth',
      album: 'Neo Shibuya',
      duration: 205,
      coverUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000&auto=format&fit=crop&q=80',
      youtubeId: 'fHI8X480mxo',
      youtubeUrl: 'https://www.youtube.com/watch?v=fHI8X480mxo',
      genre: 'Synthwave',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
  },
];

export const DiscoverCarousel3D: React.FC<DiscoverCarousel3DProps> = ({
  currentTrack,
  isPlaying,
  onPlayTrack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start on Celestial Temple / featured
  const containerRef = useRef<HTMLDivElement>(null);
  const lastWheelTimeRef = useRef<number>(0);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + DISCOVER_ITEMS.length) % DISCOVER_ITEMS.length);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % DISCOVER_ITEMS.length);
  }, []);

  // When mouse cursor is on this section, scrolling moves slides horizontally/vertically.
  // When cursor is NOT on this section, normal webpage scroll works as usual.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Prevent webpage scrolling while cursor is hovering this section
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - lastWheelTimeRef.current < 250) return;

      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

      if (delta > 10) {
        lastWheelTimeRef.current = now;
        handleNext();
      } else if (delta < -10) {
        lastWheelTimeRef.current = now;
        handlePrev();
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, [handleNext, handlePrev]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden py-10 px-4 rounded-[40px] border border-sky-500/20 bg-gradient-to-b from-[#06122d]/90 via-[#03091c]/95 to-[#02050f] shadow-[0_25px_80px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(56,189,248,0.2)]"
    >
      {/* 3D Dotted Grid & Nebula Particles Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1.5px,transparent_1.5px)] [background-size:26px_26px] opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-sky-600/10 blur-[100px] pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between max-w-5xl mx-auto mb-8 px-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-lg shadow-sky-500/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Discover & Stream</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-400/40 font-bold">
                3D SPATIAL HORIZON
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive dimensional showcase • Scroll mouse over section to cycle soundscapes
            </p>
          </div>
        </div>

        {/* Carousel Control Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-sky-600/30 border border-white/15 hover:border-sky-400/50 flex items-center justify-center text-slate-200 transition-all hover:scale-110 active:scale-95 shadow-md"
            title="Previous Discovery"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-sky-600/30 border border-white/15 hover:border-sky-400/50 flex items-center justify-center text-slate-200 transition-all hover:scale-110 active:scale-95 shadow-md"
            title="Next Discovery"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3D Perspective Stage */}
      <div className="relative h-[340px] sm:h-[380px] max-w-5xl mx-auto flex items-center justify-center [perspective:1400px]">
        {DISCOVER_ITEMS.map((item, index) => {
          let offset = index - currentIndex;
          if (offset > DISCOVER_ITEMS.length / 2) offset -= DISCOVER_ITEMS.length;
          if (offset < -DISCOVER_ITEMS.length / 2) offset += DISCOVER_ITEMS.length;

          const isCenter = offset === 0;
          const isLeft = offset === -1 || (currentIndex === 0 && index === DISCOVER_ITEMS.length - 1);
          const isRight = offset === 1 || (currentIndex === DISCOVER_ITEMS.length - 1 && index === 0);

          if (Math.abs(offset) > 2) return null;

          const isThisTrackPlaying = isPlaying && currentTrack?.id === item.track.id;

          let transformStyle = '';
          let zIndex = 10;
          let opacity = 0.3;

          if (isCenter) {
            transformStyle = 'translateX(0) translateZ(80px) rotateY(0deg) scale(1)';
            zIndex = 30;
            opacity = 1;
          } else if (isLeft) {
            transformStyle = 'translateX(-220px) translateZ(-40px) rotateY(28deg) scale(0.85)';
            zIndex = 20;
            opacity = 0.65;
          } else if (isRight) {
            transformStyle = 'translateX(220px) translateZ(-40px) rotateY(-28deg) scale(0.85)';
            zIndex = 20;
            opacity = 0.65;
          } else if (offset < 0) {
            transformStyle = 'translateX(-380px) translateZ(-160px) rotateY(42deg) scale(0.7)';
            zIndex = 10;
            opacity = 0.25;
          } else {
            transformStyle = 'translateX(380px) translateZ(-160px) rotateY(-42deg) scale(0.7)';
            zIndex = 10;
            opacity = 0.25;
          }

          return (
            <div
              key={item.id}
              onClick={() => {
                if (isCenter) {
                  onPlayTrack(item.track);
                } else {
                  setCurrentIndex(index);
                }
              }}
              style={{
                transform: transformStyle,
                zIndex,
                opacity,
              }}
              className={`absolute w-[300px] sm:w-[380px] h-[260px] sm:h-[300px] rounded-[32px] overflow-hidden cursor-pointer transition-all duration-700 ease-out select-none border backdrop-blur-2xl shadow-2xl ${
                isCenter
                  ? 'border-sky-400/80 shadow-[0_20px_60px_rgba(56,189,248,0.35),0_0_35px_rgba(56,189,248,0.25)] ring-2 ring-sky-400/40'
                  : 'border-white/10 hover:border-sky-400/40 hover:opacity-90'
              }`}
            >
              {/* Card Artwork Background */}
              <div className="absolute inset-0">
                <SafeImage
                  src={item.coverUrl}
                  fallbackSrc="/album-midnight-drive.jpg"
                  alt={item.title}
                  fill
                  className="object-cover filter brightness-[0.75] saturate-[1.25] transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/50" />
              </div>

              {/* Card Header Badges */}
              <div className="relative z-10 p-5 flex items-center justify-between text-xs font-mono">
                <span className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-slate-300">
                  {item.trackNumber}
                </span>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-sky-300 flex items-center gap-1.5 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    {item.bpm} BPM
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-sky-200 font-semibold">
                    {item.mode}
                  </span>
                </div>
              </div>

              {/* Card Center: Circular Play Button & Dot Equalizer */}
              <div className="relative z-10 px-6 py-2 flex items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayTrack(item.track);
                  }}
                  className="w-12 h-12 rounded-full bg-sky-500 hover:bg-sky-400 border border-sky-300/40 backdrop-blur-xl text-slate-950 flex items-center justify-center shadow-xl shadow-sky-500/30 transition-all hover:scale-110 active:scale-95"
                  title={isThisTrackPlaying ? 'Pause Stream' : 'Play Soundscape'}
                >
                  {isThisTrackPlaying ? (
                    <Pause className="w-5 h-5 fill-slate-950" />
                  ) : (
                    <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                  )}
                </button>

                {/* Interactive Waveform / Dot Equalizer */}
                <div className="flex items-center gap-1.5">
                  {[...Array(12)].map((_, dotIdx) => (
                    <span
                      key={dotIdx}
                      className={`w-1.5 rounded-full transition-all duration-300 ${
                        isThisTrackPlaying
                          ? 'bg-sky-400 animate-pulse'
                          : 'bg-white/40'
                      }`}
                      style={{
                        height: isThisTrackPlaying
                          ? `${10 + ((dotIdx * 7) % 20)}px`
                          : '4px',
                        animationDelay: `${dotIdx * 70}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Card Bottom: Title & Subtitle */}
              <div className="absolute bottom-5 left-6 right-6 z-10">
                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-md">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-300 truncate mt-1 drop-shadow">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide Indicators */}
      <div className="relative z-10 flex items-center justify-center gap-2 mt-4">
        {DISCOVER_ITEMS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === idx
                ? 'w-7 h-2 bg-gradient-to-r from-sky-400 to-blue-500 shadow-[0_0_10px_rgba(56,189,248,0.7)]'
                : 'w-2 h-2 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
