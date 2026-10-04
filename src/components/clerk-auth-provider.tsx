'use client';

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';

export function ClerkAuthProvider({
  children,
  publishableKey,
}: {
  children: React.ReactNode;
  publishableKey?: string;
}) {
  const isKeyValid =
    publishableKey &&
    publishableKey.startsWith('pk_') &&
    !publishableKey.includes('your_clerk_publishable_key');

  if (!isKeyValid) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={{
        elements: {
          card: 'bg-slate-900 border border-slate-800 text-slate-100',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
