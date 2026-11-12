import { NextRequest, NextResponse } from 'next/server';
import { Track } from '@/lib/types';
import { GENRE_TRACK_ARCHIVE } from '@/lib/recommendations';

function parseDurationToSeconds(durationStr?: string): number {
  if (!durationStr) return 210;
  const parts = durationStr.split(':').map((p) => parseInt(p, 10));
  if (parts.some((p) => isNaN(p))) return 210;
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 210;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId') || '';
  const title = searchParams.get('title') || '';
  const artist = searchParams.get('artist') || '';
  const genre = searchParams.get('genre') || '';

  const results: Track[] = [];

  // Helper to test if a video is a song (not a short, interview, trailer, review)
  const isActualSong = (t: string, durSec: number) => {
    const lower = t.toLowerCase();
    if (durSec < 65) return false; // shorts / clips
    if (lower.includes('#shorts') || lower.includes('#short') || lower.includes('shorts')) return false;
    if (
      lower.includes('teaser') ||
      lower.includes('trailer') ||
      lower.includes('reaction') ||
      lower.includes('interview') ||
      lower.includes('behind the scenes') ||
      lower.includes('review') ||
      lower.includes('gameplay') ||
      lower.includes('episode')
    ) {
      return false;
    }
    return true;
  };

  // 1. Try to fetch YouTube Watch page related videos for this videoId
  if (videoId && videoId.length > 5 && !videoId.startsWith('local-')) {
    try {
      const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const res = await fetch(watchUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const html = await res.text();
        const jsonMatch =
          html.match(/var ytInitialData = ({[\s\S]*?});<\/script>/) ||
          html.match(/ytInitialData\s*=\s*({[\s\S]+?});<\/script>/);

        if (jsonMatch && jsonMatch[1]) {
          const data = JSON.parse(jsonMatch[1]);
          const sec =
            data.contents?.twoColumnWatchNextResults?.secondaryResults?.secondaryResults?.results;
          const contents = sec?.[0]?.itemSectionRenderer?.contents;

          if (Array.isArray(contents)) {
            for (const item of contents) {
              if (results.length >= 8) break;

              let vid = '';
              let vTitle = '';
              let vAuthor = artist || 'Sonic Artist';
              let durationSec = 210;

              // Modern YouTube lockupViewModel schema
              if (item.lockupViewModel) {
                vid = item.lockupViewModel.contentId;
                vTitle = item.lockupViewModel.metadata?.lockupMetadataViewModel?.title?.content || '';
                vAuthor =
                  item.lockupViewModel.metadata?.lockupMetadataViewModel?.metadata
                    ?.contentMetadataViewModel?.metadataRows?.[0]?.metadataParts?.[0]?.text
                    ?.content || artist;
              } else if (item.compactVideoRenderer) {
                const cv = item.compactVideoRenderer;
                vid = cv.videoId;
                vTitle = cv.title?.simpleText || cv.title?.runs?.[0]?.text || '';
                vAuthor = cv.shortBylineText?.runs?.[0]?.text || artist;
                durationSec = parseDurationToSeconds(cv.lengthText?.simpleText);
              }

              if (
                vid &&
                !vid.startsWith('PL') &&
                vid !== videoId &&
                vTitle &&
                isActualSong(vTitle, durationSec) &&
                !results.some((r) => r.youtubeId === vid)
              ) {
                results.push({
                  id: `yt-rec-${vid}`,
                  title: vTitle.replace(/&amp;/g, '&'),
                  artist: vAuthor,
                  album: 'Sonic Recommendations',
                  duration: durationSec,
                  coverUrl: `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
                  youtubeId: vid,
                  youtubeUrl: `https://www.youtube.com/watch?v=${vid}`,
                  genre: genre || 'Recommended Master',
                  bitrate: 'Lossless Stereo',
                  format: 'stream',
                  isConverted: true,
                });
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn('Watch page recommendation fetch failed', err);
    }
  }

  // 2. If results < 4, search YouTube for artist/genre songs
  if (results.length < 4) {
    try {
      const searchQuery = artist
        ? `${artist} songs official audio`
        : `${title} song similar`;
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
      const sRes = await fetch(searchUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        next: { revalidate: 3600 },
      });

      if (sRes.ok) {
        const html = await sRes.text();
        const match = html.match(/var ytInitialData = ({.*?});<\/script>/);
        if (match && match[1]) {
          const json = JSON.parse(match[1]);
          const contents =
            json.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer
              ?.contents?.[0]?.itemSectionRenderer?.contents;

          if (Array.isArray(contents)) {
            for (const item of contents) {
              if (results.length >= 8) break;
              if (item.videoRenderer) {
                const vr = item.videoRenderer;
                const vid = vr.videoId;
                const vTitle = vr.title?.runs?.[0]?.text || '';
                const vAuthor = vr.ownerText?.runs?.[0]?.text || artist;
                const durStr = vr.lengthText?.simpleText || '3:30';
                const durSec = parseDurationToSeconds(durStr);

                if (
                  vid &&
                  !vid.startsWith('PL') &&
                  vid !== videoId &&
                  vTitle &&
                  isActualSong(vTitle, durSec) &&
                  !results.some((r) => r.youtubeId === vid)
                ) {
                  results.push({
                    id: `yt-rec-${vid}`,
                    title: vTitle.replace(/&amp;/g, '&'),
                    artist: vAuthor,
                    album: 'Sonic Recommendations',
                    duration: durSec,
                    coverUrl: `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
                    youtubeId: vid,
                    youtubeUrl: `https://www.youtube.com/watch?v=${vid}`,
                    genre: genre || 'Recommended Master',
                    bitrate: 'Lossless Stereo',
                    format: 'stream',
                    isConverted: true,
                  });
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn('Search fallback for recommendations failed', err);
    }
  }

  // 3. Fallback to curated archives if still empty
  if (results.length === 0) {
    const altTracks = GENRE_TRACK_ARCHIVE['alternative rock'] || [];
    results.push(...altTracks);
  }

  return NextResponse.json({
    genre: genre || (artist ? `${artist} Radio` : 'Similar Vibe'),
    description: `Real-time studio recommendations curated directly from the sonic frequency of "${title || 'current track'}".`,
    tracks: results,
  });
}
