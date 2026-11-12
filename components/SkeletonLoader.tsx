'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  theme?: 'dark' | 'light';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', theme = 'dark' }) => {
  const isDark = theme === 'dark';
  return (
    <div
      className={`relative overflow-hidden rounded-xl ${
        isDark ? 'bg-zinc-800/40' : 'bg-zinc-200/60'
      } ${className}`}
    >
      {/* Gentle, non-frenetic shimmer wave (2.5s slow ease-in-out) */}
      <div
        className={`absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite_ease-in-out] ${
          isDark
            ? 'bg-gradient-to-r from-transparent via-white/[0.06] to-transparent'
            : 'bg-gradient-to-r from-transparent via-white/[0.4] to-transparent'
        }`}
      />
    </div>
  );
};

export const TrackSkeletonRow: React.FC<{ theme?: 'dark' | 'light' }> = ({ theme = 'dark' }) => (
  <div className="flex items-center gap-4 p-3 rounded-2xl">
    <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" theme={theme} />
    <div className="flex-1 space-y-2">
      <Skeleton className="w-2/5 h-4 rounded-md" theme={theme} />
      <Skeleton className="w-1/4 h-3 rounded-md" theme={theme} />
    </div>
    <Skeleton className="w-12 h-3 rounded-md" theme={theme} />
    <Skeleton className="w-8 h-8 rounded-full" theme={theme} />
  </div>
);

export const AlbumCardSkeleton: React.FC<{ theme?: 'dark' | 'light' }> = ({ theme = 'dark' }) => (
  <div className="p-4 rounded-3xl border border-white/5 space-y-3">
    <Skeleton className="w-full aspect-square rounded-2xl" theme={theme} />
    <Skeleton className="w-3/4 h-4 rounded-md" theme={theme} />
    <Skeleton className="w-1/2 h-3 rounded-md" theme={theme} />
  </div>
);
