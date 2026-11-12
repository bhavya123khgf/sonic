'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Music2,
  Disc3,
  Play,
  Heart,
  FolderPlus,
  Dices,
  Layers,
  History,
  Award,
  Zap,
  Clock,
  ListMusic,
} from 'lucide-react';
import {
  Track,
  Playlist,
  User,
  SearchSuggestion,
} from '@/lib/types';
import {
  INITIAL_TRACKS,
  INITIAL_PLAYLISTS,
  INITIAL_USER,
} from '@/lib/data';
import { processYoutubeToMp3Algorithm, shuffleTracks } from '@/lib/audio-engine';
import { getRecommendedTracksForTrack } from '@/lib/recommendations';

// Components
import { AuthView } from '@/components/AuthView';
import { Navbar } from '@/components/Navbar';
import { VinylPlayer3D } from '@/components/VinylPlayer3D';
import { TrackList } from '@/components/TrackList';
import { PlaylistView } from '@/components/PlaylistView';
import { PersistentPlayer } from '@/components/PersistentPlayer';
import { SecurityModal } from '@/components/SecurityModal';
import { ProfileModal } from '@/components/ProfileModal';
import { TrackSkeletonRow } from '@/components/SkeletonLoader';
import { SafeImage } from '@/components/SafeImage';
import { ArtistSpotlight } from '@/components/ArtistSpotlight';
import { GenreRecommendations } from '@/components/GenreRecommendations';
import { AddToPlaylistModal } from '@/components/AddToPlaylistModal';
import { DiscoverCarousel3D } from '@/components/DiscoverCarousel3D';

// Normalize song title to prevent duplicate versions of the same track in recommendation sessions
function normalizeSongTitle(title: string): string {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/\s*[\(\[\{][^\)\]\}]*[\)\]\}]/g, '')
    .replace(/\b(official|video|audio|lyrics|visualizer|remix|hd|4k|song|bass boosted|full song|version|clean)\b/gi, '')
    .replace(/[^\w\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

export default function SonicApp() {
  // Theme state: fixed to soothing dark mode
  const theme: 'dark' = 'dark';

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Playback & Audio State (starts paused, waiting for user interaction)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(INITIAL_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');

  // Playlists, Favorites, History
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [activePlaylistId, setActivePlaylistId] = useState<string>(INITIAL_PLAYLISTS[0].id);
  const [favorites, setFavorites] = useState<string[]>([INITIAL_TRACKS[0].id, INITIAL_TRACKS[1].id]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([INITIAL_TRACKS[0], INITIAL_TRACKS[1], INITIAL_TRACKS[2]]);
  const [playbackHistory, setPlaybackHistory] = useState<Track[]>([]);
  const [showAllRecent, setShowAllRecent] = useState<boolean>(false);

  // Session recommendation history: prevents playing the same-named song again in this session
  const [playedSessionTitles, setPlayedSessionTitles] = useState<string[]>([
    normalizeSongTitle(INITIAL_TRACKS[0].title),
  ]);

  // Dynamic recommendations for current song
  const [dynamicRecs, setDynamicRecs] = useState<Track[]>([]);
  const [dynamicGenre, setDynamicGenre] = useState<string>('');
  const [dynamicDesc, setDynamicDesc] = useState<string>('');

  // Navigation & Search
  const [activeTab, setActiveTab] = useState<'explore' | 'playlist' | 'favorites' | 'history'>('explore');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Track[]>(INITIAL_TRACKS);
  const [searchSuggestion, setSearchSuggestion] = useState<SearchSuggestion | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Modals
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [trackForPlaylistModal, setTrackForPlaylistModal] = useState<Track | null>(null);

  // Initialize saved state from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('sonic_user');
    const savedPlaylists = localStorage.getItem('sonic_playlists');
    const savedFavs = localStorage.getItem('sonic_favorites');

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setIsAuthenticated(true);
      } catch {
        // fallback
      }
    }

    if (savedPlaylists) {
      try {
        setPlaylists(JSON.parse(savedPlaylists));
      } catch {
        // fallback
      }
    }

    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch {
        // fallback
      }
    }
  }, []);

  const handleAuthenticated = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('sonic_user', JSON.stringify(user));
  };

  const handleExploreGuest = () => {
    setCurrentUser(INITIAL_USER);
    setIsAuthenticated(true);
    localStorage.setItem('sonic_user', JSON.stringify(INITIAL_USER));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsPlaying(false);
    setIsProfileModalOpen(false);
    localStorage.removeItem('sonic_user');
  };

  const handleUpdateAvatar = (newAvatarUrl: string) => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      avatarUrl: newAvatarUrl,
    };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('sonic_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Failed to save avatar', err);
    }
  };

  // Search handler with debounce (searches all songs live on catalog/youtube)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(INITIAL_TRACKS);
      setSearchSuggestion(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: {
            'X-Requested-With': 'SonicApp',
          },
        });
        const data = await res.json();
        setSearchResults(data.results || []);
        setSearchSuggestion(data.suggestion || null);
      } catch (err) {
        console.error('Search request failed', err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load live dynamic recommendations from YouTube matching the currently playing song
  useEffect(() => {
    if (!currentTrack) return;
    let isCancelled = false;

    async function fetchDynamicRecommendations() {
      try {
        const queryParams = new URLSearchParams({
          videoId: currentTrack?.youtubeId || '',
          title: currentTrack?.title || '',
          artist: currentTrack?.artist || '',
          genre: currentTrack?.genre || '',
        });
        const res = await fetch(`/api/recommendations?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && Array.isArray(data.tracks) && data.tracks.length > 0) {
            setDynamicRecs(data.tracks);
            if (data.genre) setDynamicGenre(data.genre);
            if (data.description) setDynamicDesc(data.description);
          }
        }
      } catch (err) {
        console.warn('Failed to load dynamic recommendations', err);
      }
    }

    fetchDynamicRecommendations();
    return () => {
      isCancelled = true;
    };
  }, [currentTrack]);

  // Audio Playback Handlers
  const handlePlayTrack = useCallback(async (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying((prev) => !prev);
      return;
    }

    // Push previous song to history stack
    if (currentTrack && currentTrack.id !== track.id) {
      setPlaybackHistory((prev) => [currentTrack, ...prev.filter((t) => t.id !== currentTrack.id)].slice(0, 30));
    }

    // Track session title for recommendation deduplication
    const norm = normalizeSongTitle(track.title);
    if (norm) {
      setPlayedSessionTitles((prev) => (prev.includes(norm) ? prev : [...prev, norm]));
    }

    setCurrentTrack(track);
    setIsPlaying(true);

    // Update Recently Played
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((t) => t.id !== track.id);
      return [track, ...filtered].slice(0, 50);
    });

    if (!track.isConverted) {
      try {
        await processYoutubeToMp3Algorithm(track);
        track.isConverted = true;
        track.bitrate = 'Lossless Stereo';
      } catch {
        // Fallback gracefully
      }
    }
  }, [currentTrack]);

  const handleTogglePlay = () => {
    if (!currentTrack && INITIAL_TRACKS.length > 0) {
      handlePlayTrack(INITIAL_TRACKS[0]);
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const activePlaylist = playlists.find((p) => p.id === activePlaylistId) || playlists[0];
  const activePlaylistMinutes = Math.floor(
    (activePlaylist?.tracks || []).reduce((acc, t) => acc + (t.duration || 0), 0) / 60
  );

  // Next Track:
  // - Autoplays next song as soon as loaded
  // - In playlist mode: loops through playlist, repeating when finished
  // - In recommendation mode: skips songs with same name played once in this session, taking next song of same genre
  const handleNextTrack = () => {
    if (repeatMode === 'one' && currentTrack) {
      handlePlayTrack(currentTrack);
      return;
    }

    const isPlaylistMode = activeTab === 'playlist' && activePlaylist?.tracks && activePlaylist.tracks.length > 0;

    // PLAYLIST MODE: Repeats playlist when fully played through!
    if (isPlaylistMode) {
      const pool = activePlaylist.tracks;
      if (pool.length === 0) return;

      if (isShuffled) {
        const candidates = pool.filter((t) => t.id !== currentTrack?.id);
        const next = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : pool[0];
        handlePlayTrack(next);
        return;
      }

      const currentIndex = pool.findIndex((t) => t.id === currentTrack?.id);
      const nextIndex = (currentIndex + 1) % pool.length; // Repeats playlist cleanly
      handlePlayTrack(pool[nextIndex]);
      return;
    }

    // RECOMMENDATION MODE: Deduplicate so songs of same name are not repeated in the session
    let pool: Track[] = [];
    if (dynamicRecs.length > 0) {
      pool = dynamicRecs;
    } else {
      const recTracks = getRecommendedTracksForTrack(currentTrack).tracks;
      pool = recTracks.length > 0 ? recTracks : INITIAL_TRACKS;
    }

    if (pool.length === 0) return;

    // Filter out songs whose normalized base name was already played in this session
    const unplayedCandidates = pool.filter((t) => {
      if (t.id === currentTrack?.id) return false;
      const norm = normalizeSongTitle(t.title);
      return !playedSessionTitles.includes(norm);
    });

    if (unplayedCandidates.length > 0) {
      if (isShuffled) {
        const rand = unplayedCandidates[Math.floor(Math.random() * unplayedCandidates.length)];
        handlePlayTrack(rand);
      } else {
        handlePlayTrack(unplayedCandidates[0]);
      }
      return;
    }

    // If active dynamic recs all played, check fallback tracks from the genre
    const genreArchiveFallback = INITIAL_TRACKS.filter((t) => {
      if (t.id === currentTrack?.id) return false;
      const norm = normalizeSongTitle(t.title);
      return !playedSessionTitles.includes(norm);
    });

    if (genreArchiveFallback.length > 0) {
      handlePlayTrack(genreArchiveFallback[0]);
      return;
    }

    // If completely exhausted in session, pick next track in pool
    const currentIndex = pool.findIndex((t) => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % pool.length;
    handlePlayTrack(pool[nextIndex]);
  };

  // Previous Track: plays the song that was previously playing from history!
  const handlePrevTrack = () => {
    if (repeatMode === 'one' && currentTrack) {
      handlePlayTrack(currentTrack);
      return;
    }

    if (playbackHistory.length > 0) {
      const lastPlayed = playbackHistory[0];
      setPlaybackHistory((prev) => prev.slice(1));
      handlePlayTrack(lastPlayed);
      return;
    }

    let pool: Track[] = [];
    if (activeTab === 'playlist' && activePlaylist?.tracks?.length > 0) {
      pool = activePlaylist.tracks;
    } else if (activeTab === 'favorites' && favorites.length > 0) {
      pool = INITIAL_TRACKS.filter((t) => favorites.includes(t.id));
    } else if (dynamicRecs.length > 0) {
      pool = dynamicRecs;
    } else {
      pool = INITIAL_TRACKS;
    }

    if (pool.length === 0) return;

    const currentIndex = pool.findIndex((t) => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + pool.length) % pool.length;
    handlePlayTrack(pool[prevIndex]);
  };

  // Track ending handler: auto-advances to next track and autoplays
  const handleTrackEnd = () => {
    if (repeatMode === 'one' && currentTrack) {
      handlePlayTrack(currentTrack);
      return;
    }
    handleNextTrack();
  };

  const handleToggleShuffle = () => {
    setIsShuffled((prev) => !prev);
  };

  const handleToggleRepeat = () => {
    if (repeatMode === 'off') {
      setRepeatMode('one');
    } else if (repeatMode === 'one') {
      setRepeatMode('all');
    } else {
      setRepeatMode('off');
    }
  };

  const handleToggleFavorite = (trackId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(trackId);
      const updated = isFav ? prev.filter((id) => id !== trackId) : [...prev, trackId];
      localStorage.setItem('sonic_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Interactive Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTyping =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement;
      if (isTyping) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextTrack();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevTrack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTrack, dynamicRecs, playbackHistory, activeTab, activePlaylist]);

  // Playlist handlers
  const handleCreatePlaylist = (name: string, description: string) => {
    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      userId: currentUser?.id || 'usr-sonic-vip',
      name,
      description,
      coverUrl: '/album-midnight-drive.jpg',
      tracks: currentTrack ? [currentTrack] : [INITIAL_TRACKS[0]],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newPl, ...playlists];
    setPlaylists(updated);
    setActivePlaylistId(newPl.id);
    localStorage.setItem('sonic_playlists', JSON.stringify(updated));
  };

  const handleUpdatePlaylistTracks = (playlistId: string, updatedTracks: Track[]) => {
    const updated = playlists.map((p) => {
      if (p.id === playlistId) {
        return { ...p, tracks: updatedTracks, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    setPlaylists(updated);
    localStorage.setItem('sonic_playlists', JSON.stringify(updated));
  };

  const handleOpenAddToPlaylistModal = (track: Track) => {
    setTrackForPlaylistModal(track);
  };

  const handleAddTrackToSpecificPlaylist = (playlistId: string, track: Track) => {
    const targetPl = playlists.find((p) => p.id === playlistId);
    if (!targetPl) return;
    if (targetPl.tracks.some((t) => t.id === track.id)) {
      return;
    }
    const updatedTracks = [...targetPl.tracks, track];
    handleUpdatePlaylistTracks(playlistId, updatedTracks);
  };

  const handleCreatePlaylistAndAdd = (name: string, track: Track) => {
    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      userId: currentUser?.id || 'usr-sonic-vip',
      name,
      description: 'Custom curated audio crate',
      coverUrl: track.coverUrl || '/album-midnight-drive.jpg',
      tracks: [track],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newPl, ...playlists];
    setPlaylists(updated);
    setActivePlaylistId(newPl.id);
    localStorage.setItem('sonic_playlists', JSON.stringify(updated));
  };

  const handleRandomizeFromHero = () => {
    if (!activePlaylist || !activePlaylist.tracks || activePlaylist.tracks.length === 0) return;
    const shuffled = shuffleTracks(activePlaylist.tracks);
    handleUpdatePlaylistTracks(activePlaylist.id, shuffled);
    handlePlayTrack(shuffled[0]);
  };

  const handleShuffleFavorites = () => {
    const favTracks = INITIAL_TRACKS.filter((t) => favorites.includes(t.id));
    if (favTracks.length === 0) return;
    const shuffled = shuffleTracks(favTracks);
    handlePlayTrack(shuffled[0]);
  };

  if (!isAuthenticated) {
    return (
      <AuthView
        theme={theme}
        onThemeToggle={() => {}}
        onAuthenticated={handleAuthenticated}
        onExploreGuest={handleExploreGuest}
      />
    );
  }

  // Display top 10 recent plays or full list
  const displayedRecentTracks = showAllRecent ? recentlyPlayed : recentlyPlayed.slice(0, 10);
  const hasMoreRecent = recentlyPlayed.length > 10;

  return (
    <div className="min-h-screen flex flex-col relative pb-36 select-none bg-gradient-to-b from-[#020617] via-[#040c24] to-[#02040f] text-white">
      {/* Soothing Deep Navy & Blue Ambient Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Image
          src="/sonic-dark-room.jpg"
          alt="Studio Background"
          fill
          priority
          className="object-cover object-center opacity-15 filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/95 via-[#03091e]/95 to-[#01040d]" />
        {/* Soothing Cyan & Deep Sapphire Radial Ambient Spotlights */}
        <div className="absolute top-10 right-1/4 w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        suggestion={searchSuggestion}
        searchResults={searchResults}
        isSearching={isSearching}
        activeTab={activeTab}
        theme={theme}
        currentUser={currentUser}
        onSearchChange={setSearchQuery}
        onSelectSuggestion={(corrected) => setSearchQuery(corrected)}
        onPlayTrack={handlePlayTrack}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'explore') setSearchQuery('');
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenSecurity={() => setIsSecurityModalOpen(true)}
        onReturnToAuth={() => setIsAuthenticated(false)}
      />

      {/* Main Music Studio Content Area */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex-1 space-y-12">
        {/* ========================================================================= */}
        {/* TAB 1: EXPLORE TAB (3D Turntable Player + High-Fidelity Audio Showcase)   */}
        {/* ========================================================================= */}
        {activeTab === 'explore' && (
          <div className="space-y-10 animate-fade-in">
            {/* Top 3D Showcase: Interactive 3D Turntable + Clean Majestic Now Playing Console */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: 3D Turntable Player with Tone-Arm & Vinyl */}
              <div className="lg:col-span-5 flex justify-center">
                <VinylPlayer3D
                  currentTrack={currentTrack}
                  isPlaying={isPlaying}
                  theme={theme}
                  onTogglePlay={handleTogglePlay}
                />
              </div>

              {/* Right: Master Control & Song Details (Removed Featured 3D Vinyl Masters) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span>SONIC HIGH-FIDELITY STEREO PIPELINE</span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
                    {currentTrack?.title || 'Sonic Master Recordings'}
                  </h1>
                  <p className="text-base sm:text-lg text-slate-300">
                    by <strong className="text-sky-300 font-semibold">{currentTrack?.artist || 'Sonic Audio Engine'}</strong>
                    {currentTrack?.album && (
                      <span className="text-slate-400"> • Album: <span className="text-slate-200">{currentTrack.album}</span></span>
                    )}
                  </p>
                </div>

                {/* Quick Interactive Actions for Now Playing Track */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {currentTrack && (
                    <>
                      <button
                        onClick={() => handleOpenAddToPlaylistModal(currentTrack)}
                        className="px-5 py-2.5 rounded-2xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/35 text-sky-300 font-semibold text-xs flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md shadow-sky-500/10"
                      >
                        <FolderPlus className="w-4 h-4 text-sky-400" />
                        <span>Add to Playlist</span>
                      </button>

                      <button
                        onClick={() => handleToggleFavorite(currentTrack.id)}
                        className={`px-5 py-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
                          favorites.includes(currentTrack.id)
                            ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(currentTrack.id) ? 'fill-rose-500 text-rose-400' : ''}`} />
                        <span>{favorites.includes(currentTrack.id) ? 'Favorited' : 'Favorite'}</span>
                      </button>
                    </>
                  )}
                  <div className="px-3.5 py-2 rounded-2xl bg-slate-900/60 border border-sky-500/20 text-xs font-mono text-slate-400">
                    Lossless Audio • 48 kHz / 24-Bit
                  </div>
                </div>
              </div>
            </section>

            {/* 3D Discover & Stream Carousel with Mouse Wheel Scrolling */}
            <section className="space-y-4">
              <DiscoverCarousel3D
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                theme={theme}
                onPlayTrack={handlePlayTrack}
              />
            </section>

            {/* Live Search & Catalog Stream Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'Sonic Catalog & Search Results'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live song stream across Hindi, Global, and Indie artists.
                  </p>
                </div>

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-sky-400 hover:underline font-mono"
                  >
                    Clear search
                  </button>
                )}
              </div>

              {/* Skeleton Loading State */}
              {isSearching ? (
                <div className="space-y-2">
                  <TrackSkeletonRow theme={theme} />
                  <TrackSkeletonRow theme={theme} />
                  <TrackSkeletonRow theme={theme} />
                  <TrackSkeletonRow theme={theme} />
                </div>
              ) : (
                <div className="p-6 rounded-[32px] border border-sky-500/15 backdrop-blur-xl bg-[#03091c]/80">
                  <TrackList
                    tracks={searchResults}
                    currentTrack={currentTrack}
                    isPlaying={isPlaying}
                    favorites={favorites}
                    theme={theme}
                    onPlayTrack={handlePlayTrack}
                    onToggleFavorite={handleToggleFavorite}
                    onAddToPlaylist={handleOpenAddToPlaylistModal}
                  />
                </div>
              )}
            </section>

            {/* Recommended Songs in Explore tab */}
            <GenreRecommendations
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              favorites={favorites}
              theme={theme}
              customTracks={dynamicRecs}
              customGenre={dynamicGenre}
              customDescription={dynamicDesc}
              onPlayTrack={handlePlayTrack}
              onToggleFavorite={handleToggleFavorite}
              onAddToPlaylist={handleOpenAddToPlaylistModal}
            />

            {/* Artist Spotlight: Rendered strictly on Explore tab */}
            <div className="border-t border-sky-500/20 pt-10">
              <ArtistSpotlight
                artistName={currentTrack?.artist || 'Imagine Dragons'}
                theme={theme}
                onPlayAlbum={() => {
                  if (currentTrack) handlePlayTrack(currentTrack);
                }}
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PLAYLISTS TAB (3D Vinyl Crate & Modular DJ Deck Hero)              */}
        {/* ========================================================================= */}
        {activeTab === 'playlist' && (
          <div className="space-y-10 animate-fade-in">
            {/* Unique 3D DJ Crate & Playlist Hero */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: 3D DJ Vinyl Crate Visual Showcase */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-80 h-80 rounded-[32px] p-6 border border-sky-500/25 backdrop-blur-2xl shadow-2xl flex flex-col justify-between overflow-hidden group transition-all duration-500 hover:shadow-[0_0_30px_rgba(56,189,248,0.25)] hover:border-sky-400/50 bg-gradient-to-br from-[#071333] via-[#040c24] to-[#020512]">
                  {/* Layered Stacked Vinyl Records Illusion */}
                  <div className="relative flex-1 flex items-center justify-center">
                    <div className="absolute w-44 h-44 rounded-full bg-slate-900 border-2 border-slate-700/50 shadow-xl translate-x-8 -translate-y-6 opacity-40 group-hover:translate-x-10 transition-transform duration-500" />
                    <div className="absolute w-48 h-48 rounded-full bg-slate-900 border-2 border-slate-700/70 shadow-2xl translate-x-4 -translate-y-3 opacity-70 group-hover:translate-x-6 transition-transform duration-500" />

                    <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.6)] border border-white/20 z-10 group-hover:scale-105 transition-transform duration-500">
                      <SafeImage
                        src={activePlaylist.coverUrl || '/album-midnight-drive.jpg'}
                        fallbackSrc="/album-midnight-drive.jpg"
                        alt={activePlaylist.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                        <span className="text-xs font-mono font-bold text-sky-400 truncate">
                          {activePlaylist.name}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`absolute right-2 w-40 h-40 rounded-full border border-sky-500/40 shadow-2xl z-0 ${
                        isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''
                      }`}
                      style={{
                        background:
                          'radial-gradient(circle, #1e293b 0%, #0f172a 30%, #020617 70%, #000 100%)',
                      }}
                    >
                      <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-slate-950" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                      <Layers className="w-3.5 h-3.5" />
                      STUDIO CRATE #{activePlaylist.id.slice(-4).toUpperCase()}
                    </span>
                    <span>Lossless ID3v2</span>
                  </div>
                </div>
              </div>

              {/* Right: Playlist Studio Management Console */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold tracking-wider">
                  <ListMusic className="w-3.5 h-3.5" />
                  <span>SONIC DJ CRATE & STUDIO PLAYLISTS</span>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                    {activePlaylist.name}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 max-w-xl">
                    {activePlaylist.description ||
                      'Custom sequenced audiophile selection. Loops through your playlist seamlessly.'}
                  </p>
                </div>

                {/* Playlist Stats */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-2">
                    <Music2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>{activePlaylist.tracks.length} Master Recordings</span>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>~{activePlaylistMinutes} mins Runtime</span>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                    {playlists.length} Custom Crates
                  </div>
                </div>

                {/* Quick Actions Bar */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleRandomizeFromHero}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all hover:scale-105 active:scale-95"
                  >
                    <Dices className="w-4 h-4 text-slate-950" />
                    <span>Roll 3D Randomizer</span>
                  </button>

                  {activePlaylist.tracks.length > 0 && (
                    <button
                      onClick={() => handlePlayTrack(activePlaylist.tracks[0])}
                      className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center gap-2 transition-all hover:scale-105"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Play Crate</span>
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Playlist Component */}
            <PlaylistView
              playlists={playlists}
              activePlaylistId={activePlaylistId}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              favorites={favorites}
              theme={theme}
              onSelectPlaylist={(id) => setActivePlaylistId(id)}
              onCreatePlaylist={handleCreatePlaylist}
              onPlayTrack={handlePlayTrack}
              onToggleFavorite={handleToggleFavorite}
              onUpdatePlaylistTracks={handleUpdatePlaylistTracks}
              onOpenSearch={() => setActiveTab('explore')}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FAVORITES TAB (24K Gold Record Sanctuary)                          */}
        {/* ========================================================================= */}
        {activeTab === 'favorites' && (
          <div className="space-y-10 animate-fade-in">
            {/* 3D Gold Record Vault Hero */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-80 h-80 rounded-[32px] p-6 border border-sky-500/25 backdrop-blur-2xl shadow-2xl flex flex-col justify-between overflow-hidden group transition-all duration-500 hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] bg-gradient-to-br from-[#06122d] via-[#040c24] to-[#020512]">
                  <div className="absolute inset-0 bg-radial-gradient from-sky-500/20 via-transparent to-transparent pointer-events-none" />

                  {/* High-Fidelity Record */}
                  <div
                    className={`relative w-60 h-60 rounded-full shadow-[0_10px_40px_rgba(56,189,248,0.3)] border-4 border-sky-400/50 flex items-center justify-center ${
                      isPlaying ? 'animate-[spin_16s_linear_infinite]' : ''
                    }`}
                    style={{
                      background:
                        'conic-gradient(from 0deg, #0284c7, #38bdf8, #0369a1, #7dd3fc, #0284c7, #38bdf8, #0369a1, #7dd3fc, #0284c7)',
                    }}
                  >
                    <div className="absolute inset-4 rounded-full border border-sky-900/30 pointer-events-none" />
                    <div className="absolute inset-8 rounded-full border border-sky-900/30 pointer-events-none" />
                    <div className="absolute inset-12 rounded-full border border-sky-900/30 pointer-events-none" />
                    <div className="absolute inset-16 rounded-full border border-sky-900/30 pointer-events-none" />

                    <div className="relative w-20 h-20 rounded-full bg-slate-950 border-2 border-sky-400 flex flex-col items-center justify-center shadow-lg text-center p-1">
                      <Award className="w-5 h-5 text-sky-400 mb-0.5" />
                      <span className="text-[8px] font-mono font-extrabold text-sky-300 uppercase tracking-tighter">
                        VIP VAULT
                      </span>
                      <div className="w-2.5 h-2.5 rounded-full bg-black mt-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[11px] font-mono text-sky-300/90 pt-2 border-t border-sky-500/20">
                    <span className="flex items-center gap-1 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      VIP VAULT
                    </span>
                    <span>100% LOSSLESS STEREO</span>
                  </div>
                </div>
              </div>

              {/* Right: Vault Console & Metrics */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  <span>SONIC VIP ARCHIVE • THE VAULT</span>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                    Your Sonic Vault
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 max-w-xl">
                    Your private sanctuary of favorited audio tracks. Preserved in pristine
                    lossless conversion, available across all high-fidelity listening rooms.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="px-3.5 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs font-mono text-sky-300 flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
                    <span>{favorites.length} Liked Recordings</span>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                    100% Lossless Master
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                    Level 5 VIP Collector
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleShuffleFavorites}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all hover:scale-105 active:scale-95"
                  >
                    <Dices className="w-4 h-4 text-slate-950" />
                    <span>Shuffle Vault</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Liked Tracks Table */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-white">Favorited Recordings</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {favorites.length} tracks bookmarked with high-fidelity studio access.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-[32px] border border-sky-500/15 backdrop-blur-xl bg-[#03091c]/80">
                <TrackList
                  tracks={INITIAL_TRACKS.filter((t) => favorites.includes(t.id))}
                  currentTrack={currentTrack}
                  isPlaying={isPlaying}
                  favorites={favorites}
                  theme={theme}
                  onPlayTrack={handlePlayTrack}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToPlaylist={handleOpenAddToPlaylistModal}
                />
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: RECENT HISTORY TAB (Top 10 with View More / View Less)              */}
        {/* ========================================================================= */}
        {activeTab === 'history' && (
          <div className="space-y-10 animate-fade-in">
            {/* 3D Audiophile History Log Hero */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-80 h-80 rounded-[32px] p-6 border border-sky-500/25 backdrop-blur-2xl shadow-2xl flex flex-col justify-between overflow-hidden group transition-all duration-500 hover:shadow-[0_0_30px_rgba(56,189,248,0.25)] bg-gradient-to-br from-[#05112e] via-[#030a20] to-[#01040f]">
                  <div className="relative flex-1 flex flex-col items-center justify-center gap-3">
                    <div className="w-24 h-24 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-500">
                      <History className="w-10 h-10 text-sky-400" />
                    </div>

                    <div className="text-center">
                      <span className="text-3xl font-extrabold tracking-tight text-white block">
                        {recentlyPlayed.length}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                        Recorded Sessions
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      RECENT SESSION LOGS
                    </span>
                    <span>Lossless Stereo</span>
                  </div>
                </div>
              </div>

              {/* Right: History Console & Details */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold tracking-wider">
                  <History className="w-3.5 h-3.5" />
                  <span>SESSION AUDIT & PLAYBACK TIMELINE</span>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                    Listening Timeline
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 max-w-xl">
                    Full audit trail of decoded streams routed through the Sonic High-Fidelity Audio
                    pipeline with real-time audio integrity telemetry.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="px-3.5 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs font-mono text-sky-300 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{recentlyPlayed.length} Sessions Logged</span>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                    Lossless Audio Verified
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                    Zero Distortion Ratio
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {recentlyPlayed.length > 0 && (
                    <button
                      onClick={() => handlePlayTrack(recentlyPlayed[0])}
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all hover:scale-105 active:scale-95"
                    >
                      <History className="w-4 h-4 text-slate-950" />
                      <span>Replay Recent Stream</span>
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Recently Played List with Top 10 by default & View More / View Less */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-white">Recently Played Streams</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Showing {displayedRecentTracks.length} of {recentlyPlayed.length} played streams.
                  </p>
                </div>

                {/* Top View More / View Less button so user does not need to scroll down */}
                {hasMoreRecent && (
                  <button
                    onClick={() => setShowAllRecent(!showAllRecent)}
                    className="px-4 py-2 rounded-2xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/40 text-sky-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md hover:scale-105 active:scale-95"
                  >
                    <span>{showAllRecent ? 'View Less' : `View More (${recentlyPlayed.length} total)`}</span>
                  </button>
                )}
              </div>

              <div className="p-6 rounded-[32px] border border-sky-500/15 backdrop-blur-xl bg-[#03091c]/80">
                <TrackList
                  tracks={displayedRecentTracks}
                  currentTrack={currentTrack}
                  isPlaying={isPlaying}
                  favorites={favorites}
                  theme={theme}
                  onPlayTrack={handlePlayTrack}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToPlaylist={handleOpenAddToPlaylistModal}
                />

                {/* Bottom View More / View Less button */}
                {hasMoreRecent && (
                  <div className="pt-6 flex justify-center border-t border-white/5 mt-4">
                    <button
                      onClick={() => setShowAllRecent(!showAllRecent)}
                      className="px-6 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md"
                    >
                      <span>{showAllRecent ? 'View Less' : `View More (${recentlyPlayed.length} total)`}</span>
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Persistent Bottom Player Dock */}
      <PersistentPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        isShuffled={isShuffled}
        repeatMode={repeatMode}
        favorites={favorites}
        theme={theme}
        onTogglePlay={handleTogglePlay}
        onPrev={handlePrevTrack}
        onNext={handleNextTrack}
        onToggleShuffle={handleToggleShuffle}
        onToggleRepeat={handleToggleRepeat}
        onToggleFavorite={handleToggleFavorite}
        onAddToPlaylist={handleOpenAddToPlaylistModal}
        onTrackEnd={handleTrackEnd}
      />

      {/* Choose Which Playlist Modal */}
      <AddToPlaylistModal
        isOpen={!!trackForPlaylistModal}
        track={trackForPlaylistModal}
        playlists={playlists}
        theme={theme}
        onClose={() => setTrackForPlaylistModal(null)}
        onAddToPlaylist={handleAddTrackToSpecificPlaylist}
        onCreatePlaylistAndAdd={handleCreatePlaylistAndAdd}
      />

      {/* 20 Security Checks Modal */}
      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        theme={theme}
      />

      {/* Profile Modal with Personalized Avatar Upload */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={currentUser}
        theme={theme}
        onLogout={handleLogout}
        onUpdateAvatar={handleUpdateAvatar}
      />
    </div>
  );
}
