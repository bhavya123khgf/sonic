export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  youtubeId: string;
  youtubeUrl: string;
  genre?: string;
  bitrate?: string;
  convertedMp3Url?: string;
  format?: 'mp3' | 'aac' | 'stream';
  isConverted?: boolean;
}

export interface ArtistAlbum {
  title: string;
  year: string;
  coverUrl: string;
  tracksCount: number;
  badge?: string;
}

export interface ArtistProfile {
  name: string;
  verified: boolean;
  monthlyListeners: string;
  ranking?: string;
  origin: string;
  formedYear: string;
  genres: string[];
  bannerUrl: string;
  avatarUrl: string;
  bio: string[];
  quote: string;
  topAlbums: ArtistAlbum[];
  studioGear: string[];
  followersCount: string;
}

export interface Playlist {
  id: string;
  userId: string;
  name: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  avatarUrl: string;
  createdAt: string;
  stats: {
    totalHoursListened: number;
    tracksPlayed: number;
    favoriteGenre: string;
  };
}

export interface SearchSuggestion {
  original: string;
  corrected: string;
  confidence: number;
  matchedSong?: string;
  artist?: string;
}

export interface AudioEngineState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: 'off' | 'all' | 'one';
  playbackQuality: '320kbps MP3' | '256kbps AAC' | 'Lossless FLAC' | 'Hi-Fi Stream';
  isConverting: boolean;
  conversionProgress: number;
}

export interface SecurityCheckItem {
  id: number;
  name: string;
  category: 'Secrets' | 'Access Control' | 'Input Defense' | 'Network & Headers' | 'Production';
  status: 'passed' | 'warning' | 'failed';
  details: string;
  mitigation: string;
}
