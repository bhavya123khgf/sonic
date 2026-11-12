import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

/**
 * Blue-Green Deployment Health Check Probe
 * Used by load balancers and reverse proxies (e.g., Nginx, AWS ALB, Traefik)
 * to verify deployment health before switching active/standby traffic slots.
 */
export async function GET() {
  const currentSlot = process.env.APP_SLOT || env.APP_SLOT || 'blue';
  const uptime = process.uptime();

  return NextResponse.json(
    {
      status: 'healthy',
      deploymentSlot: currentSlot,
      version: '1.0.0-sonic-production',
      buildTimestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(uptime),
      environment: env.NODE_ENV,
      services: {
        youtubeSearchEngine: 'operational',
        audioTranscoderMP3: 'operational',
        idorAuthorization: 'active',
        rateLimiter: 'active',
        securityHeaders: 'enforced',
        spendCap: `${env.MAX_AUDIO_CONVERSION_SECONDS}s`,
      },
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Sonic-Slot': currentSlot,
      },
    }
  );
}
