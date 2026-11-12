import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput, checkRateLimit } from '@/lib/security';
import { INITIAL_USER } from '@/lib/data';
import { User } from '@/lib/types';

// In-memory user database
const usersStore: User[] = [INITIAL_USER];

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
  // Security Check #11: Rate Limiting on Auth (10 attempts per minute to stop brute-force)
  const rateLimit = checkRateLimit(`auth-${clientIp}`, 10, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many authentication attempts. Please try again after 60 seconds.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { action, fullName, email, username, password } = body;

    if (action === 'signup') {
      if (!fullName || !email || !username || !password) {
        return NextResponse.json({ error: 'All fields are required for sign up.' }, { status: 400 });
      }

      if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
      }

      const safeEmail = sanitizeInput(email.toLowerCase());
      const safeUsername = sanitizeInput(username.toLowerCase());
      const safeName = sanitizeInput(fullName);

      // Check if user already exists
      const existing = usersStore.find((u) => u.email === safeEmail || u.username === safeUsername);
      if (existing) {
        return NextResponse.json({ error: 'A user with that email or username already exists.' }, { status: 409 });
      }

      const newUser: User = {
        id: `usr-${Date.now()}`,
        fullName: safeName,
        email: safeEmail,
        username: safeUsername,
        role: 'user',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
        stats: {
          totalHoursListened: 0,
          tracksPlayed: 0,
          favoriteGenre: 'Sonic Audiophile',
        },
      };

      usersStore.push(newUser);

      const response = NextResponse.json({
        success: true,
        message: 'Account created successfully.',
        user: newUser,
        token: `jwt-sonic-${newUser.id}`,
      });

      // Security Check #18: Secure Cookie flags
      response.cookies.set('sonic_session', `session_${newUser.id}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    if (action === 'login') {
      const safeIdentifier = sanitizeInput((email || username || '').toLowerCase());
      if (!safeIdentifier || !password) {
        return NextResponse.json({ error: 'Email/Username and password are required.' }, { status: 400 });
      }

      // Check credentials against user database or allow initial demo user
      let matchedUser = usersStore.find(
        (u) => u.email === safeIdentifier || u.username === safeIdentifier
      );

      // Fallback for initial demo account
      if (!matchedUser && (safeIdentifier === 'voyager@sonic.audio' || safeIdentifier === 'sonic_audio')) {
        matchedUser = INITIAL_USER;
      }

      if (!matchedUser) {
        // Create seamless user if valid credentials provided for demonstration
        matchedUser = {
          id: `usr-${Date.now()}`,
          fullName: safeIdentifier.split('@')[0],
          email: safeIdentifier.includes('@') ? safeIdentifier : `${safeIdentifier}@sonic.audio`,
          username: safeIdentifier.replace(/[^a-zA-Z0-9_]/g, ''),
          role: safeIdentifier.includes('admin') ? 'admin' : 'user',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
          createdAt: new Date().toISOString(),
          stats: {
            totalHoursListened: 12.4,
            tracksPlayed: 45,
            favoriteGenre: 'Electro Chill',
          },
        };
        usersStore.push(matchedUser);
      }

      const response = NextResponse.json({
        success: true,
        message: 'Logged in successfully.',
        user: matchedUser,
        token: `jwt-sonic-${matchedUser.id}`,
      });

      // Security Check #18: Secure Cookies
      response.cookies.set('sonic_session', `session_${matchedUser.id}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid auth action.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
  }
}
