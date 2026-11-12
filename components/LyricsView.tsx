'use client';

import React, { useEffect, useRef } from 'react';
import { X, Mic2, Sparkles, Music } from 'lucide-react';
import { Track } from '@/lib/types';
import { getSynchronizedLyrics, LyricLine } from '@/lib/lyrics';

interface LyricsViewProps {
  track: Track | null;
  currentTime: number;
  isOpen: boolean;
  theme?: 'dark' | 'light';
  onClose: () => void;
  onSeekToTime: (seconds: number) => void;
}

export const LyricsView: React.FC<LyricsViewProps> = ({
  track,
  currentTime,
  isOpen,
  theme = 'dark',
  onClose,
  onSeekToTime,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';
  const lyrics: LyricLine[] = getSynchronizedLyrics(track);

  // Find the index of the currently active line
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      if (i === lyrics.length - 1 || currentTime < lyrics[i + 1].time) {
        activeIndex = i;
        break;
      }
    }
  }

  // Smoothly scroll active lyric into center of view
  useEffect(() => {
    if (activeLineRef.current && containerRef.current && isOpen) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex, isOpen]);

  if (!isOpen || !track) return null;

  return (
    <div
      className={`fixed bottom-24 inset-x-4 sm:inset-x-8 md:max-w-3xl md:mx-auto z-40 rounded-[32px] border backdrop-blur-3xl shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-500 animate-slide-up select-none ${
        isDark
          ? 'bg-zinc-950/95 border-amber-500/25 text-white'
          : 'bg-white/95 border-amber-500/30 text-zinc-900 shadow-2xl'
      }`}
      style={{ maxHeight: '420px', height: '420px' }}
    >
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md">
            <Mic2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold truncate max-w-xs">{track.title}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                LIVE SYNC
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Click any lyric line to seek audio • Synchronized to song playback
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
          title="Close Lyrics"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Synchronized Lyrics Scroll Container */}
      <div
        ref={containerRef}
        className="p-6 sm:p-8 overflow-y-auto h-[340px] space-y-4 custom-scrollbar text-center"
      >
        {lyrics.map((line, idx) => {
          const isActive = idx === activeIndex;
          const isPast = idx < activeIndex;

          return (
            <div
              key={`${line.time}-${idx}`}
              ref={isActive ? activeLineRef : null}
              onClick={() => onSeekToTime(line.time)}
              className={`cursor-pointer transition-all duration-500 py-2 px-4 rounded-2xl ${
                isActive
                  ? 'text-xl sm:text-2xl font-black text-amber-400 bg-amber-500/15 scale-105 shadow-md shadow-amber-500/10'
                  : isPast
                  ? 'text-sm sm:text-base font-semibold text-zinc-400 opacity-60 hover:opacity-100 hover:text-zinc-200'
                  : 'text-sm sm:text-base font-semibold text-zinc-400 opacity-40 hover:opacity-80'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
                <span>{line.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
