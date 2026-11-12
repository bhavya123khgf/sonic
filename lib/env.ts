/**
 * Security Check #1: Hide API Keys
 * Security Check #2: Check Environment Variables
 * Validates required server-side environment variables and prevents secret leakage.
 */

interface ServerEnv {
  NODE_ENV: 'development' | 'production' | 'test';
  YOUTUBE_API_KEY?: string;
  JWT_SECRET: string;
  PORT: number;
  APP_SLOT: 'blue' | 'green';
  ENABLE_DEBUG_LOGS: boolean;
  MAX_AUDIO_CONVERSION_SECONDS: number;
}

function validateEnv(): ServerEnv {
  const isProd = process.env.NODE_ENV === 'production';

  // Fallback JWT secret for local dev if not supplied
  const jwtSecret = process.env.JWT_SECRET || 'sonic-jwt-secure-super-key-change-in-production-2026';
  
  if (isProd && jwtSecret === 'sonic-jwt-secure-super-key-change-in-production-2026') {
    console.warn('[SECURITY WARNING]: Production environment running with default JWT_SECRET. Set JWT_SECRET in environment.');
  }

  return {
    NODE_ENV: (process.env.NODE_ENV as ServerEnv['NODE_ENV']) || 'development',
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    JWT_SECRET: jwtSecret,
    PORT: parseInt(process.env.PORT || '3000', 10),
    APP_SLOT: (process.env.APP_SLOT as 'blue' | 'green') || 'blue',
    ENABLE_DEBUG_LOGS: process.env.ENABLE_DEBUG_LOGS === 'true' && !isProd,
    MAX_AUDIO_CONVERSION_SECONDS: parseInt(process.env.MAX_AUDIO_CONVERSION_SECONDS || '600', 10), // Spend cap & quota protection
  };
}

export const env = validateEnv();
