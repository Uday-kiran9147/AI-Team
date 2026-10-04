'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles } from 'lucide-react';
import { AuthControl } from './auth-control';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100 group-hover:border-zinc-700 transition-colors shadow-sm">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-zinc-100 tracking-tight">
              App
            </span>
            <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              auth ready
            </span>
          </div>
        </Link>

        {/* Right Controls: Auth Only */}
        <div className="flex items-center gap-3">
          <AuthControl />
        </div>
      </div>
    </header>
  );
}
