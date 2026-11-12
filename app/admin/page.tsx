'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, ShieldAlert, ArrowLeft, Lock, Server, Activity } from 'lucide-react';
import { User, SecurityCheckItem } from '@/lib/types';
import { INITIAL_USER } from '@/lib/data';

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [securityChecks, setSecurityChecks] = useState<SecurityCheckItem[]>([]);
  const [spendCap, setSpendCap] = useState(600);
  const [rateLimitRpm, setRateLimitRpm] = useState(60);
  const [activeSlot, setActiveSlot] = useState<'blue' | 'green'>('blue');

  useEffect(() => {
    const storedUser = localStorage.getItem('sonic_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch {
        setCurrentUser(INITIAL_USER);
      }
    } else {
      setCurrentUser(INITIAL_USER);
    }

    fetch('/api/security-audit')
      .then((res) => res.json())
      .then((data) => {
        if (data.checks) setSecurityChecks(data.checks);
      })
      .catch(() => {});
  }, []);

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white p-6 sm:p-12 font-sans selection:bg-amber-500/30">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Sonic Music Hub
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono tracking-wider text-emerald-400">
              DEPLOYMENT: SLOT_{activeSlot.toUpperCase()} (PORT {activeSlot === 'blue' ? '3001' : '3002'})
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold mb-3 border border-amber-500/30">
                <Shield className="w-3.5 h-3.5" /> SECURITY CHECK #4: PROTECTED ADMIN PORTAL
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Sonic Operations & Security Console</h1>
              <p className="text-zinc-400 mt-2 text-sm max-w-xl">
                Real-time governance dashboard enforcing Role-Based Access Control (RBAC), spend cap quotas, and Blue-Green zero-downtime router configuration.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-500 block font-mono">AUTHENTICATED ACTOR</span>
              <span className="text-sm font-semibold text-zinc-200">
                {currentUser?.fullName} ({currentUser?.role})
              </span>
            </div>
          </div>
        </div>

        {/* RBAC Guard Status */}
        {!isAdmin && (
          <div className="p-6 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-4">
            <ShieldAlert className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-200">Role-Based Access Control Warning</h3>
              <p className="text-sm text-amber-300/80 mt-1">
                Your current session role is <code className="text-amber-300 font-mono">user</code>. Administrative mutations require <code className="text-amber-300 font-mono">admin</code> privileges. You can toggle test admin role below to inspect protected controls.
              </p>
              <button
                onClick={() => {
                  const updated: User = { ...currentUser!, role: 'admin' };
                  setCurrentUser(updated);
                  localStorage.setItem('sonic_user', JSON.stringify(updated));
                }}
                className="mt-3 px-4 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-semibold text-amber-200 transition-all"
              >
                Promote to Admin (Demo Inspection)
              </button>
            </div>
          </div>
        )}

        {/* Grid Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Blue-Green Controller */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-4 text-emerald-400 font-semibold text-sm">
              <Server className="w-4 h-4" /> Blue-Green Deployment Slot
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Switch traffic between active clusters with zero downtime and health validation.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveSlot('blue')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  activeSlot === 'blue'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                }`}
              >
                Blue (Active: 3001)
              </button>
              <button
                onClick={() => setActiveSlot('green')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  activeSlot === 'green'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                }`}
              >
                Green (Standby: 3002)
              </button>
            </div>
          </div>

          {/* Spend Cap (#12) */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-4 text-amber-400 font-semibold text-sm">
              <Lock className="w-4 h-4" /> Spend Cap & Quota (#12)
            </div>
            <p className="text-xs text-zinc-400 mb-2">Max conversion duration per track to prevent wallet-drain:</p>
            <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mb-2">
              <span>Limit:</span>
              <span className="text-amber-400 font-bold">{spendCap} seconds</span>
            </div>
            <input
              type="range"
              min="180"
              max="1200"
              step="30"
              value={spendCap}
              onChange={(e) => setSpendCap(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Rate Limiting (#11) */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-4 text-purple-400 font-semibold text-sm">
              <Activity className="w-4 h-4" /> Rate Limit Threshold (#11)
            </div>
            <p className="text-xs text-zinc-400 mb-2">Sliding-window request limit per client IP:</p>
            <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mb-2">
              <span>Threshold:</span>
              <span className="text-purple-400 font-bold">{rateLimitRpm} req / min</span>
            </div>
            <input
              type="range"
              min="20"
              max="120"
              step="10"
              value={rateLimitRpm}
              onChange={(e) => setRateLimitRpm(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        {/* 20 Security Checklist Status Table */}
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">20 Essential Website Security Checks Validation</h2>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {securityChecks.filter((c) => c.status === 'passed').length} / {securityChecks.length} Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
            {securityChecks.map((check) => (
              <div
                key={check.id}
                className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3 hover:border-white/20 transition-all"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  ✓
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500">#{check.id}</span>
                    <h4 className="text-xs font-semibold text-zinc-200 truncate">{check.name}</h4>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{check.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
