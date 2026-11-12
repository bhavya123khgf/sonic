'use client';

import React from 'react';
import { Play, Pause, Heart, Plus, Sparkles, Music2, Headphones } from 'lucide-react';
import { Track } from '@/lib/types';
import { getRecommendedTracksForTrack } from '@/lib/recommendations';
import { SafeImage } from './SafeImage';

interface GenreRecommendationsProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  favorites: string[];
  theme?: 'dark' | 'light';
  customTracks?: Track[];
  customGenre?: string;
  customDescription?: string;
  isLoading?: boolean;
  onPlayTrack: (track: Track) => void;
  onToggleFavorite: (trackId: string) => void;
  onAddToPlaylist?: (track: Track) => void;
}

export const GenreRecommendations: React.FC<GenreRecommendationsProps> = ({
  currentTrack,
  isPlaying,
  favorites,
  customTracks,
  customGenre,
  customDescription,
  onPlayTrack,
  onToggleFavorite,
  onAddToPlaylist,
}) => {
  const group = getRecommendedTracksForTrack(currentTrack);

  const displayTracks = customTracks && customTracks.length > 0 ? customTracks : group.tracks;
  const displayGenre = customGenre || group.genre;
  const displayDescription = customDescription || group.description;

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="space-y-6 pt-4 select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-sky-500/20">
            <Music2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Recommended in {displayGenre}
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30 font-bold">
                MATCHING VIBE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
              {displayDescription}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Headphones className="w-3.5 h-3.5 text-sky-400" />
          <span>{displayTracks.length} Handpicked Tracks</span>
        </div>
      </div>

      {/* Grid of Recommended Song Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {displayTracks.map((track) => {
          const isThisTrackPlaying = isPlaying && currentTrack?.id === track.id;
          const isFavorited = favorites.includes(track.id);

          return (
            <div
              key={track.id}
              className={`group relative p-4 rounded-[26px] border backdrop-blur-xl transition-all duration-300 flex items-center gap-4 ${
                currentTrack?.id === track.id
                  ? 'bg-sky-500/15 border-sky-500/40 shadow-xl shadow-sky-500/10 scale-[1.02]'
                  : 'bg-[#050d24]/75 hover:bg-[#071333] border-sky-500/15 hover:border-sky-400/40 shadow-md'
              }`}
            >
              {/* Artwork with Quick Play Button */}
              <div
                onClick={() => onPlayTrack(track)}
                className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 cursor-pointer group-hover:shadow-sky-500/20"
              >
                <SafeImage
                  src={track.coverUrl}
                  fallbackSrc="/album-midnight-drive.jpg"
                  alt={track.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Play / Pause Overlay */}
                <div
                  className={`absolute inset-0 bg-black/45 flex items-center justify-center transition-opacity ${
                    isThisTrackPlaying
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-slate-950 shadow-lg">
                    {isThisTrackPlaying ? (
                      <Pause className="w-4 h-4 fill-slate-950" />
                    ) : (
                      <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                    )}
                  </div>
                </div>

                {/* Animated Equalizer if Playing */}
                {isThisTrackPlaying && (
                  <div className="absolute bottom-1 right-1 flex items-end gap-0.5 bg-black/60 px-1 py-0.5 rounded">
                    <span className="w-1 h-3 bg-sky-400 animate-pulse rounded-full" />
                    <span className="w-1 h-4 bg-sky-400 animate-pulse delay-75 rounded-full" />
                    <span className="w-1 h-2 bg-sky-400 animate-pulse delay-150 rounded-full" />
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4
                    onClick={() => onPlayTrack(track)}
                    className="text-sm font-bold truncate cursor-pointer hover:text-sky-400 transition-colors text-white"
                  >
                    {track.title}
                  </h4>
                </div>

                <p className="text-xs text-slate-400 truncate">
                  {track.artist}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1.5 font-mono">
                  <span className="text-sky-300 font-semibold">{track.genre || group.genre}</span>
                  <span>•</span>
                  <span>{formatDuration(track.duration)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Add to active playlist */}
                {onAddToPlaylist && (
                  <button
                    onClick={() => onAddToPlaylist(track)}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-sky-500/20 hover:text-sky-300 flex items-center justify-center text-slate-400 transition-all"
                    title="Add to Active Playlist"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}

                {/* Favorite Toggle */}
                <button
                  onClick={() => onToggleFavorite(track.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isFavorited
                      ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                      : 'bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white'
                  }`}
                  title={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorited ? 'fill-rose-500 text-rose-500' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
