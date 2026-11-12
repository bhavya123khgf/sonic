import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput, verifyOwnership, checkRateLimit } from '@/lib/security';
import { INITIAL_PLAYLISTS } from '@/lib/data';
import { Playlist } from '@/lib/types';

// In-memory persistent playlist store for demonstration
let playlistsStore: Playlist[] = [...INITIAL_PLAYLISTS];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (userId) {
    const userPlaylists = playlistsStore.filter((p) => p.userId === userId || p.isPublic);
    return NextResponse.json({ playlists: userPlaylists });
  }

  return NextResponse.json({ playlists: playlistsStore });
}

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimit = checkRateLimit(`playlist-${clientIp}`, 40, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { userId, name, description, tracks = [], coverUrl } = body;

    if (!userId || !name) {
      return NextResponse.json({ error: 'User ID and playlist name are required.' }, { status: 400 });
    }

    const safeName = sanitizeInput(name);
    const safeDesc = sanitizeInput(description || '');

    const newPlaylist: Playlist = {
      id: `pl-${Date.now()}`,
      userId,
      name: safeName,
      description: safeDesc,
      coverUrl: coverUrl || '/album-midnight-drive.jpg',
      tracks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    playlistsStore.unshift(newPlaylist);
    return NextResponse.json({ success: true, playlist: newPlaylist }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create playlist.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { playlistId, currentUserId, name, description, tracks } = body;

    const existingIndex = playlistsStore.findIndex((p) => p.id === playlistId);
    if (existingIndex === -1) {
      return NextResponse.json({ error: 'Playlist not found.' }, { status: 404 });
    }

    const targetPlaylist = playlistsStore[existingIndex];

    // Security Check #6: IDOR / BOLA Authorization Verification
    if (!verifyOwnership(targetPlaylist.userId, currentUserId)) {
      return NextResponse.json(
        {
          error: 'Forbidden: IDOR protection violation. You do not have permission to modify this playlist.',
          code: 'AUTH_FORBIDDEN_BOLA',
        },
        { status: 403 }
      );
    }

    const updated: Playlist = {
      ...targetPlaylist,
      name: name ? sanitizeInput(name) : targetPlaylist.name,
      description: description !== undefined ? sanitizeInput(description) : targetPlaylist.description,
      tracks: tracks !== undefined ? tracks : targetPlaylist.tracks,
      updatedAt: new Date().toISOString(),
    };

    playlistsStore[existingIndex] = updated;
    return NextResponse.json({ success: true, playlist: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update playlist.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playlistId = searchParams.get('id');
    const currentUserId = searchParams.get('userId');

    if (!playlistId || !currentUserId) {
      return NextResponse.json({ error: 'Missing playlistId or currentUserId.' }, { status: 400 });
    }

    const targetPlaylist = playlistsStore.find((p) => p.id === playlistId);
    if (!targetPlaylist) {
      return NextResponse.json({ error: 'Playlist not found.' }, { status: 404 });
    }

    // Security Check #6: IDOR / BOLA Authorization Check
    if (!verifyOwnership(targetPlaylist.userId, currentUserId)) {
      return NextResponse.json(
        { error: 'Forbidden: You cannot delete another user’s playlist.' },
        { status: 403 }
      );
    }

    playlistsStore = playlistsStore.filter((p) => p.id !== playlistId);
    return NextResponse.json({ success: true, message: 'Playlist deleted.' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete playlist.' }, { status: 500 });
  }
}
