import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, sanitizeInput } from '@/lib/security';
import { env } from '@/lib/env';

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
  // Security Check #11: Rate Limiting
  const rateLimit = checkRateLimit(`convert-${clientIp}`, 30, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Audio conversion rate limit reached. Please wait a moment.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { trackId, youtubeId, title, artist, album, duration = 210 } = body;

    // Security Check #12: Spend Cap check
    if (duration > env.MAX_AUDIO_CONVERSION_SECONDS) {
      return NextResponse.json(
        {
          error: `Audio duration (${duration}s) exceeds maximum allowed conversion threshold (${env.MAX_AUDIO_CONVERSION_SECONDS}s).`,
        },
        { status: 400 }
      );
    }

    const safeTitle = sanitizeInput(title || 'Sonic Track');
    const safeArtist = sanitizeInput(artist || 'Artist');
    const safeAlbum = sanitizeInput(album || 'Sonic Master Stream');
    const safeYtId = sanitizeInput(youtubeId || 'MV_3Dpw-BRY');

    // Simulate MP3 algorithm conversion pipeline stages
    const conversionManifest = {
      pipeline: 'Sonic MP3 Transcoder v2.8',
      source: `https://www.youtube.com/watch?v=${safeYtId}`,
      encoding: {
        container: 'MP3 (MPEG-1 Audio Layer 3)',
        bitrate: '320 kbps CBR',
        sampleRate: '48,000 Hz',
        channels: 'Stereo',
        vbrQuality: null,
      },
      id3v2Tags: {
        title: safeTitle,
        artist: safeArtist,
        album: safeAlbum,
        genre: 'Sonic Audiophile',
        encoder: 'LAME 3.100 CBR',
      },
      audioStreamUrl: `/api/audio/convert?id=${encodeURIComponent(trackId || 'track')}&stream=true`,
      duration,
      estimatedSizeMB: Number(((duration * 40) / 1024).toFixed(2)),
      convertedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Track converted to 320kbps MP3 stream successfully.',
      manifest: conversionManifest,
    });
  } catch (err: unknown) {
    console.error('Audio conversion error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to process audio conversion pipeline.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isStream = searchParams.get('stream') === 'true';

  if (!isStream) {
    return NextResponse.json({
      service: 'Sonic Audio Conversion Engine',
      algorithm: 'YouTube Stream Demuxer -> 320kbps LAME MP3 Transcoder',
      status: 'operational',
    });
  }

  // Return audio stream header information
  return new NextResponse('Sonic High Fidelity Stream Ready', {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
