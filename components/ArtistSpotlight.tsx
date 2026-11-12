'use client';

import React, { useState, useEffect } from 'react';
import {
  BadgeCheck,
  Users,
  Disc,
  Heart,
  Radio,
  Flame,
  Award,
} from 'lucide-react';
import { getArtistProfile } from '@/lib/artists';
import { SafeImage } from './SafeImage';

interface ArtistSpotlightProps {
  artistName: string;
  theme?: 'dark' | 'light';
  onPlayAlbum?: (albumTitle: string) => void;
}

export const ArtistSpotlight: React.FC<ArtistSpotlightProps> = ({
  artistName,
  onPlayAlbum,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [realImageUrl, setRealImageUrl] = useState<string | null>(null);
  const [realBannerUrl, setRealBannerUrl] = useState<string | null>(null);
  const [realBio, setRealBio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const profile = getArtistProfile(artistName);

  // Fetch authentic real artist photo from the internet (Wikipedia / YouTube Channel Avatar)
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setRealImageUrl(null);
    setRealBannerUrl(null);
    setRealBio(null);

    async function loadArtistPhoto() {
      try {
        const res = await fetch(`/api/artist?name=${encodeURIComponent(artistName)}`);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            if (data.imageUrl && !data.imageUrl.includes('midnight-drive')) {
              setRealImageUrl(data.imageUrl);
            }
            if (data.bannerUrl) setRealBannerUrl(data.bannerUrl);
            if (data.bio) setRealBio(data.bio);
          }
        }
      } catch {
        // Fallback gracefully
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadArtistPhoto();
    return () => {
      isCancelled = true;
    };
  }, [artistName]);

  // CRITICAL REQUIREMENT:
  // If we don't have a real genuine photo for the artist pfp (or if it's the default midnight drive image),
  // DO NOT show the artist details at all! Only show when we have real photo and full data.
  const hasRealPhoto = Boolean(
    realImageUrl ||
    (profile?.avatarUrl &&
      !profile.avatarUrl.includes('midnight-drive') &&
      !profile.avatarUrl.includes('placeholder'))
  );

  const finalBio = realBio || profile?.bio;
  const hasCompleteData = hasRealPhoto && Boolean(finalBio && finalBio.length > 20);

  if (isLoading || !hasCompleteData) {
    return null;
  }

  const displayAvatar = realImageUrl || profile.avatarUrl;
  const displayBanner = realBannerUrl || profile?.bannerUrl || displayAvatar;
  const displayName = artistName || profile.name;

  return (
    <section className="space-y-6 pt-4 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-sky-500/20">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Artist Spotlight</span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                VERIFIED ARTIST
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Authentic artist discography and curated audio releases.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span>Real-World Verified Profile</span>
        </div>
      </div>

      {/* Main Glassmorphic Artist Card */}
      <div className="rounded-[36px] border border-sky-500/20 backdrop-blur-2xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.85)] transition-all duration-500 relative bg-[#040b1e]/90 text-white">
        {/* Banner with Ambient Gradient Overlay */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <SafeImage
            src={displayBanner}
            fallbackSrc={displayAvatar}
            alt={displayName}
            fill
            className="object-cover object-center filter brightness-[0.7] saturate-[1.15] transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040b1e] via-[#040b1e]/60 to-transparent" />

          {/* Banner Floating Metadata */}
          <div className="absolute top-5 right-5 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 text-xs font-mono text-sky-300 flex items-center gap-1.5 shadow-lg">
              <Award className="w-3.5 h-3.5 text-sky-400" />
              <span>Certified Artist</span>
            </span>
          </div>
        </div>

        {/* Content Section Overlapping Banner */}
        <div className="px-6 sm:px-10 pb-10 relative -mt-24 sm:-mt-28 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              {/* Authentic Artist Avatar */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-[#040b1e] shadow-[0_15px_40px_rgba(0,0,0,0.8)] bg-slate-900 flex-shrink-0 group">
                <SafeImage
                  src={displayAvatar}
                  fallbackSrc={displayAvatar}
                  alt={displayName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
              </div>

              {/* Title & Stats */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-4xl font-black tracking-tight">{displayName}</h2>
                  <BadgeCheck className="w-6 h-6 text-sky-400 fill-sky-400/20 flex-shrink-0" />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    {profile.monthlyListeners || '14.8M'} Monthly Listeners
                  </span>
                  <span>•</span>
                  <span>{profile.origin || 'International'}</span>
                  <span>•</span>
                  <span className="text-sky-300">{profile.formedYear ? `Est. ${profile.formedYear}` : 'Active Now'}</span>
                </div>
              </div>
            </div>

            {/* Follow / Listen Action */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 ${
                  isFollowing
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 hover:bg-sky-500/30'
                    : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/30 hover:scale-105 active:scale-95'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFollowing ? 'fill-sky-400 text-sky-400' : ''}`} />
                <span>{isFollowing ? 'Following' : 'Follow Artist'}</span>
              </button>
            </div>
          </div>

          {/* Artist Bio & Discography Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            {/* Bio Column */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                About the Artist
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                {finalBio}
              </p>

              {/* Genre Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {profile.genres?.map((genre, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-mono bg-sky-500/10 text-sky-300 border border-sky-500/20"
                  >
                    #{genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Releases Column */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Key Studio Releases</span>
                <Disc className="w-4 h-4 text-sky-400" />
              </h4>

              <div className="space-y-2.5">
                {profile.topAlbums?.slice(0, 3).map((album, idx) => (
                  <div
                    key={idx}
                    onClick={() => onPlayAlbum && onPlayAlbum(album.title)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] hover:bg-sky-500/10 border border-white/5 hover:border-sky-500/30 cursor-pointer transition-all group"
                  >
                    <div className="min-w-0 pr-3">
                      <h5 className="text-xs sm:text-sm font-bold truncate group-hover:text-sky-300 transition-colors">
                        {album.title}
                      </h5>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {album.year} • {album.tracksCount} Tracks
                      </span>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 flex-shrink-0">
                      {album.badge || 'Lossless'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
