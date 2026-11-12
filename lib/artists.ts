import { ArtistProfile } from './types';

export const ARTIST_PROFILES: Record<string, ArtistProfile> = {
  'imagine dragons': {
    name: 'Imagine Dragons',
    verified: true,
    monthlyListeners: '62,840,920',
    ranking: '#18 in the world',
    origin: 'Las Vegas, Nevada, USA',
    formedYear: '2008',
    genres: ['Alternative Rock', 'Arena Rock', 'Indie Pop', 'Electropop'],
    bannerUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1600&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    bio: [
      'Imagine Dragons is an American pop rock band formed in Las Vegas, consisting of lead singer Dan Reynolds, guitarist Wayne Sermon, bassist Ben McKee, and drummer Daniel Platzman.',
      'Known for their explosive, percussion-driven stadium anthems and genre-bending sound that weaves raw alternative rock with cinematic electronic production, the band achieved global superstardom with multi-diamond singles like "Believer", "Radioactive", and "Demons".',
      'Their sonic signature relies on colossal sub-bass lines, resonant acoustic percussion, and soaring vocal hooks engineered with ultra-wide stereo master separation.',
    ],
    quote: 'Music has the power to heal the broken parts of the mind when nothing else can. We write every song from the heart of raw emotion.',
    topAlbums: [
      {
        title: 'Evolve',
        year: '2017',
        coverUrl: 'https://i.ytimg.com/vi/7wtfhZwyrcc/hqdefault.jpg',
        tracksCount: 11,
        badge: 'Studio Master Lossless',
      },
      {
        title: 'Night Visions',
        year: '2012',
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
        tracksCount: 14,
        badge: 'Diamond Certified',
      },
      {
        title: 'Mercury - Acts 1 & 2',
        year: '2022',
        coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
        tracksCount: 32,
        badge: 'Hi-Res Lossless',
      },
      {
        title: 'Smoke + Mirrors',
        year: '2015',
        coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
        tracksCount: 13,
        badge: 'Platinum Master',
      },
    ],
    studioGear: [
      'Neve 8078 Console',
      'Telefunken U47 Tube Mic',
      'Ludwig Classic Oak Drum Rig',
      'Moog Sub 37 Bass Synthesizer',
    ],
    followersCount: '48.9M Followers',
  },

  'the weeknd': {
    name: 'The Weeknd',
    verified: true,
    monthlyListeners: '108,350,110',
    ranking: '#1 in the world',
    origin: 'Toronto, Ontario, Canada',
    formedYear: '2010',
    genres: ['R&B', 'Synth-Pop', 'New Wave', 'Alternative Pop'],
    bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    bio: [
      'Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer, songwriter, and record producer known for his cinematic lyricism and high-pitched vocal falsetto.',
      'He pioneered a dark, atmospheric style of contemporary R&B before dominating worldwide pop charts with 80s-inspired synthwave masterworks such as "Blinding Lights", "Starboy", and "Save Your Tears".',
      'His studio productions are acclaimed for lush analog synthesis, gated reverb percussion, and pristine spatial audio mastering.',
    ],
    quote: 'I like to create characters and worlds. Every album is an entire era, a movie that plays through your headphones.',
    topAlbums: [
      {
        title: 'After Hours',
        year: '2020',
        coverUrl: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg',
        tracksCount: 14,
        badge: 'All-Time Record Holder',
      },
      {
        title: 'Starboy',
        year: '2016',
        coverUrl: 'https://i.ytimg.com/vi/34Na4j8AVgA/hqdefault.jpg',
        tracksCount: 18,
        badge: 'Grammy Winner',
      },
      {
        title: 'Dawn FM',
        year: '2022',
        coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&auto=format&fit=crop&q=80',
        tracksCount: 16,
        badge: 'Dolby Atmos Master',
      },
    ],
    studioGear: [
      'Yamaha CS-80 Synthesizer',
      'Sony C-800G Vocal Mic',
      'Solid State Logic 9000J',
      'Roland Juno-106',
    ],
    followersCount: '78.4M Followers',
  },

  'sonic synth': {
    name: 'Sonic Synth',
    verified: true,
    monthlyListeners: '3,420,100',
    ranking: 'Top Audiophile Creator',
    origin: 'Reykjavik & Berlin',
    formedYear: '2021',
    genres: ['Synthwave', 'Cyberpunk', 'Retrowave', 'Electronic Ambient'],
    bannerUrl: '/album-midnight-drive.jpg',
    avatarUrl: '/album-midnight-drive.jpg',
    bio: [
      'Sonic Synth is an enigmatic electronic production collective engineering next-generation analog synthwave experiences.',
      'Merging vintage tape saturation with modern 48kHz spatial lossless mastering, their sonic landscapes evoke neon highways, midnight expressways, and cyberpunk architecture.',
    ],
    quote: 'Analog warmth is not nostalgia; it is the physical resonance of sound vibrating through the soul.',
    topAlbums: [
      {
        title: 'Midnight Drive (Original Master)',
        year: '2024',
        coverUrl: '/album-midnight-drive.jpg',
        tracksCount: 10,
        badge: 'Sonic Reference Master',
      },
      {
        title: 'Neon Skyline',
        year: '2023',
        coverUrl: '/album-better-days.jpg',
        tracksCount: 8,
        badge: 'Analog Tape Lossless',
      },
    ],
    studioGear: [
      'Sequential Prophet-6',
      'Moog Minimoog Model D',
      'Studer A820 2-Track Tape Machine',
      'Lexicon 480L Reverb',
    ],
    followersCount: '1.2M Followers',
  },

  'lumina': {
    name: 'Lumina Echo',
    verified: true,
    monthlyListeners: '4,890,200',
    ranking: 'Featured Acoustic Spotlight',
    origin: 'Stockholm, Sweden',
    formedYear: '2022',
    genres: ['Acoustic Folk', 'Cinematic Ambient', 'Dream Pop', 'Lo-Fi Chill'],
    bannerUrl: '/album-lost-in-you.jpg',
    avatarUrl: '/album-better-days.jpg',
    bio: [
      'Lumina and Lumina Echo weave organic acoustic guitar picking with ethereal vocal harmonies and serene sunset ambiances.',
      'Recorded in high-ceiling Scandinavian wooden chapels, each acoustic piece captures the natural reverberation of wood, air, and ocean breezes.',
    ],
    quote: 'We make music to bring quiet stillness to an overly loud world.',
    topAlbums: [
      {
        title: 'Lost in You',
        year: '2024',
        coverUrl: '/album-lost-in-you.jpg',
        tracksCount: 9,
        badge: 'Acoustic Studio Master',
      },
      {
        title: 'Better Days',
        year: '2024',
        coverUrl: '/album-better-days.jpg',
        tracksCount: 12,
        badge: 'Pure High-Fidelity',
      },
    ],
    studioGear: [
      'Martin D-28 Acoustic Guitar',
      'Neumann U87 Ai Microphone',
      'GML 8200 Parametric EQ',
      'Bricasti M7 Reverb',
    ],
    followersCount: '2.5M Followers',
  },
};

/**
 * Returns an artist profile or dynamically generates a high-end audiophile studio profile
 */
export function getArtistProfile(artistName: string): ArtistProfile {
  if (!artistName) {
    return ARTIST_PROFILES['imagine dragons'];
  }

  const clean = artistName.trim().toLowerCase();

  for (const [key, profile] of Object.entries(ARTIST_PROFILES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return profile;
    }
  }

  // Generative profile for newly searched artists
  return {
    name: artistName,
    verified: true,
    monthlyListeners: '14,890,400',
    ranking: 'Sonic Verified Artist',
    origin: 'International Studio Network',
    formedYear: '2016',
    genres: ['Contemporary', 'Studio Master', 'Alternative'],
    bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    bio: [
      `${artistName} is an acclaimed recording artist recognized for master-grade compositions and dynamic auditory performances.`,
      `Streamed globally across audiophile listening rooms, their catalog highlights high-dynamic-range production and pristine stereo imaging.`,
    ],
    quote: 'Sound is the closest thing we have to time travel. Every frequency captures an irreplaceable moment.',
    topAlbums: [
      {
        title: 'Sonic Master Studio Sessions',
        year: '2024',
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
        tracksCount: 12,
        badge: 'Lossless Master',
      },
      {
        title: 'Live Acoustic Recordings',
        year: '2022',
        coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
        tracksCount: 8,
        badge: 'Analog Calibrated',
      },
    ],
    studioGear: [
      'SSL 4000 G+ Console',
      'Telefunken ELA M 251E',
      'Pultec EQP-1A Tube EQ',
      'Genelec 8351B Studio Monitors',
    ],
    followersCount: '5.2M Followers',
  };
}
