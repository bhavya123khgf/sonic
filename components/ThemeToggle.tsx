'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  const isDark = theme === 'dark';

  return (
    <div
      onClick={onToggle}
      role="button"
      tabIndex={0}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`relative w-24 h-11 p-1 rounded-full cursor-pointer select-none transition-all duration-700 ease-out border backdrop-blur-2xl shadow-xl flex items-center justify-between group ${
        isDark
          ? 'bg-black/60 border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]'
          : 'bg-white/80 border-black/10 shadow-[0_8px_32px_rgba(255,165,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.9)]'
      }`}
    >
      {/* Dynamic 3D Sliding Orb */}
      <div
        className={`absolute top-1 bottom-1 w-9 rounded-full transition-all duration-700 cubic-bezier(0.34,1.56,0.64,1) flex items-center justify-center shadow-lg ${
          isDark
            ? 'translate-x-[52px] bg-gradient-to-tr from-indigo-950 via-purple-900 to-indigo-800 border border-indigo-400/40 shadow-[0_0_20px_rgba(129,140,248,0.5)]'
            : 'translate-x-0 bg-gradient-to-tr from-amber-400 via-orange-300 to-yellow-200 border border-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.7)]'
        }`}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-purple-200 animate-[spin_10s_linear_infinite]" />
        ) : (
          <Sun className="w-4 h-4 text-amber-900 animate-[spin_12s_linear_infinite]" />
        )}
      </div>

      {/* Sun side icon (static anchor) */}
      <div
        className={`w-9 h-9 flex items-center justify-center transition-all duration-500 z-10 ${
          isDark ? 'opacity-40 scale-85 text-zinc-400 hover:opacity-70' : 'opacity-0 scale-75 text-amber-900'
        }`}
      >
        <Sun className="w-4 h-4" />
      </div>

      {/* Moon side icon (static anchor) */}
      <div
        className={`w-9 h-9 flex items-center justify-center transition-all duration-500 z-10 ${
          isDark ? 'opacity-0 scale-75 text-purple-300' : 'opacity-40 scale-85 text-zinc-500 hover:opacity-80'
        }`}
      >
        <Moon className="w-4 h-4" />
      </div>

      {/* Ambient background glow inside pill */}
      <div
        className={`absolute inset-0 rounded-full transition-opacity duration-700 pointer-events-none ${
          isDark
            ? 'opacity-20 bg-gradient-to-r from-transparent to-indigo-500 blur-sm'
            : 'opacity-40 bg-gradient-to-r from-amber-400/40 to-transparent blur-sm'
        }`}
      />
    </div>
  );
};
