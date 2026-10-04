import { SignUp } from '@clerk/nextjs';
import { Radio } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 p-4">
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100">
            <Radio className="w-3.5 h-3.5" />
          </div>
          <span className="text-lg font-bold text-zinc-100 tracking-tight">
            Relay
          </span>
        </div>
        <p className="text-xs text-zinc-400">Release Distribution &amp; Changelog Ops</p>
      </div>

      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-zinc-900 border border-zinc-800 shadow-xl text-zinc-100',
            headerTitle: 'text-zinc-100 font-bold',
            headerSubtitle: 'text-zinc-400',
            socialButtonsBlockButton: 'bg-zinc-950 border-zinc-800 text-zinc-200 hover:bg-zinc-800',
            formButtonPrimary: 'bg-zinc-100 hover:bg-white text-zinc-900 font-semibold',
            formFieldInput: 'bg-zinc-950 border-zinc-800 text-zinc-100',
            footerActionLink: 'text-zinc-300 hover:text-white',
          },
        }}
      />
    </div>
  );
}
