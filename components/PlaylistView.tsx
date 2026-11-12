'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Shuffle,
  Play,
  Plus,
  Music2,
  Clock,
  Sparkles,
  ListMusic,
  Trash2,
  Dices,
} from 'lucide-react';
import { Playlist, Track } from '@/lib/types';
import { TrackList } from './TrackList';
import { shuffleTracks, reorderTracks } from '@/lib/audio-engine';

interface PlaylistViewProps {
  playlists: Playlist[];
  activePlaylistId: string;
  currentTrack: Track | null;
  isPlaying: boolean;
  favorites: string[];
  theme?: 'dark' | 'light';
  onSelectPlaylist: (playlistId: string) => void;
  onCreatePlaylist: (name: string, description: string) => void;
  onUpdatePlaylistTracks: (playlistId: string, tracks: Track[]) => void;
  onPlayTrack: (track: Track) => void;
  onToggleFavorite: (trackId: string) => void;
  onOpenSearch: () => void;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({
  playlists,
  activePlaylistId,
  currentTrack,
  isPlaying,
  favorites,
  theme = 'dark',
  onSelectPlaylist,
  onCreatePlaylist,
  onUpdatePlaylistTracks,
  onPlayTrack,
  onToggleFavorite,
  onOpenSearch,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [isRollingDice, setIsRollingDice] = useState(false);

  const activePlaylist = playlists.find((p) => p.id === activePlaylistId) || playlists[0];
  const isDark = theme === 'dark';

  const totalDurationSeconds = (activePlaylist?.tracks || []).reduce(
    (acc, t) => acc + (t.duration || 0),
    0
  );
  const totalMinutes = Math.floor(totalDurationSeconds / 60);

  // Randomizer Action: shuffles playlist and plays first random track
  const handleRandomizePlaylist = () => {
    if (!activePlaylist || !activePlaylist.tracks || activePlaylist.tracks.length === 0) return;

    setIsRollingDice(true);
    setTimeout(() => {
      setIsRollingDice(false);
      const randomized = shuffleTracks(activePlaylist.tracks);
      onUpdatePlaylistTracks(activePlaylist.id, randomized);
      if (randomized.length > 0) {
        onPlayTrack(randomized[0]);
      }
    }, 600);
  };

  const handleMoveUp = (index: number) => {
    if (!activePlaylist || index <= 0) return;
    const reordered = reorderTracks(activePlaylist.tracks, index, index - 1);
    onUpdatePlaylistTracks(activePlaylist.id, reordered);
  };

  const handleMoveDown = (index: number) => {
    if (!activePlaylist || index >= activePlaylist.tracks.length - 1) return;
    const reordered = reorderTracks(activePlaylist.tracks, index, index + 1);
    onUpdatePlaylistTracks(activePlaylist.id, reordered);
  };

  const handleRemoveTrack = (trackId: string) => {
    if (!activePlaylist) return;
    const filtered = activePlaylist.tracks.filter((t) => t.id !== trackId);
    onUpdatePlaylistTracks(activePlaylist.id, filtered);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    onCreatePlaylist(newPlaylistName.trim(), newPlaylistDesc.trim());
    setNewPlaylistName('');
    setNewPlaylistDesc('');
    setShowCreateModal(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Playlist Selector Pill Carousel */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2">
          {playlists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => onSelectPlaylist(pl.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
                pl.id === activePlaylist?.id
                  ? 'bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/25 scale-[1.02]'
                  : isDark
                  ? 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border-white/10'
                  : 'bg-black/5 hover:bg-black/10 text-zinc-600 hover:text-black border-black/10'
              }`}
            >
              {pl.name} ({pl.tracks.length})
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 border border-amber-500/30 text-amber-300 text-xs font-semibold flex-shrink-0 transition-all hover:scale-105"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Playlist Hero Banner */}
      {activePlaylist && (
        <div
          className={`p-6 sm:p-8 rounded-[32px] border backdrop-blur-2xl transition-all shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-end gap-6 ${
            isDark
              ? 'bg-gradient-to-r from-black/60 via-zinc-900/60 to-black/60 border-white/10'
              : 'bg-gradient-to-r from-white/70 via-amber-50/70 to-white/70 border-black/10'
          }`}
        >
          {/* Cover image */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border border-white/15 group">
            <Image
              src={activePlaylist.coverUrl || '/album-midnight-drive.jpg'}
              alt={activePlaylist.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
            <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-bold">
              SONIC CURATED PLAYLIST
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight truncate">
              {activePlaylist.name}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 max-w-xl">
              {activePlaylist.description || 'Custom audio selection.'}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-zinc-400 pt-2 font-mono">
              <span className="flex items-center gap-1">
                <Music2 className="w-3.5 h-3.5 text-amber-400" />
                {activePlaylist.tracks.length} songs
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                ~{totalMinutes} mins
              </span>
            </div>
          </div>

          {/* Action Buttons: Play All + RANDOMIZER BUTTON */}
          <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto justify-center">
            {/* Play All */}
            <button
              onClick={() => {
                if (activePlaylist.tracks.length > 0) {
                  onPlayTrack(activePlaylist.tracks[0]);
                }
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Play All</span>
            </button>

            {/* Randomizer Button with 3D Dice Roll Animation */}
            <button
              onClick={handleRandomizePlaylist}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all ${
                isRollingDice ? 'animate-bounce' : ''
              }`}
              title="Shuffle and play songs randomly from this playlist"
            >
              <Dices
                className={`w-4 h-4 ${
                  isRollingDice ? 'animate-[spin_0.6s_ease-in-out_infinite]' : ''
                }`}
              />
              <span>Randomizer</span>
            </button>

            {/* Add More Songs */}
            <button
              onClick={onOpenSearch}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all hover:scale-105"
              title="Add songs to this playlist"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Playlist Tracks List with Reordering */}
      <div
        className={`p-6 rounded-[28px] border backdrop-blur-xl ${
          isDark ? 'bg-black/30 border-white/10' : 'bg-white/50 border-black/10'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-3">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Track Queue & Order
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
            <span>Reorder tracks with ▲ ▼ arrows</span>
          </div>
        </div>

        <TrackList
          tracks={activePlaylist?.tracks || []}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          favorites={favorites}
          theme={theme}
          isReorderable={true}
          onPlayTrack={onPlayTrack}
          onToggleFavorite={onToggleFavorite}
          onRemoveTrack={handleRemoveTrack}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
        />
      </div>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-4 ${
              isDark
                ? 'bg-zinc-900 border-white/15 text-white'
                : 'bg-white border-black/15 text-zinc-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Create New Playlist</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Playlist Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midnight Cyberpunk Drive"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Description (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Atmosphere, genres, and listening mood..."
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:outline-none focus:border-amber-400 text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold text-xs shadow-lg shadow-amber-500/25"
                >
                  Create Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
