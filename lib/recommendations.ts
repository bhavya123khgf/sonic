import { Track } from './types';

export interface GenreRecommendationGroup {
  genre: string;
  description: string;
  tracks: Track[];
}

export const GENRE_TRACK_ARCHIVE: Record<string, Track[]> = {
  'alternative rock': [
    {
      id: 'rec-alt-1',
      title: 'Radioactive',
      artist: 'Imagine Dragons',
      album: 'Night Visions',
      duration: 186,
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
      youtubeId: 'ktvTqknDobU',
      youtubeUrl: 'https://www.youtube.com/watch?v=ktvTqknDobU',
      genre: 'Alternative Rock',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
    {
      id: 'rec-alt-2',
      title: 'Demons',
      artist: 'Imagine Dragons',
      album: 'Night Visions',
      duration: 177,
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      youtubeId: 'mWRsgZuwf_8',
      youtubeUrl: 'https://www.youtube.com/watch?v=mWRsgZuwf_8',
      genre: 'Arena Rock',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
    {
      id: 'rec-alt-3',
      title: 'Natural',
      artist: 'Imagine Dragons',
      album: 'Origins',
      duration: 189,
      coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
      youtubeId: '0I647GU3Jsc',
      youtubeUrl: 'https://www.youtube.com/watch?v=0I647GU3Jsc',
      genre: 'Alternative Rock',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
    {
      id: 'rec-alt-4',
      title: 'Bones',
      artist: 'Imagine Dragons',
      album: 'Mercury – Act 2',
      duration: 165,
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      youtubeId: 'TO-_3tck2tg',
      youtubeUrl: 'https://www.youtube.com/watch?v=TO-_3tck2tg',
      genre: 'Alternative Pop Rock',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
    {
      id: 'rec-alt-5',
      title: 'Whatever It Takes',
      artist: 'Imagine Dragons',
      album: 'Evolve',
      duration: 201,
      coverUrl: 'https://i.ytimg.com/vi/7wtfhZwyrcc/hqdefault.jpg',
      youtubeId: 'gOsM-Z34PWU',
      youtubeUrl: 'https://www.youtube.com/watch?v=gOsM-Z34PWU',
      genre: 'Arena Rock',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
    {
      id: 'rec-alt-6',
      title: 'Enemy',
      artist: 'Imagine Dragons & JID',
      album: 'Mercury – Act 1',
      duration: 173,
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
      youtubeId: 'D9G1VOjN_84',
      youtubeUrl: 'https://www.youtube.com/watch?v=D9G1VOjN_84',
      genre: 'Alternative Pop',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
  ],

  synthwave: [
    {
      id: 'rec-synth-1',
      title: 'Nightcall',
      artist: 'Kavinsky',
      album: 'OutRun',
      duration: 259,
      coverUrl: '/album-midnight-drive.jpg',
      youtubeId: 'MV_3Dpw-BRY',
      youtubeUrl: 'https://www.youtube.com/watch?v=MV_3Dpw-BRY',
      genre: 'Darksynth / Retrowave',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
    {
      id: 'rec-synth-2',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: 200,
      coverUrl: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg',
      youtubeId: '4NRXx6U8ABQ',
      youtubeUrl: 'https://www.youtube.com/watch?v=4NRXx6U8ABQ',
      genre: 'Synth-Pop',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
    {
      id: 'rec-synth-3',
      title: 'Resonance',
      artist: 'HOME',
      album: 'Odyssey',
      duration: 212,
      coverUrl: '/album-better-days.jpg',
      youtubeId: '8GW6sLrK40k',
      youtubeUrl: 'https://www.youtube.com/watch?v=8GW6sLrK40k',
      genre: 'Chillwave',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
    {
      id: 'rec-synth-4',
      title: 'Sunset',
      artist: 'The Midnight',
      album: 'Endless Summer',
      duration: 326,
      coverUrl: '/album-lost-in-you.jpg',
      youtubeId: 'R_9yLp0tH0U',
      youtubeUrl: 'https://www.youtube.com/watch?v=R_9yLp0tH0U',
      genre: 'Synthwave',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
    {
      id: 'rec-synth-5',
      title: 'Tech Noir',
      artist: 'Gunship',
      album: 'Gunship',
      duration: 297,
      coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&auto=format&fit=crop&q=80',
      youtubeId: '-ED4i_qQy3E',
      youtubeUrl: 'https://www.youtube.com/watch?v=-ED4i_qQy3E',
      genre: 'Cyberpunk Retrowave',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
  ],

  'indie acoustic': [
    {
      id: 'rec-ac-1',
      title: 'Bloom',
      artist: 'The Paper Kites',
      album: 'Woodland',
      duration: 210,
      coverUrl: '/album-lost-in-you.jpg',
      youtubeId: '8inJtTG_leQ',
      youtubeUrl: 'https://www.youtube.com/watch?v=8inJtTG_leQ',
      genre: 'Indie Acoustic',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
    {
      id: 'rec-ac-2',
      title: 'Holocene',
      artist: 'Bon Iver',
      album: 'Bon Iver',
      duration: 336,
      coverUrl: '/album-better-days.jpg',
      youtubeId: 'TWcyIpul8OE',
      youtubeUrl: 'https://www.youtube.com/watch?v=TWcyIpul8OE',
      genre: 'Ambient Folk',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
    {
      id: 'rec-ac-3',
      title: 'Rivers and Roads',
      artist: 'The Head and the Heart',
      album: 'The Head and the Heart',
      duration: 284,
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
      youtubeId: 'e2J-0WyWbqc',
      youtubeUrl: 'https://www.youtube.com/watch?v=e2J-0WyWbqc',
      genre: 'Indie Folk',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
    {
      id: 'rec-ac-4',
      title: 'Better Days',
      artist: 'Lumina Echo',
      album: 'Better Days',
      duration: 220,
      coverUrl: '/album-better-days.jpg',
      youtubeId: 'kXYiU_JCYtU',
      youtubeUrl: 'https://www.youtube.com/watch?v=kXYiU_JCYtU',
      genre: 'Acoustic Ambient',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
  ],

  'r&b pop': [
    {
      id: 'rec-pop-1',
      title: 'Save Your Tears',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: 215,
      coverUrl: 'https://i.ytimg.com/vi/XXYlFuWEuKI/hqdefault.jpg',
      youtubeId: 'XXYlFuWEuKI',
      youtubeUrl: 'https://www.youtube.com/watch?v=XXYlFuWEuKI',
      genre: 'Synth-Pop',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
    {
      id: 'rec-pop-2',
      title: 'Die For You',
      artist: 'The Weeknd',
      album: 'Starboy',
      duration: 260,
      coverUrl: 'https://i.ytimg.com/vi/QLCpqdqeoII/hqdefault.jpg',
      youtubeId: 'QLCpqdqeoII',
      youtubeUrl: 'https://www.youtube.com/watch?v=QLCpqdqeoII',
      genre: 'Contemporary R&B',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
    {
      id: 'rec-pop-3',
      title: 'Get Lucky',
      artist: 'Daft Punk ft. Pharrell Williams',
      album: 'Random Access Memories',
      duration: 248,
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
      youtubeId: '5NV6Rdv1a3I',
      youtubeUrl: 'https://www.youtube.com/watch?v=5NV6Rdv1a3I',
      genre: 'Disco Funk',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
    {
      id: 'rec-pop-4',
      title: 'Levitating',
      artist: 'Dua Lipa',
      album: 'Future Nostalgia',
      duration: 203,
      coverUrl: 'https://i.ytimg.com/vi/TUVcZfQe-Kw/hqdefault.jpg',
      youtubeId: 'TUVcZfQe-Kw',
      youtubeUrl: 'https://www.youtube.com/watch?v=TUVcZfQe-Kw',
      genre: 'Nu-Disco / Pop',
      bitrate: 'Lossless Stereo',
      format: 'stream',
      isConverted: true,
    },
  ],
};

/**
 * Returns genre-matched recommendations for the current track
 */
export function getRecommendedTracksForTrack(track: Track | null): GenreRecommendationGroup {
  if (!track) {
    return {
      genre: 'Alternative Rock',
      description: 'Stadium anthems and dynamic percussion matching Believer.',
      tracks: GENRE_TRACK_ARCHIVE['alternative rock'],
    };
  }

  const title = (track.title || '').toLowerCase();
  const artist = (track.artist || '').toLowerCase();

  // If Imagine Dragons or Rock anthems
  if (
    artist.includes('imagine dragons') ||
    title.includes('believer') ||
    title.includes('radioactive') ||
    title.includes('demons') ||
    title.includes('natural')
  ) {
    return {
      genre: 'Alternative Rock',
      description: 'Stadium percussion, anthemic vocal hooks, and driving guitars matching Imagine Dragons.',
      tracks: GENRE_TRACK_ARCHIVE['alternative rock'],
    };
  }

  // If Synthwave or Cyberpunk
  if (
    artist.includes('sonic synth') ||
    artist.includes('kavinsky') ||
    title.includes('midnight') ||
    title.includes('drive') ||
    title.includes('nightcall')
  ) {
    return {
      genre: 'Synthwave & Retrowave',
      description: 'Analog synthesizers, neon nightscapes, and gated reverbs in pristine lossless audio.',
      tracks: GENRE_TRACK_ARCHIVE['synthwave'],
    };
  }

  // If Acoustic or Indie
  if (
    artist.includes('lumina') ||
    title.includes('lost in you') ||
    title.includes('better days') ||
    title.includes('acoustic')
  ) {
    return {
      genre: 'Indie Folk & Acoustic Ambient',
      description: 'Organic acoustic strings, intimate vocal dynamics, and warm wooden acoustics.',
      tracks: GENRE_TRACK_ARCHIVE['indie acoustic'],
    };
  }

  // If The Weeknd or R&B / Pop
  if (
    artist.includes('weeknd') ||
    artist.includes('daft punk') ||
    artist.includes('dua lipa') ||
    title.includes('blinding') ||
    title.includes('starboy')
  ) {
    return {
      genre: 'Contemporary R&B & Synth-Pop',
      description: 'Infectious dance grooves, modern synthesizers, and world-class vocal performances.',
      tracks: GENRE_TRACK_ARCHIVE['r&b pop'],
    };
  }

  // Fallback: Alternative Rock or dynamic mix
  return {
    genre: `${track.artist} Soundwave`,
    description: `Curated high-fidelity audio tracks sharing harmonic frequency profile with "${track.title}".`,
    tracks: GENRE_TRACK_ARCHIVE['alternative rock'],
  };
}
