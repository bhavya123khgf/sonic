'use client';

import React from 'react';
import {
  Play,
  Heart,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
} from 'lucide-react';
import { Track } from '@/lib/types';
import { SafeImage } from './SafeImage';

interface TrackListProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  favorites: string[];
  theme?: 'dark' | 'light';
  isReorderable?: boolean;
  onPlayTrack: (track: Track) => void;
  onToggleFavorite: (trackId: string) => void;
  onAddToPlaylist?: (track: Track) => void;
  onRemoveTrack?: (trackId: string) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
}

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  favorites,
  isReorderable = false,
  onPlayTrack,
  onToggleFavorite,
  onAddToPlaylist,
  onRemoveTrack,
  onMoveUp,
  onMoveDown,
}) => {
  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = Math.floor(sec % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  if (!tracks || tracks.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 text-sm">
        No tracks found in this collection. Search songs or add tracks.
      </div>
    );
  }

  return (
    <div className="w-full space-y-1.5 select-none">
      {tracks.map((track, idx) => {
        const isCurrent = currentTrack?.id === track.id;
        const isFav = favorites.includes(track.id);

        return (
          <div
            key={`${track.id}-${idx}`}
            className={`group flex items-center justify-between p-3 rounded-2xl transition-all duration-300 border ${
              isCurrent
                ? 'bg-sky-500/10 border-sky-500/30 text-sky-200 shadow-lg shadow-sky-500/10'
                : 'bg-white/[0.02] hover:bg-sky-500/[0.06] border-transparent hover:border-sky-500/20 text-slate-300'
            }`}
          >
            {/* Left Column: Number / Play, Cover, Title, Artist */}
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              {/* Play / Pause toggle button */}
              <button
                onClick={() => onPlayTrack(track)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isCurrent && isPlaying
                    ? 'bg-gradient-to-tr from-sky-400 to-blue-600 text-slate-950 shadow-md shadow-sky-500/30 scale-105'
                    : 'bg-white/5 group-hover:bg-sky-500 group-hover:text-slate-950 text-slate-400'
                }`}
                title={isCurrent && isPlaying ? 'Pause' : 'Play'}
              >
                {isCurrent && isPlaying ? (
                  <div className="flex items-center gap-0.5">
                    <span className="w-1 h-3 bg-slate-950 rounded-full animate-bounce" />
                    <span className="w-1 h-4 bg-slate-950 rounded-full animate-bounce delay-100" />
                    <span className="w-1 h-2.5 bg-slate-950 rounded-full animate-bounce delay-200" />
                  </div>
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              {/* Cover Art Thumbnail */}
              <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 shadow-sm">
                <SafeImage
                  src={track.coverUrl}
                  fallbackSrc="/album-midnight-drive.jpg"
                  alt={track.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Track Info (Without 320kbps Studio Master Badge) */}
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <h4
                    onClick={() => onPlayTrack(track)}
                    className="text-sm font-semibold truncate hover:text-sky-400 cursor-pointer transition-colors"
                  >
                    {track.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {track.artist} {track.album ? `• ${track.album}` : ''}
                </p>
              </div>
            </div>

            {/* Right Column: Reorder Controls (if playlist), Duration, Favorite, Actions */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Reordering arrows in playlist mode */}
              {isReorderable && (
                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => onMoveUp && onMoveUp(idx)}
                    className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent transition-all"
                    title="Move track up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === tracks.length - 1}
                    onClick={() => onMoveDown && onMoveDown(idx)}
                    className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent transition-all"
                    title="Move track down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Duration */}
              <span className="text-xs font-mono text-slate-400 w-10 text-right">
                {formatDuration(track.duration)}
              </span>

              {/* Favorite Heart Button */}
              <button
                onClick={() => onToggleFavorite(track.id)}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isFav
                    ? 'text-rose-500 scale-110'
                    : 'text-slate-500 hover:text-rose-400 hover:scale-105'
                }`}
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 animate-[pulse_0.4s_ease-out]' : ''}`} />
              </button>

              {/* Add to Playlist button */}
              {onAddToPlaylist && (
                <button
                  onClick={() => onAddToPlaylist(track)}
                  className="p-2 rounded-xl text-slate-400 hover:text-sky-400 hover:bg-white/10 transition-all"
                  title="Add to Playlist"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}

              {/* Remove track button in playlist mode */}
              {onRemoveTrack && (
                <button
                  onClick={() => onRemoveTrack(track.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                  title="Remove from playlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
