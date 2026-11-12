'use client';

import React, { useState, useRef } from 'react';
import {
  Search,
  Sparkles,
  Disc3,
  Heart,
  ListMusic,
  Radio,
  History,
  X,
  Play,
  Clock,
} from 'lucide-react';
import { User, SearchSuggestion, Track } from '@/lib/types';
import { SafeImage } from './SafeImage';

interface NavbarProps {
  searchQuery: string;
  suggestion: SearchSuggestion | null;
  searchResults: Track[];
  isSearching: boolean;
  activeTab: 'explore' | 'playlist' | 'favorites' | 'history';
  theme?: 'dark' | 'light';
  currentUser: User | null;
  onSearchChange: (q: string) => void;
  onSelectSuggestion: (corrected: string) => void;
  onPlayTrack: (track: Track) => void;
  onTabChange: (tab: 'explore' | 'playlist' | 'favorites' | 'history') => void;
  onToggleTheme?: () => void;
  onOpenProfile: () => void;
  onOpenSecurity: () => void;
  onReturnToAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  suggestion,
  searchResults,
  isSearching,
  activeTab,
  currentUser,
  onSearchChange,
  onSelectSuggestion,
  onPlayTrack,
  onTabChange,
  onOpenProfile,
  onReturnToAuth,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format seconds to mm:ss
  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = Math.floor(sec % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const showDropdown = isFocused && searchQuery.trim().length > 0;

  return (
    <nav className="sticky top-0 z-30 w-full px-4 sm:px-8 py-3.5 border-b backdrop-blur-2xl transition-all duration-500 select-none bg-[#03081c]/85 border-sky-900/30 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Navigation Tabs */}
        <div className="flex items-center gap-6">
          <div
            onClick={onReturnToAuth}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="Return to Welcome Screen"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
              <Disc3 className="w-4 h-4 text-white animate-[spin_8s_linear_infinite]" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-transparent hidden sm:inline-block">
              Sonic
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/5">
            <button
              onClick={() => onTabChange('explore')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'explore'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Explore</span>
            </button>
            <button
              onClick={() => onTabChange('playlist')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'playlist'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ListMusic className="w-3.5 h-3.5" />
              <span>Playlists</span>
            </button>
            <button
              onClick={() => onTabChange('favorites')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'favorites'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Favorites</span>
            </button>
            <button
              onClick={() => onTabChange('history')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'history'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Recent</span>
            </button>
          </div>
        </div>

        {/* Center: Search Bar with Autocorrect & Instant Results Dropdown */}
        <div className="flex-1 max-w-md relative">
          <div
            className={`relative flex items-center rounded-2xl border transition-all duration-300 ${
              isFocused
                ? 'bg-slate-900/90 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
                : 'bg-slate-900/50 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="pl-3.5 pr-2 text-sky-400/80 flex items-center pointer-events-none">
              <Search className="w-4 h-4" />
            </div>

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search songs, artists, genres on Sonic..."
              className="w-full bg-transparent py-2.5 pr-9 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
            />

            {searchQuery && (
              <button
                onClick={() => {
                  onSearchChange('');
                  searchInputRef.current?.focus();
                }}
                className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocorrect / Suggestion Banner */}
          {suggestion && (
            <div className="absolute top-full left-0 right-0 mt-1 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-sky-500/30 backdrop-blur-md shadow-xl z-50 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-3 h-3 text-sky-400 flex-shrink-0" />
              <span className="text-slate-300">Did you mean:</span>
              <button
                onClick={() => onSelectSuggestion(suggestion.corrected)}
                className="font-bold text-sky-400 underline hover:text-sky-300 cursor-pointer"
              >
                {suggestion.corrected}
              </button>
            </div>
          )}

          {/* Instant Search Results Dropdown */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-[#061026]/95 border border-sky-500/25 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 max-h-[380px] overflow-y-auto custom-scrollbar animate-fade-in"
            >
              <div className="p-2 divide-y divide-white/5">
                {isSearching ? (
                  <div className="p-4 flex items-center justify-center gap-2 text-xs text-sky-400">
                    <Disc3 className="w-4 h-4 animate-spin text-sky-400" />
                    <span>Searching catalog...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.slice(0, 8).map((track) => (
                    <div
                      key={track.id}
                      onClick={() => {
                        onPlayTrack(track);
                        setIsFocused(false);
                      }}
                      className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-500/10 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                          <SafeImage
                            src={track.coverUrl}
                            fallbackSrc="/album-midnight-drive.jpg"
                            alt={track.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs sm:text-sm font-bold truncate group-hover:text-sky-400 transition-colors">
                            {track.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 truncate">
                            {track.artist} {track.album ? `• ${track.album}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(track.duration)}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center shadow-md shadow-sky-500/30 group-hover:scale-110 transition-transform">
                          <Play className="w-3.5 h-3.5 fill-slate-950 ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No results found for &quot;{searchQuery}&quot;.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Section: User Profile Avatar */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <div
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-900/60 hover:bg-sky-500/10 border border-sky-500/20 cursor-pointer transition-all hover:scale-105"
            >
              <div className="relative w-7 h-7 rounded-full overflow-hidden border border-sky-400/30">
                <SafeImage
                  src={currentUser.avatarUrl}
                  fallbackSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
                  alt={currentUser.fullName}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs font-semibold text-slate-200 hidden sm:inline-block max-w-[100px] truncate">
                {currentUser.username}
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
