'use client';

import React, { useState, useRef } from 'react';
import { User as UserType } from '@/lib/types';
import { X, Headphones, Clock, Disc, Shield, LogOut, Camera, Link2, Check } from 'lucide-react';
import { SafeImage } from './SafeImage';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  theme?: 'dark' | 'light';
  onLogout: () => void;
  onUpdateAvatar?: (avatarUrl: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  onUpdateAvatar,
}) => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !user) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl && onUpdateAvatar) {
        onUpdateAvatar(dataUrl);
        triggerSuccess();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim() && onUpdateAvatar) {
      onUpdateAvatar(inputUrl.trim());
      setInputUrl('');
      setShowUrlInput(false);
      triggerSuccess();
    }
  };

  const triggerSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in select-none">
      <div className="w-full max-w-lg rounded-[36px] border border-sky-500/25 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden bg-[#050e24]/95 text-white">
        {/* Top Banner */}
        <div className="h-32 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 relative p-6 flex items-start justify-end">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-950/40 hover:bg-slate-950/70 text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative space-y-6">
          {/* Avatar and Personalized Image Upload */}
          <div className="flex items-end justify-between -mt-14 mb-4">
            <div className="relative group">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#050e24] shadow-2xl bg-slate-900">
                <SafeImage
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                  fallbackSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
                  alt={user.fullName}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Upload trigger button overlay on avatar */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-slate-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity border-4 border-[#050e24] cursor-pointer"
                title="Upload Personalized Photo"
              >
                <Camera className="w-5 h-5 text-sky-400" />
                <span className="text-[10px] font-bold text-sky-300 mt-0.5">Change</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            <div className="flex items-center gap-2">
              {saveSuccess && (
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono border border-emerald-500/40 animate-fade-in">
                  <Check className="w-3.5 h-3.5" /> Photo Updated
                </div>
              )}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 text-xs font-mono font-semibold border border-sky-500/30">
                <Shield className="w-3.5 h-3.5" /> IDOR PROTECTED
              </div>
            </div>
          </div>

          {/* Personalized Avatar Controls */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-sky-500/15 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-300 font-medium">Personalized Avatar:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition-all hover:scale-105"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-all"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Photo URL</span>
              </button>
            </div>
          </div>

          {/* Paste Image URL Form */}
          {showUrlInput && (
            <form onSubmit={handleUrlSubmit} className="flex gap-2 animate-fade-in">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Paste direct image link (https://...)..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-sky-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Apply
              </button>
            </form>
          )}

          <div>
            <h3 className="text-2xl font-bold">{user.fullName}</h3>
            <p className="text-xs text-slate-400">@{user.username} • {user.email}</p>
            <span className="text-[11px] font-mono text-slate-500 mt-1 block">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 text-center space-y-1">
              <div className="flex items-center justify-center text-sky-400">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-base font-bold block">{user.stats?.totalHoursListened || 14.2}h</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Listened</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 text-center space-y-1">
              <div className="flex items-center justify-center text-cyan-400">
                <Headphones className="w-4 h-4" />
              </div>
              <span className="text-base font-bold block">{user.stats?.tracksPlayed || 148}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Plays</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 text-center space-y-1">
              <div className="flex items-center justify-center text-blue-400">
                <Disc className="w-4 h-4" />
              </div>
              <span className="text-base font-bold block truncate">Lossless</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Hi-Fi Audio</span>
            </div>
          </div>

          {/* Preferred Genre */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-400">Favorite Genre</span>
            <span className="text-xs font-semibold text-sky-300">
              {user.stats?.favoriteGenre || 'Synthwave / Penthouse Lounge'}
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-200 transition-all"
            >
              Close
            </button>
            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-semibold transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
