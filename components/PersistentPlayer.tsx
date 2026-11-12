'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  Mic2,
  Headphones,
  FolderPlus,
} from 'lucide-react';
import { Track } from '@/lib/types';
import { SafeImage } from './SafeImage';
import { LyricsView } from './LyricsView';

interface PersistentPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  isShuffled: boolean;
  repeatMode: 'off' | 'all' | 'one';
  favorites: string[];
  theme?: 'dark' | 'light';
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleFavorite: (trackId: string) => void;
  onAddToPlaylist?: (track: Track) => void;
  onTrackEnd: () => void;
}

export const PersistentPlayer: React.FC<PersistentPlayerProps> = ({
  currentTrack,
  isPlaying,
  isShuffled,
  repeatMode,
  favorites,
  theme = 'dark',
  onTogglePlay,
  onPrev,
  onNext,
  onToggleShuffle,
  onToggleRepeat,
  onToggleFavorite,
  onAddToPlaylist,
  onTrackEnd,
}) => {
  const [progress, setProgress] = useState(0); // in seconds
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionStage, setConversionStage] = useState('');
  const [showLyrics, setShowLyrics] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const [isAudioActuallyPlaying, setIsAudioActuallyPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const prevTrackIdRef = useRef<string | null>(null);
  const hasUserStartedRef = useRef<boolean>(false);
  const repeatModeRef = useRef(repeatMode);

  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  const isDark = theme === 'dark';
  const duration = currentTrack?.duration || 210;
  const isFav = currentTrack ? favorites.includes(currentTrack.id) : false;

  // Send control commands to embedded audio player
  const postIframeCommand = useCallback((func: string, args: (string | number | boolean)[] = []) => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func,
            args,
          }),
          '*'
        );
      }
    } catch {
      // Fallback gracefully
    }
  }, []);

  // Post handshake to enable real-time telemetry from audio bridge
  const sendListeningHandshake = useCallback(() => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'listening',
          }),
          '*'
        );
      }
    } catch {
      // Fallback
    }
  }, []);

  // Sync play/pause with audio player: only send play command when user has initiated playback!
  useEffect(() => {
    if (isPlaying) {
      hasUserStartedRef.current = true;
      postIframeCommand('playVideo');
    } else if (hasUserStartedRef.current) {
      postIframeCommand('pauseVideo');
      setIsAudioActuallyPlaying(false);
    }
  }, [isPlaying, postIframeCommand]);

  // Sync volume on change WITHOUT resetting progress bar
  useEffect(() => {
    if (isMuted) {
      postIframeCommand('mute');
    } else {
      postIframeCommand('unMute');
      postIframeCommand('setVolume', [Math.round(volume * 100)]);
    }
  }, [volume, isMuted, postIframeCommand]);

  // Listen to audio bridge postMessage events for accurate time synchronization
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        if (typeof e.data === 'string') {
          const parsed = JSON.parse(e.data);
          if (parsed.event === 'infoDelivery' && parsed.info) {
            // Player state: 1 = Playing, 2 = Paused, 3 = Buffering, 0 = Ended
            if (parsed.info.playerState === 1) {
              setIsAudioActuallyPlaying(true);
            } else if (parsed.info.playerState === 3 || parsed.info.playerState === -1) {
              setIsAudioActuallyPlaying(false);
            }

            // Track state change to handle track ending
            if (parsed.info.playerState === 0) {
              setIsAudioActuallyPlaying(false);
              if (repeatModeRef.current === 'one') {
                setProgress(0);
                postIframeCommand('seekTo', [0, true]);
                postIframeCommand('playVideo');
                setIsAudioActuallyPlaying(true);
              } else {
                onTrackEnd();
              }
            } else if (typeof parsed.info.currentTime === 'number' && !isScrubbing) {
              const cur = Math.floor(parsed.info.currentTime);
              setProgress(cur);
              if (cur > 0) {
                setIsAudioActuallyPlaying(true);
              }
            }
          }
        }
      } catch {
        // Non-JSON message from other extensions
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isScrubbing, postIframeCommand, onTrackEnd]);

  // Track progress timer fallback ONLY when audio is actually playing and ready
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isConverting && !isScrubbing && hasUserStartedRef.current && isAudioActuallyPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= duration) {
            if (repeatModeRef.current === 'one') {
              postIframeCommand('seekTo', [0, true]);
              postIframeCommand('playVideo');
              return 0;
            }
            onTrackEnd();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isConverting, isScrubbing, duration, isAudioActuallyPlaying, postIframeCommand, onTrackEnd]);

  // Track change effect: ONLY resets progress when track ID actually changes
  useEffect(() => {
    if (!currentTrack) return;

    if (prevTrackIdRef.current !== currentTrack.id) {
      prevTrackIdRef.current = currentTrack.id;
      setProgress(0);
      setIsAudioActuallyPlaying(false);

      // Send listening handshakes to audio frame
      const t1 = setTimeout(sendListeningHandshake, 300);
      const t2 = setTimeout(sendListeningHandshake, 1200);

      if (!currentTrack.isConverted) {
        setIsConverting(true);
        setConversionStage('Loading audio stream...');
        const t = setTimeout(() => {
          setIsConverting(false);
          setConversionStage('');
          currentTrack.isConverted = true;
          postIframeCommand('setVolume', [Math.round(volume * 100)]);
          if (isPlaying || hasUserStartedRef.current) {
            postIframeCommand('playVideo');
            setIsAudioActuallyPlaying(true);
          }
        }, 500);
        return () => {
          clearTimeout(t);
          clearTimeout(t1);
          clearTimeout(t2);
        };
      } else {
        const t = setTimeout(() => {
          postIframeCommand('setVolume', [Math.round(volume * 100)]);
          if (isPlaying || hasUserStartedRef.current) {
            postIframeCommand('playVideo');
            setIsAudioActuallyPlaying(true);
          }
        }, 300);
        return () => {
          clearTimeout(t);
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }
    }
  }, [currentTrack?.id, sendListeningHandshake, postIframeCommand, isPlaying, volume]);

  // Real-time audio scrubbing / seeking
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsScrubbing(true);
    const newTime = Number(e.target.value);
    setProgress(newTime);
  };

  const handleSeekCommit = (newTime: number) => {
    setIsScrubbing(false);
    setProgress(newTime);
    hasUserStartedRef.current = true;
    postIframeCommand('seekTo', [newTime, true]);
    if (isPlaying) {
      postIframeCommand('playVideo');
    }
  };

  // Direct volume adjustment affecting audio without resetting progress
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (val === 0) {
      setIsMuted(true);
      postIframeCommand('mute');
    } else {
      setIsMuted(false);
      postIframeCommand('unMute');
      postIframeCommand('setVolume', [Math.round(val * 100)]);
    }
  };

  // Mute / Unmute toggle affecting audio without resetting progress
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      postIframeCommand('mute');
    } else {
      postIframeCommand('unMute');
      postIframeCommand('setVolume', [Math.round(volume * 100)]);
    }
  };

  // Seeking directly from lyrics line click
  const handleSeekFromLyrics = (time: number) => {
    setProgress(time);
    hasUserStartedRef.current = true;
    postIframeCommand('seekTo', [time, true]);
    if (isPlaying) {
      postIframeCommand('playVideo');
    }
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = Math.floor(sec % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <>
      {/* Live Synchronized Lyrics Floating Modal */}
      <LyricsView
        track={currentTrack}
        currentTime={progress}
        isOpen={showLyrics}
        theme={theme}
        onClose={() => setShowLyrics(false)}
        onSeekToTime={handleSeekFromLyrics}
      />

      <aside
        className={`fixed bottom-0 left-0 right-0 z-50 backdrop-blur-2xl border-t transition-colors duration-500 px-4 sm:px-8 py-3 select-none ${
          isDark
            ? 'bg-zinc-950/95 border-amber-500/20 text-white shadow-[0_-15px_40px_rgba(0,0,0,0.85)]'
            : 'bg-white/95 border-amber-500/30 text-zinc-900 shadow-[0_-15px_40px_rgba(0,0,0,0.1)]'
        }`}
      >
        {/* Playbar Timeline Scrubber */}
        <div className="max-w-7xl mx-auto flex items-center gap-3 px-2 mb-2">
          <span className="text-[10px] font-mono text-zinc-400 w-9 text-right">
            {formatTime(progress)}
          </span>
          <div className="relative flex-1 flex items-center group">
            <input
              type="range"
              min={0}
              max={duration}
              value={progress}
              onChange={handleSeekChange}
              onMouseUp={(e) => handleSeekCommit(Number((e.target as HTMLInputElement).value))}
              onTouchEnd={(e) => handleSeekCommit(Number((e.target as HTMLInputElement).value))}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500 group-hover:h-2 transition-all"
            />
            {/* Active progress fill */}
            <div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full pointer-events-none group-hover:h-2 transition-all"
              style={{ width: `${Math.min(100, Math.max(0, (progress / duration) * 100))}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-zinc-400 w-9 text-left">
            {formatTime(duration)}
          </span>
        </div>

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left Section: Track Info & Studio Quality Badge */}
          <div className="flex items-center gap-3.5 min-w-0 w-1/4">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md flex-shrink-0 border border-white/10 group">
              <SafeImage
                src={currentTrack.coverUrl}
                fallbackSrc="/album-midnight-drive.jpg"
                alt={currentTrack.title}
                fill
                className={`object-cover ${isPlaying ? 'animate-[spin_20s_linear_infinite]' : ''}`}
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white shadow" />
                </div>
              )}
            </div>

            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold truncate">{currentTrack.title}</h4>
                <button
                  onClick={() => onToggleFavorite(currentTrack.id)}
                  className="text-zinc-400 hover:text-rose-500 transition-colors"
                  title={isFav ? 'Remove favorite' : 'Add favorite'}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
                {onAddToPlaylist && (
                  <button
                    onClick={() => onAddToPlaylist(currentTrack)}
                    className="text-zinc-400 hover:text-cyan-400 transition-colors p-0.5 rounded-md hover:bg-white/10"
                    title="Add to Playlist"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 truncate">{currentTrack.artist}</p>
              {/* Audio Quality indicator */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] font-mono text-cyan-400">
                  {isConverting ? conversionStage : 'Lossless • Stereo'}
                </span>
              </div>
            </div>
          </div>

          {/* Center Section: Core Transport Audio Controls */}
          <div className="flex flex-col items-center gap-1 flex-1 max-w-md">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Shuffle */}
              <button
                onClick={onToggleShuffle}
                className={`p-2 rounded-full transition-all ${
                  isShuffled
                    ? 'text-cyan-400 bg-cyan-500/20 scale-110 shadow-sm shadow-cyan-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title={isShuffled ? 'Shuffle: Enabled' : 'Shuffle: Disabled'}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              {/* Prev */}
              <button
                onClick={() => {
                  hasUserStartedRef.current = true;
                  if (progress > 3) {
                    postIframeCommand('seekTo', [0, true]);
                    setProgress(0);
                  } else {
                    onPrev();
                  }
                }}
                className="text-zinc-400 hover:text-white transition-colors"
                title="Previous Track"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              {/* Play / Pause Toggle */}
              <button
                onClick={() => {
                  hasUserStartedRef.current = true;
                  onTogglePlay();
                }}
                className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 hover:scale-110 active:scale-95 transition-all"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={() => {
                  hasUserStartedRef.current = true;
                  onNext();
                }}
                className="text-zinc-400 hover:text-white transition-colors"
                title="Next Recommended Track"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              {/* Repeat */}
              <button
                onClick={onToggleRepeat}
                className={`p-2 rounded-full transition-all relative ${
                  repeatMode !== 'off'
                    ? 'text-amber-400 bg-amber-500/20 scale-110 shadow-sm shadow-amber-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title={`Repeat Mode: ${repeatMode}`}
              >
                <Repeat className="w-4 h-4" />
                {repeatMode === 'one' && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 text-[8px] font-bold text-black flex items-center justify-center">
                    1
                  </span>
                )}
              </button>
            </div>

            {/* Equalizer frequency visualizer bars */}
            <div className="flex items-center gap-1 h-3">
              {[40, 75, 20, 95, 60, 30, 85, 45, 100, 65, 35, 80, 50, 90].map((h, i) => (
                <span
                  key={i}
                  className="w-0.5 rounded-full transition-all duration-300"
                  style={{
                    height: isPlaying ? `${h}%` : '20%',
                    backgroundColor: isPlaying ? '#f59e0b' : '#52525b',
                    opacity: isPlaying ? 0.9 : 0.3,
                    animation: isPlaying
                      ? `pulse 0.8s ease-in-out infinite ${(i * 0.08) % 0.8}s`
                      : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right Section: Lyrics Toggle, Volume & Audio Bridge */}
          <div className="hidden sm:flex items-center justify-end gap-3 w-1/4">
            {/* Synchronized Lyrics Tab Button */}
            <button
              onClick={() => setShowLyrics(!showLyrics)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                showLyrics
                  ? 'bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/25 scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10 hover:text-white'
              }`}
              title="Toggle Live Synchronized Lyrics"
            >
              <Mic2 className="w-3.5 h-3.5" />
              <span>Lyrics</span>
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-zinc-400 hover:text-white transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Studio Audio Quality Badge */}
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline text-[11px] font-mono text-zinc-400">Master</span>
            </div>
          </div>
        </div>

        {/* Embedded Audio Stream Sync Bridge with autoplay=0 so it WAITS for user to play */}
        {currentTrack.youtubeId && (
          <iframe
            key={currentTrack.youtubeId}
            ref={iframeRef}
            className="hidden"
            width="1"
            height="1"
            src={`https://www.youtube-nocookie.com/embed/${currentTrack.youtubeId}?enablejsapi=1&autoplay=0&playsinline=1&controls=0`}
            allow="autoplay; encrypted-media"
            title="Sonic Audio Sync Bridge"
          />
        )}
      </aside>
    </>
  );
};
