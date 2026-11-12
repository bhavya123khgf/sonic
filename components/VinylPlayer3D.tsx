'use client';

import React from 'react';
import Image from 'next/image';
import { Disc3, Radio, Sparkles, Volume2 } from 'lucide-react';
import { Track } from '@/lib/types';
import { SafeImage } from './SafeImage';

interface VinylPlayer3DProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  theme?: 'dark' | 'light';
  onTogglePlay: () => void;
}

export const VinylPlayer3D: React.FC<VinylPlayer3DProps> = ({
  currentTrack,
  isPlaying,
  theme = 'dark',
  onTogglePlay,
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center p-6 select-none group perspective-1000">
      {/* 3D Turntable Plinth / Base */}
      <div
        className={`relative w-full h-full rounded-[40px] p-6 transition-all duration-700 backdrop-blur-2xl border shadow-2xl flex items-center justify-center ${
          isDark
            ? 'bg-gradient-to-br from-zinc-900/90 via-black/80 to-zinc-950/90 border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)]'
            : 'bg-gradient-to-br from-white/90 via-zinc-100/80 to-amber-50/70 border-black/10 shadow-[0_25px_60px_rgba(245,158,11,0.15),inset_0_1px_2px_rgba(255,255,255,0.9)]'
        }`}
      >
        {/* Plinth Brushed Texture & Corner Screws */}
        <div className="absolute top-4 left-4 w-2.5 h-2.5 rounded-full bg-zinc-600/50 border border-white/20" />
        <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-zinc-600/50 border border-white/20" />
        <div className="absolute bottom-4 left-4 w-2.5 h-2.5 rounded-full bg-zinc-600/50 border border-white/20" />
        <div className="absolute bottom-4 right-4 w-2.5 h-2.5 rounded-full bg-zinc-600/50 border border-white/20" />

        {/* Ambient Platter Rim Glow */}
        <div
          className={`absolute inset-10 rounded-full transition-opacity duration-1000 blur-2xl ${
            isPlaying
              ? 'opacity-40 bg-gradient-to-tr from-amber-500 to-rose-500'
              : 'opacity-10 bg-zinc-500'
          }`}
        />

        {/* The Circular Aluminum Platter */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-zinc-950 border-4 border-zinc-800/80 shadow-[inset_0_0_40px_rgba(0,0,0,0.9),0_15px_35px_rgba(0,0,0,0.6)] flex items-center justify-center">
          {/* Strobe dots on platter rim */}
          <div className="absolute inset-1 rounded-full border border-dashed border-zinc-700/60 pointer-events-none" />

          {/* 3D Spinning Vinyl Record */}
          <div
            onClick={onTogglePlay}
            className={`relative w-64 h-64 sm:w-72 sm:h-72 rounded-full cursor-pointer transition-transform duration-500 hover:scale-[1.02] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.8)] ${
              isPlaying ? 'animate-[spin_3.5s_linear_infinite]' : ''
            }`}
          >
            {/* Vinyl Body with Deep Grooves */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-zinc-950 via-zinc-900 to-black border-2 border-zinc-800" />

            {/* Grooves Rings */}
            <div className="absolute inset-3 rounded-full border border-zinc-800/80 pointer-events-none" />
            <div className="absolute inset-6 rounded-full border border-zinc-800/70 pointer-events-none" />
            <div className="absolute inset-9 rounded-full border border-zinc-800/60 pointer-events-none" />
            <div className="absolute inset-12 rounded-full border border-zinc-800/50 pointer-events-none" />
            <div className="absolute inset-16 rounded-full border border-zinc-800/40 pointer-events-none" />
            <div className="absolute inset-20 rounded-full border border-zinc-800/30 pointer-events-none" />

            {/* Radial Specular Sheen (Vinyl Light Reflection) */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.08)_0%,_transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent rotate-45 pointer-events-none" />

            {/* Center Label (Album Art) */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-zinc-900 shadow-inner flex items-center justify-center">
              <SafeImage
                src={currentTrack?.coverUrl}
                fallbackSrc="/album-midnight-drive.jpg"
                alt={currentTrack?.title || 'Vinyl Album'}
                fill
                className="object-cover"
              />

              {/* Spindle hole */}
              <div className="absolute w-4 h-4 rounded-full bg-zinc-950 border-2 border-zinc-600 shadow-inner z-10" />
            </div>
          </div>
        </div>

        {/* Tonearm Resting Cradle (Parked Latch) on the right side */}
        <div className="absolute top-44 right-6 w-3 h-3 rounded-full bg-zinc-800 border border-zinc-600 pointer-events-none shadow" />

        {/* 3D Tone-Arm / Needle Mechanism */}
        <div
          className={`absolute top-6 right-6 transition-all duration-700 ease-out pointer-events-none origin-[20px_20px] z-20 ${
            isPlaying
              ? 'rotate-[20deg] translate-x-[-12px] translate-y-[4px]'
              : 'rotate-[-8deg] translate-x-0 translate-y-0'
          }`}
        >
          {/* Tone-arm base pivot */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-950 border-2 border-zinc-400 shadow-xl flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-cyan-400/80 border border-cyan-300 shadow-inner" />
          </div>

          {/* Chrome Arm Shaft (Reaches directly into the vinyl groove tracks when playing) */}
          <div className="w-1.5 h-44 sm:h-48 bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-400 mx-auto rounded-full shadow-lg" />

          {/* Cartridge & Stylus Head angled along vinyl grooves */}
          <div className="w-4 h-8 -mt-1 ml-[-2px] bg-gradient-to-b from-cyan-500 via-blue-600 to-indigo-600 rounded-sm border border-cyan-300 shadow-xl flex items-center justify-center rotate-[-15deg]">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#38bdf8] animate-pulse" />
          </div>
        </div>

        {/* Plinth Audio Status Badge */}
        <div className="absolute bottom-4 left-6 flex items-center gap-2 text-[10px] font-mono tracking-wider text-zinc-400">
          <span
            className={`w-2 h-2 rounded-full ${
              isPlaying ? 'bg-cyan-400 animate-ping' : 'bg-zinc-600'
            }`}
          />
          <span className="text-zinc-300">{isPlaying ? '33⅓ RPM • AUDIO PLAYING' : 'TURNTABLE IDLE'}</span>
        </div>
      </div>
    </div>
  );
};
