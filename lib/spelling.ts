import { SearchSuggestion } from './types';

// Curated song database for spelling suggestion & autocorrect
export const POPULAR_SONG_CATALOG = [
  { title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", youtubeId: "4NRXx6U8ABQ", duration: 200, coverUrl: "https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg" },
  { title: "Starboy", artist: "The Weeknd ft. Daft Punk", album: "Starboy", youtubeId: "34Na4j8AVgA", duration: 230, coverUrl: "https://i.ytimg.com/vi/34Na4j8AVgA/hqdefault.jpg" },
  { title: "Save Your Tears", artist: "The Weeknd", album: "After Hours", youtubeId: "XXYlFuWEuKI", duration: 215, coverUrl: "https://i.ytimg.com/vi/XXYlFuWEuKI/hqdefault.jpg" },
  { title: "Midnight Drive", artist: "Sonic Synth", album: "Midnight Drive", youtubeId: "dQw4w9WgXcQ", duration: 210, coverUrl: "/album-midnight-drive.jpg" },
  { title: "Lost in You", artist: "Lumina", album: "Lost in You", youtubeId: "7NOSDKb0HlU", duration: 245, coverUrl: "/album-lost-in-you.jpg" },
  { title: "Better Days", artist: "Lumina Echo", album: "Better Days", youtubeId: "kXYiU_JCYtU", duration: 220, coverUrl: "/album-better-days.jpg" },
  { title: "Shape of You", artist: "Ed Sheeran", album: "÷ (Divide)", youtubeId: "JGwWNGJdvx8", duration: 233, coverUrl: "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg" },
  { title: "Hotel California", artist: "Eagles", album: "Hotel California", youtubeId: "09839DpTctU", duration: 390, coverUrl: "https://i.ytimg.com/vi/09839DpTctU/hqdefault.jpg" },
  { title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", youtubeId: "fJ9rUzIMcZQ", duration: 355, coverUrl: "https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg" },
  { title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", youtubeId: "TUVcZfQe-Kw", duration: 203, coverUrl: "https://i.ytimg.com/vi/TUVcZfQe-Kw/hqdefault.jpg" },
  { title: "Stay", artist: "The Kid LAROI & Justin Bieber", album: "F*CK LOVE 3", youtubeId: "kTJczUoc26U", duration: 141, coverUrl: "https://i.ytimg.com/vi/kTJczUoc26U/hqdefault.jpg" },
  { title: "As It Was", artist: "Harry Styles", album: "Harry's House", youtubeId: "H5v3kku4y6Q", duration: 167, coverUrl: "https://i.ytimg.com/vi/H5v3kku4y6Q/hqdefault.jpg" },
  { title: "Bad Guy", artist: "Billie Eilish", album: "When We All Fall Asleep", youtubeId: "DyDfgMOUjCI", duration: 194, coverUrl: "https://i.ytimg.com/vi/DyDfgMOUjCI/hqdefault.jpg" },
  { title: "Flowers", artist: "Miley Cyrus", album: "Endless Summer Vacation", youtubeId: "G7KNmW9a75Y", duration: 200, coverUrl: "https://i.ytimg.com/vi/G7KNmW9a75Y/hqdefault.jpg" },
  { title: "Cruel Summer", artist: "Taylor Swift", album: "Lover", youtubeId: "ic8j13piAhQ", duration: 178, coverUrl: "https://i.ytimg.com/vi/ic8j13piAhQ/hqdefault.jpg" },
  { title: "Sunflower", artist: "Post Malone & Swae Lee", album: "Spider-Man: Into the Spider-Verse", youtubeId: "ApXoWvfEYVU", duration: 158, coverUrl: "https://i.ytimg.com/vi/ApXoWvfEYVU/hqdefault.jpg" },
  { title: "Believer", artist: "Imagine Dragons", album: "Evolve", youtubeId: "7wtfhZwyrcc", duration: 204, coverUrl: "https://i.ytimg.com/vi/7wtfhZwyrcc/hqdefault.jpg" },
  { title: "Nightcall", artist: "Kavinsky", album: "OutRun", youtubeId: "MV_3Dpw-BRY", duration: 259, coverUrl: "https://i.ytimg.com/vi/MV_3Dpw-BRY/hqdefault.jpg" },
  { title: "Get Lucky", artist: "Daft Punk ft. Pharrell Williams", album: "Random Access Memories", youtubeId: "5NV6Rdv1a3I", duration: 248, coverUrl: "https://i.ytimg.com/vi/5NV6Rdv1a3I/hqdefault.jpg" },
  { title: "Die For You", artist: "The Weeknd", album: "Starboy", youtubeId: "QLCpqdqeoII", duration: 260, coverUrl: "https://i.ytimg.com/vi/QLCpqdqeoII/hqdefault.jpg" },
  { title: "Sweater Weather", artist: "The Neighbourhood", album: "I Love You.", youtubeId: "GCdwKhTtNNw", duration: 240, coverUrl: "https://i.ytimg.com/vi/GCdwKhTtNNw/hqdefault.jpg" },
  { title: "Starlight Echoes", artist: "Sonic Wave", album: "Starlight Echoes", youtubeId: "2Vv-BfVoq4g", duration: 195, coverUrl: "/album-midnight-drive.jpg" },
  { title: "Cybernetic Heartbeat", artist: "Hyperion", album: "Neon Horizon", youtubeId: "fKopy74weus", duration: 215, coverUrl: "/album-better-days.jpg" },
];

/**
 * Standard Levenshtein Distance calculation
 */
export function getLevenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix = Array.from({ length: bn + 1 }, () => new Array(an + 1).fill(0));

  for (let i = 0; i <= an; i++) matrix[0][i] = i;
  for (let j = 0; j <= bn; j++) matrix[j][0] = j;

  for (let j = 1; j <= bn; j++) {
    for (let i = 1; i <= an; i++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1, // deletion
          matrix[j][i - 1] + 1, // insertion
          matrix[j - 1][i - 1] + 1 // substitution
        );
      }
    }
  }

  return matrix[bn][an];
}

/**
 * N-gram (Bigram) dice similarity coefficient
 */
export function getBigramSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().replace(/\s+/g, '');
  const s2 = str2.toLowerCase().replace(/\s+/g, '');
  if (s1 === s2) return 1;
  if (s1.length < 2 || s2.length < 2) return 0;

  const getBigrams = (str: string) => {
    const bigrams = new Map<string, number>();
    for (let i = 0; i < str.length - 1; i++) {
      const bg = str.slice(i, i + 2);
      bigrams.set(bg, (bigrams.get(bg) || 0) + 1);
    }
    return bigrams;
  };

  const bg1 = getBigrams(s1);
  const bg2 = getBigrams(s2);

  let intersection = 0;
  for (const [key, count1] of bg1.entries()) {
    const count2 = bg2.get(key) || 0;
    intersection += Math.min(count1, count2);
  }

  return (2 * intersection) / (s1.length - 1 + s2.length - 1);
}

/**
 * Intelligent Song Spelling Correction
 * Detects typos and proposes "Did you mean: [Song Title] by [Artist]?"
 */
export function checkSpellingSuggestion(query: string): SearchSuggestion | null {
  const clean = query.trim().toLowerCase();
  if (clean.length < 3) return null;

  let bestMatch: { title: string; artist: string; score: number } | null = null;
  let highestScore = 0;

  for (const song of POPULAR_SONG_CATALOG) {
    const titleLower = song.title.toLowerCase();
    const artistLower = song.artist.toLowerCase();
    const fullCombined = `${titleLower} ${artistLower}`;

    // Exact or partial containment doesn't need suggestion
    if (titleLower.includes(clean) || artistLower.includes(clean)) {
      continue;
    }

    // Measure similarity against title
    const titleBigram = getBigramSimilarity(clean, titleLower);
    const combinedBigram = getBigramSimilarity(clean, fullCombined);
    const score = Math.max(titleBigram, combinedBigram);

    // Also check edit distance for small typos
    const maxLen = Math.max(clean.length, titleLower.length);
    const dist = getLevenshteinDistance(clean, titleLower);
    const normalizedEditDist = 1 - dist / maxLen;

    const blendedScore = score * 0.6 + normalizedEditDist * 0.4;

    if (blendedScore > 0.48 && blendedScore > highestScore) {
      highestScore = blendedScore;
      bestMatch = {
        title: song.title,
        artist: song.artist,
        score: blendedScore,
      };
    }
  }

  if (bestMatch && highestScore > 0.5) {
    return {
      original: query,
      corrected: bestMatch.title,
      artist: bestMatch.artist,
      confidence: Math.round(highestScore * 100) / 100,
      matchedSong: `${bestMatch.title} - ${bestMatch.artist}`,
    };
  }

  return null;
}
