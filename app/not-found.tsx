import React from 'react';
import Link from 'next/link';
import { Disc3, Home, Search, Music, Radio } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-neutral-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* 3D background ambient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-rose-500/10 blur-[130px] pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10 space-y-8">
        {/* 3D Broken Vinyl Visual */}
        <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-dashed animate-[spin_20s_linear_infinite]" />
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-zinc-900 via-black to-zinc-800 border-2 border-white/10 shadow-[0_0_50px_rgba(245,158,11,0.25)] flex items-center justify-center relative overflow-hidden group">
            {/* Vinyl grooves */}
            <div className="absolute inset-2 rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute inset-5 rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute inset-8 rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute inset-11 rounded-full border border-white/5 pointer-events-none" />

            {/* Broken vinyl crack effect */}
            <div className="absolute w-[2px] h-full bg-gradient-to-b from-transparent via-amber-400 to-transparent rotate-45 transform shadow-[0_0_10px_#f59e0b]" />

            {/* Center label */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-rose-600 flex flex-col items-center justify-center text-black font-black text-xs shadow-inner">
              <Disc3 className="w-6 h-6 animate-spin text-black" />
              <span className="text-[9px] font-mono tracking-tighter">ERROR 404</span>
            </div>
          </div>
        </div>

        {/* Headline & description */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-mono tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> FREQUENCY OUT OF RANGE
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Lost In The Sonic Void
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            The track, playlist, or sound frequency you were tuning into does not exist or has been shifted in the mix.
          </p>
        </div>

        {/* Soundwave flatline animation */}
        <div className="flex items-center justify-center gap-1.5 h-8">
          {[20, 45, 10, 80, 15, 60, 25, 90, 40, 15, 35, 75, 20, 50].map((height, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-amber-500/30 to-amber-400 rounded-full transition-all duration-700"
              style={{
                height: `${height}%`,
                animation: `pulse 1.8s ease-in-out infinite ${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-medium text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Home className="w-4 h-4" /> Return to Sonic Hub
          </Link>
          <Link
            href="/?tab=search"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-zinc-200 font-medium text-sm hover:scale-[1.02] active:scale-[0.98] transition-all backdrop-blur-md"
          >
            <Search className="w-4 h-4" /> Search Song Catalog
          </Link>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-6 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5" /> High-Fidelity Lossless Engine
          </span>
          <span>•</span>
          <span>Zero-Downtime Blue-Green Node</span>
        </div>
      </div>
    </div>
  );
}
