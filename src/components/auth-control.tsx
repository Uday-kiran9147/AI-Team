'use client';

import React from 'react';
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs';
import { KeyRound, UserPlus } from 'lucide-react';

export function AuthControl() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkActive =
    publishableKey &&
    publishableKey.startsWith('pk_') &&
    !publishableKey.includes('your_clerk_publishable_key');

  if (!isClerkActive) {
    return (
      <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span>local dev</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Show when="signed-out">
        <div className="flex items-center gap-1.5">
          <SignInButton mode="modal">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-colors border border-zinc-800">
              <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
              <span>Sign In</span>
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-semibold transition-colors shadow-sm">
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </SignUpButton>
        </div>
      </Show>
      <Show when="signed-in">
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'w-7 h-7 rounded-full border border-zinc-700',
            },
          }}
        />
      </Show>
    </div>
  );
}
