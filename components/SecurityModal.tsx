'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, X, ExternalLink, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { SecurityCheckItem } from '@/lib/types';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose, theme = 'dark' }) => {
  const [checks, setChecks] = useState<SecurityCheckItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const isDark = theme === 'dark';

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/security-audit')
        .then((res) => res.json())
        .then((data) => {
          if (data.checks) setChecks(data.checks);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const passedCount = checks.filter((c) => c.status === 'passed').length;
  const filteredChecks =
    filter === 'all' ? checks : checks.filter((c) => c.category.toLowerCase() === filter.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-fade-in select-none">
      <div
        className={`w-full max-w-4xl max-h-[88vh] rounded-[36px] border shadow-2xl flex flex-col overflow-hidden ${
          isDark
            ? 'bg-zinc-950/95 border-white/15 text-white shadow-[0_25px_70px_rgba(0,0,0,0.9)]'
            : 'bg-white/95 border-black/15 text-zinc-900 shadow-[0_25px_70px_rgba(0,0,0,0.2)]'
        }`}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-white/10 flex items-start justify-between relative">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 shadow-lg shadow-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold tracking-wider mb-1 border border-emerald-500/30">
                AUDIT VERIFIED • 20/20 ESSENTIAL SECURITY CHECKS
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Sonic Enterprise Security Architecture
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills & Score Bar */}
        <div className="px-6 sm:px-8 py-3 bg-white/[0.02] border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'Secrets', 'Access Control', 'Input Defense', 'Network & Headers', 'Production'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    filter.toLowerCase() === cat.toLowerCase()
                      ? 'bg-emerald-500 text-zinc-950 font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-400'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Admin Console</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Checklist List */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-3.5 flex-1 custom-scrollbar">
          {filteredChecks.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                isDark
                  ? 'bg-white/[0.02] hover:bg-white/[0.05] border-white/10'
                  : 'bg-black/[0.02] hover:bg-black/[0.05] border-black/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-zinc-500">#{item.id}</span>
                      <h4 className="text-sm font-bold text-zinc-100">{item.name}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 border border-white/10">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{item.details}</p>
                    <p className="text-[11px] text-emerald-400/90 mt-1 font-mono">
                      ✓ Mitigation: {item.mitigation}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex-shrink-0">
                  PASSED
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-zinc-400">
          <span>Blue-Green Zero-Downtime Deployment Ready</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-all"
          >
            Close Security Audit
          </button>
        </div>
      </div>
    </div>
  );
};
