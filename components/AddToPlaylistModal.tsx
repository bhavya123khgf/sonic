'use client';

import React, { useState } from 'react';
import { X, Plus, Check, Music2, ListPlus, FolderPlus } from 'lucide-react';
import { Track, Playlist } from '@/lib/types';
import { SafeImage } from './SafeImage';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
  playlists: Playlist[];
  theme?: 'dark' | 'light';
  onAddToPlaylist: (playlistId: string, track: Track) => void;
  onCreatePlaylistAndAdd: (name: string, track: Track) => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  onClose,
  track,
  playlists,
  theme = 'dark',
  onAddToPlaylist,
  onCreatePlaylistAndAdd,
}) => {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  if (!isOpen || !track) return null;

  const isDark = theme === 'dark';

  const handleSelectPlaylist = (pl: Playlist) => {
    onAddToPlaylist(pl.id, track);
    setJustAddedId(pl.id);
    setTimeout(() => {
      setJustAddedId(null);
      onClose();
    }, 800);
  };

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    onCreatePlaylistAndAdd(newPlaylistName.trim(), track);
    setNewPlaylistName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div
        className={`relative w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden p-6 space-y-5 transition-all duration-300 ${
          isDark
            ? 'bg-zinc-950/95 border-amber-500/25 text-white shadow-[0_20px_60px_rgba(0,0,0,0.9)]'
            : 'bg-white/95 border-amber-500/30 text-zinc-900 shadow-2xl'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md">
              <ListPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Add to Playlist</h3>
              <p className="text-xs text-zinc-400">Choose a crate or create a new one</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Track Preview */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md flex-shrink-0">
            <SafeImage
              src={track.coverUrl}
              fallbackSrc="/album-midnight-drive.jpg"
              alt={track.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-bold truncate">{track.title}</h4>
            <p className="text-[11px] text-zinc-400 truncate">{track.artist}</p>
          </div>
        </div>

        {/* Playlists Selection List */}
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
          {playlists.map((pl) => {
            const alreadyInPlaylist = pl.tracks.some((t) => t.id === track.id);
            const isSelectedNow = justAddedId === pl.id;

            return (
              <div
                key={pl.id}
                onClick={() => !alreadyInPlaylist && handleSelectPlaylist(pl)}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                  isSelectedNow
                    ? 'bg-emerald-500/20 border-emerald-500/50 scale-[1.02]'
                    : alreadyInPlaylist
                    ? 'bg-white/[0.02] border-white/5 opacity-60 cursor-default'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-amber-500/40 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow">
                    <SafeImage
                      src={pl.coverUrl || '/album-midnight-drive.jpg'}
                      fallbackSrc="/album-midnight-drive.jpg"
                      alt={pl.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold truncate">{pl.name}</h5>
                    <p className="text-[10px] text-zinc-400 font-mono">
                      {pl.tracks.length} songs
                    </p>
                  </div>
                </div>

                {isSelectedNow ? (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 font-mono">
                    <Check className="w-3.5 h-3.5" /> Added
                  </span>
                ) : alreadyInPlaylist ? (
                  <span className="text-[10px] text-zinc-400 font-mono px-2 py-0.5 rounded-full bg-white/5">
                    Added
                  </span>
                ) : (
                  <button className="px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-white text-xs font-semibold transition-all">
                    + Add
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Create New Playlist Input */}
        <form onSubmit={handleCreateAndAdd} className="pt-2 border-t border-white/10 flex gap-2">
          <input
            type="text"
            placeholder="New playlist name..."
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-amber-400 placeholder:text-zinc-500"
          />
          <button
            type="submit"
            disabled={!newPlaylistName.trim()}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Create & Add</span>
          </button>
        </form>
      </div>
    </div>
  );
};
