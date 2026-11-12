'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  User as UserIcon,
  Mail,
  AtSign,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Play,
  Volume2,
  Check,
  Sparkles,
  X,
  Headphones,
  Globe,
  Radio,
  Layers,
  CreditCard,
  Users,
  Compass,
  Disc3,
  Heart,
  Zap,
} from 'lucide-react';
import { User } from '@/lib/types';

interface AuthViewProps {
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
  onAuthenticated: (user: User) => void;
  onExploreGuest: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  theme,
  onThemeToggle,
  onAuthenticated,
  onExploreGuest,
}) => {
  // Sign Up form state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('voyager@sonic.audio');
  const [loginPassword, setLoginPassword] = useState('sonic2026');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Active tab on mobile/compact view: 'signup' | 'login'
  const [activeCard, setActiveCard] = useState<'both' | 'signup' | 'login'>('both');

  // Dedicated Info Modals: 'music' | 'explore' | 'moments' | 'pricing' | 'sonic' | 'people' | 'together' | null
  const [activeInfoModal, setActiveInfoModal] = useState<
    'music' | 'explore' | 'moments' | 'pricing' | 'sonic' | 'people' | 'together' | null
  >(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isDark = theme === 'dark';

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'SonicApp',
        },
        body: JSON.stringify({
          action: 'signup',
          fullName: signUpName,
          email: signUpEmail,
          username: signUpUsername,
          password: signUpPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Sign up failed');
      }

      onAuthenticated(data.user);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'SonicApp',
        },
        body: JSON.stringify({
          action: 'login',
          email: loginIdentifier,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      onAuthenticated(data.user);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden transition-colors duration-700 select-none ${
        isDark ? 'text-white' : 'text-zinc-900'
      }`}
    >
      {/* 3D Penthouse Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src={isDark ? '/sonic-dark-room.jpg' : '/sonic-light-room.jpg'}
          alt="Sonic 3D Luxury Penthouse Studio"
          fill
          priority
          className="object-cover object-center transition-all duration-1000 scale-[1.01]"
        />
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            isDark
              ? 'bg-gradient-to-t from-black/85 via-black/40 to-black/60'
              : 'bg-gradient-to-t from-white/70 via-white/20 to-white/40'
          }`}
        />
      </div>

      {/* Top Header Navigation */}
      <header className="relative z-20 w-full px-6 sm:px-12 py-6 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={onExploreGuest}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-3 bg-white rounded-full animate-[pulse_1s_infinite]" />
              <span className="w-1 h-5 bg-white rounded-full animate-[pulse_1.4s_infinite]" />
              <span className="w-1 h-2 bg-white rounded-full animate-[pulse_0.8s_infinite]" />
              <span className="w-1 h-4 bg-white rounded-full animate-[pulse_1.2s_infinite]" />
            </div>
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent drop-shadow-md">
            Sonic
          </span>
        </div>

        {/* Center Navigation Links: Each opens its dedicated rich view modal */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveInfoModal('music')}
            className={`transition-colors hover:text-amber-400 ${
              isDark ? 'text-zinc-300' : 'text-zinc-800'
            }`}
          >
            Music
          </button>
          <button
            onClick={() => setActiveInfoModal('explore')}
            className={`transition-colors hover:text-amber-400 ${
              isDark ? 'text-zinc-300' : 'text-zinc-800'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => setActiveInfoModal('moments')}
            className={`transition-colors hover:text-amber-400 ${
              isDark ? 'text-zinc-300' : 'text-zinc-800'
            }`}
          >
            Moments
          </button>
          <button
            onClick={() => setActiveInfoModal('pricing')}
            className={`transition-colors hover:text-amber-400 ${
              isDark ? 'text-zinc-300' : 'text-zinc-800'
            }`}
          >
            Pricing
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={onExploreGuest}
            className="px-4 py-1.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 text-xs font-semibold transition-all"
          >
            Explore Guest
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-20 w-full px-6 sm:px-12 py-4 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-[1580px] mx-auto">
        {/* Left Hero Column */}
        <div className="w-full lg:w-5/12 space-y-6 text-left">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-amber-300 font-semibold">
              MUSIC BRINGS US CLOSER
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.08] drop-shadow-2xl">
            Your World.
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-rose-400 bg-clip-text text-transparent">
              Your Music.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300/90 max-w-md leading-relaxed drop-shadow">
            Discover. Play. Create. All in one place. Stream any track with studio audio conversion,
            3D vinyl acoustics, and audiophile fidelity.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={onExploreGuest}
              className="group flex items-center gap-3 px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-semibold text-sm shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-white text-white ml-0.5" />
              </div>
              <span>Explore as Guest</span>
            </button>
          </div>
        </div>

        {/* Right Glassmorphism Forms Column */}
        <div className="w-full lg:w-6/12 max-w-xl">
          <div
            className={`w-full p-8 sm:p-10 rounded-[36px] border backdrop-blur-3xl shadow-2xl transition-all duration-500 relative ${
              isDark
                ? 'bg-black/60 border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.8)]'
                : 'bg-white/70 border-white/40 shadow-2xl'
            }`}
          >
            {/* View Selector Tabs (Sign In / Sign Up) */}
            <div className="flex p-1 rounded-2xl bg-white/5 border border-white/10 mb-8">
              <button
                type="button"
                onClick={() => setActiveCard('login')}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeCard === 'login' || activeCard === 'both'
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveCard('signup')}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeCard === 'signup'
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center font-medium">
                {errorMsg}
              </div>
            )}

            {/* Login View */}
            {(activeCard === 'both' || activeCard === 'login') && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Email or Username</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="voyager@sonic.audio"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm focus:outline-none focus:border-amber-400/80 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-zinc-300">Password</label>
                    <button
                      type="button"
                      onClick={() => setLoginPassword('sonic2026')}
                      className="text-amber-400 hover:underline"
                    >
                      Fill Demo
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-4 h-4 text-zinc-400" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-11 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm focus:outline-none focus:border-amber-400/80 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-4 text-zinc-400 hover:text-zinc-200"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                    <span className="text-zinc-400">Remember session</span>
                  </label>
                  <button
                    type="button"
                    onClick={onExploreGuest}
                    className="text-zinc-400 hover:text-white"
                  >
                    Quick Enter
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In to Studio'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Sign Up View */}
            {activeCard === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Full Name</label>
                  <div className="relative flex items-center">
                    <UserIcon className="absolute left-4 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      required
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="Audio Collector"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm focus:outline-none focus:border-amber-400/80 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Email Address</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-4 h-4 text-zinc-400" />
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm focus:outline-none focus:border-amber-400/80 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Choose Username</label>
                  <div className="relative flex items-center">
                    <AtSign className="absolute left-4 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      required
                      value={signUpUsername}
                      onChange={(e) => setSignUpUsername(e.target.value)}
                      placeholder="sonic_audiophile"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm focus:outline-none focus:border-amber-400/80 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Set Password</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-4 h-4 text-zinc-400" />
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full pl-11 pr-11 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm focus:outline-none focus:border-amber-400/80 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-4 text-zinc-400 hover:text-zinc-200"
                    >
                      {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Creating Profile...' : 'Complete Studio Registration'}</span>
                  <Check className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Quick Demo Credentials Help */}
            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <p className="text-xs text-zinc-400">
                Quick testing? Click{' '}
                <button
                  type="button"
                  onClick={onExploreGuest}
                  className="text-amber-400 font-bold hover:underline"
                >
                  Explore as Guest
                </button>{' '}
                to enter with full VIP studio access.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Status Bar with Interactive Links */}
      <footer className="relative z-20 w-full px-6 sm:px-12 py-5 flex items-center justify-between text-xs text-zinc-400/80 border-t border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-1 h-3 bg-amber-400 rounded-full" />
            <span className="w-1 h-5 bg-amber-500 rounded-full" />
            <span className="w-1 h-2 bg-amber-400 rounded-full" />
          </div>
          <span>More than music.</span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveInfoModal('sonic')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Sonic
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveInfoModal('people')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            People
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveInfoModal('moments')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Moments
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveInfoModal('together')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Together
          </button>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* DEDICATED INFO MODALS FOR HEADER TABS & FOOTER LINKS                       */}
      {/* ========================================================================= */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div
            className={`relative w-full max-w-2xl rounded-[32px] border p-6 sm:p-8 space-y-6 shadow-2xl transition-all duration-300 max-h-[85vh] overflow-y-auto custom-scrollbar ${
              isDark
                ? 'bg-zinc-950/95 border-amber-500/30 text-white shadow-[0_20px_70px_rgba(0,0,0,0.95)]'
                : 'bg-white/95 border-amber-500/40 text-zinc-900 shadow-2xl'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  {activeInfoModal === 'music' && <Headphones className="w-5 h-5" />}
                  {activeInfoModal === 'explore' && <Compass className="w-5 h-5" />}
                  {activeInfoModal === 'moments' && <Sparkles className="w-5 h-5" />}
                  {activeInfoModal === 'pricing' && <CreditCard className="w-5 h-5" />}
                  {activeInfoModal === 'sonic' && <Disc3 className="w-5 h-5" />}
                  {activeInfoModal === 'people' && <Users className="w-5 h-5" />}
                  {activeInfoModal === 'together' && <Heart className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight capitalize">
                    {activeInfoModal === 'music' && 'Sonic Audio Architecture'}
                    {activeInfoModal === 'explore' && 'Global Audiophile Crates'}
                    {activeInfoModal === 'moments' && 'Sonic Synchronized Moments'}
                    {activeInfoModal === 'pricing' && 'Studio Membership Plans'}
                    {activeInfoModal === 'sonic' && 'The Sonic Philosophy'}
                    {activeInfoModal === 'people' && 'Global Listener Community'}
                    {activeInfoModal === 'together' && 'Collaborative Studio Listening'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    High-Fidelity Studio Acoustics • Calibrated Experience
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveInfoModal(null)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Content according to selected tab */}
            {activeInfoModal === 'music' && (
              <div className="space-y-5 text-xs sm:text-sm text-zinc-300">
                <p className="leading-relaxed">
                  Sonic delivers master-grade audio streaming powered by a custom audio pipeline that
                  converts and decodes online audio into <strong>Lossless High-Fidelity</strong> streams
                  with 48,000 Hz stereophonic channel separation.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-sky-400 font-bold block text-xs font-mono">
                      48.0 kHz / LOSSLESS STEREO
                    </span>
                    <p className="text-xs text-zinc-400">
                      Zero compression artifacts, preserving pure acoustic dynamics.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-amber-400 font-bold block text-xs font-mono">
                      LIVE LYRIC SYNC
                    </span>
                    <p className="text-xs text-zinc-400">
                      Milliseconds-precise lyric tracking aligned directly with audio playback.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeInfoModal === 'explore' && (
              <div className="space-y-4 text-xs sm:text-sm text-zinc-300">
                <p className="leading-relaxed">
                  Explore thousands of handpicked vinyl crates and studio master recordings curated
                  from luxury listening rooms in Tokyo, Berlin, Reykjavik, and New York.
                </p>
                <div className="space-y-2">
                  {[
                    { title: 'Sunset Penthouse Lounge', vibe: 'Warm analog warmth and mellow acoustics' },
                    { title: 'Cyberpunk & Retrowave', vibe: '80s synthesizers and midnight expressways' },
                    { title: 'Audiophile Master Tapes', vibe: 'High-dynamic-range reference recordings' },
                  ].map((c, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-white text-xs">{c.title}</h5>
                        <p className="text-[11px] text-zinc-400">{c.vibe}</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                        Lossless
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeInfoModal === 'moments' && (
              <div className="space-y-4 text-xs sm:text-sm text-zinc-300">
                <p className="leading-relaxed">
                  Sonic Moments connects music lovers across the world in synchronized listening
                  rooms where every turntable movement, track transition, and lyric scroll happens in
                  real time across all connected listeners.
                </p>
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/25 space-y-2">
                  <h4 className="font-bold text-amber-300 text-xs font-mono">REAL-TIME SHARED ACOUSTICS</h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Host a private penthouse listening party or invite friends to drop the tone-arm
                    simultaneously on a virtual vinyl record.
                  </p>
                </div>
              </div>
            )}

            {activeInfoModal === 'pricing' && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-400">
                  Calibrated listening tiers for casual enthusiasts and demanding audiophiles.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-bold text-sm text-white">Free Studio</h4>
                      <p className="text-xl font-extrabold text-amber-400 mt-1">$0 <span className="text-xs text-zinc-400 font-normal">/mo</span></p>
                      <ul className="text-xs text-zinc-300 space-y-1.5 mt-3">
                        <li>• Lossless Hi-Fi Streaming</li>
                        <li>• Custom Playlists</li>
                        <li>• Live Synchronized Lyrics</li>
                      </ul>
                    </div>
                    <button onClick={onExploreGuest} className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all">
                      Start Free
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-sky-500/15 border-2 border-sky-400/60 shadow-lg flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-400 text-slate-950 font-bold">POPULAR</span>
                      <h4 className="font-bold text-sm text-white mt-1">Studio Pro</h4>
                      <p className="text-xl font-extrabold text-sky-400 mt-1">$9.99 <span className="text-xs text-zinc-400 font-normal">/mo</span></p>
                      <ul className="text-xs text-zinc-200 space-y-1.5 mt-3">
                        <li>• Instant Lossless Decoding</li>
                        <li>• 3D Turntable Physics</li>
                        <li>• Offline Master Caching</li>
                      </ul>
                    </div>
                    <button onClick={onExploreGuest} className="w-full py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all shadow-md">
                      Join Pro
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-bold text-sm text-white">Audiophile VIP</h4>
                      <p className="text-xl font-extrabold text-sky-400 mt-1">$19.99 <span className="text-xs text-zinc-400 font-normal">/mo</span></p>
                      <ul className="text-xs text-zinc-300 space-y-1.5 mt-3">
                        <li>• 24K Gold Master Vault</li>
                        <li>• Multi-Room Broadcast</li>
                        <li>• High-Fidelity ID3 Tags</li>
                      </ul>
                    </div>
                    <button onClick={onExploreGuest} className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all">
                      Access VIP
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeInfoModal === 'sonic' && (
              <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                <p>
                  Sonic is crafted with a single guiding obsession: to restore the emotional intimacy
                  and physical tactile sensation of handling vinyl master tapes inside a world of
                  disposable algorithms.
                </p>
                <p>
                  From the micro-animations of our celestial light/dark toggle to the precision tone-arm
                  mechanics of our 3D turntable, every single pixel and acoustic channel is engineered
                  for transcendence.
                </p>
              </div>
            )}

            {activeInfoModal === 'people' && (
              <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                <p>
                  The Sonic network unites over 1.2 million music enthusiasts, mastering engineers,
                  independent producers, and vinyl collectors in over 85 countries.
                </p>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                    1.2M+
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">Active Global Listeners</h5>
                    <p className="text-[11px] text-zinc-400">Streaming across high-fidelity listening rooms daily.</p>
                  </div>
                </div>
              </div>
            )}

            {activeInfoModal === 'together' && (
              <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                <p>
                  Music was never meant to be experienced in isolation. With Sonic Together, friends can
                  share synchronized queues, roll the 3D randomizer collectively, and experience
                  bit-perfect audio concurrently regardless of geographic distance.
                </p>
                <button
                  onClick={() => {
                    setActiveInfoModal(null);
                    onExploreGuest();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-xs flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Launch Shared Studio Now</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
