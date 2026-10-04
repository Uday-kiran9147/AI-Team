'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Auth imports commented out:
// import { SignInButton, Show, UserButton, useUser } from '@clerk/nextjs';

interface QueueItem {
  id: number;
  platform: string;
  version: string;
  text: string;
  approved: boolean;
}

const INITIAL_QUEUE: QueueItem[] = [
  {
    id: 0,
    platform: 'LinkedIn',
    version: 'Tablely 1.4',
    text: "Tablely 1.4 is live. You can now filter restaurants by what's open right now. I built it after three users asked in one week.",
    approved: false,
  },
  {
    id: 1,
    platform: 'X',
    version: 'Tablely 1.4',
    text: 'Shipped: "Open now" filter. 41 lines of code, 3 requests from real users. Small change, big fix.',
    approved: false,
  },
  {
    id: 2,
    platform: 'Changelog',
    version: 'Tablely 1.4',
    text: 'Added: "Open now" filter on the restaurant list. Fixed: map pins overlapping on small screens.',
    approved: false,
  },
];

export default function HomePage() {
  // Auth state commented out:
  // const { user } = useUser();

  const [queue, setQueue] = useState<QueueItem[]>(INITIAL_QUEUE);
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<{ type: 'idle' | 'error' | 'success'; message: string }>({
    type: 'idle',
    message: '',
  });

  const waitingCount = queue.filter((item) => !item.approved).length;

  const handleApprove = (id: number) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, approved: true } : item))
    );
  };

  const handleResetQueue = () => {
    setQueue(INITIAL_QUEUE);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
      setEmailStatus({
        type: 'error',
        message: 'Enter a valid email address, like you@yourproduct.com.',
      });
      return;
    }
    setEmailStatus({
      type: 'success',
      message: "You're on the list! We'll reach out with your early access invite soon.",
    });
  };

  return (
    <div className="wrap">
      {/* Header */}
      <header className="flex justify-between items-center py-5 sm:py-[22px]">
        <Link href="#top" className="logo text-[22px] font-extrabold tracking-[-0.02em] no-underline">
          Tenfold<span className="text-[var(--accent)]">.</span>
        </Link>
        <nav className="flex items-center">
          <Link href="#how" className="hidden sm:inline-block ml-[22px] no-underline text-[var(--muted)] hover:text-[var(--ink)] text-[15px] transition-colors">
            How it works
          </Link>
          <Link href="#team" className="hidden sm:inline-block ml-[22px] no-underline text-[var(--muted)] hover:text-[var(--ink)] text-[15px] transition-colors">
            Your team
          </Link>
          <Link href="#faq" className="hidden sm:inline-block ml-[22px] no-underline text-[var(--muted)] hover:text-[var(--ink)] text-[15px] transition-colors">
            FAQ
          </Link>
          <Link
            href="#join"
            className="btn-primary text-sm font-semibold !py-2.5 !px-4.5 rounded-[10px] ml-[22px]"
          >
            Join the waitlist
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main id="top">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-12 items-center pt-8 pb-16 lg:py-12 lg:pb-[88px]">
          <div>
            <h1 className="text-[clamp(38px,5.8vw,66px)] leading-[1.03] tracking-[-0.035em] font-extrabold mb-[22px]">
              You write the code. Your AI team does the rest.
            </h1>
            <p className="text-lg sm:text-[20px] text-[var(--muted)] max-w-[30em] mb-[30px] leading-relaxed">
              Tenfold watches your releases, then writes the launch post, makes the image, and queues it for you. You approve in one tap. It gets closer to your voice every week.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="#join" className="btn-primary text-[17px] font-semibold">
                Join the waitlist
              </Link>
            </div>
            <p className="text-sm text-[var(--muted)] mt-3.5">
              Built for developers who run their own products. Nothing posts without your approval.
            </p>
          </div>

          {/* Interactive Inbox Queue Component */}
          <div
            className="bg-[var(--surface)] border border-[var(--line)] rounded-[18px] p-4.5 sm:p-5 shadow-[0_18px_50px_rgba(19,32,26,0.12)] transition-all"
            aria-label="Example approval inbox"
          >
            <div className="flex justify-between items-baseline pb-3.5 mb-1.5 border-b border-[var(--line)]">
              <strong className="text-lg font-bold">Today&apos;s queue</strong>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--muted)]" aria-live="polite">
                  {waitingCount === 0 ? 'All done. See you tomorrow.' : `${waitingCount} waiting`}
                </span>
                {waitingCount === 0 && (
                  <button
                    type="button"
                    onClick={handleResetQueue}
                    className="text-xs text-[var(--accent)] hover:underline cursor-pointer bg-transparent border-0 p-0 ml-1"
                  >
                    Reset demo
                  </button>
                )}
              </div>
            </div>

            <div className="divide-y divide-[var(--line)]">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className={`py-4 first:pt-3 last:pb-1 transition-opacity ${
                    item.approved ? 'opacity-90' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-[13px] text-[var(--muted)] mb-1.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors ${
                        item.approved
                          ? 'bg-[var(--done)] text-white'
                          : 'bg-[var(--pending)] text-[#2A2000]'
                      }`}
                    >
                      {item.approved ? 'Published' : 'Waiting'}
                    </span>
                    <span>
                      {item.platform} · {item.version}
                    </span>
                  </div>
                  <p className="text-[15.5px] leading-[1.5] mb-3 text-[var(--ink)]">
                    {item.text}
                  </p>
                  <button
                    type="button"
                    onClick={() => !item.approved && handleApprove(item.id)}
                    aria-disabled={item.approved}
                    className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                      item.approved
                        ? 'bg-transparent text-[var(--done)] border border-[var(--done)] cursor-default'
                        : 'bg-[var(--accent)] text-[var(--accent-ink)] hover:brightness-105 cursor-pointer shadow-sm active:scale-95'
                    }`}
                  >
                    {item.approved ? 'Published' : 'Approve'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section: How it works */}
        <section id="how" className="py-16 sm:py-[72px] border-t border-[var(--line)]">
          <h2 className="text-[clamp(28px,4vw,42px)] tracking-[-0.025em] leading-[1.1] font-extrabold mb-3.5 max-w-[18em]">
            From release to published, without you opening a doc
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-[36em] mb-10">
            Connect your repo once and write a short brief about your product. After that, the work follows your commits.
          </p>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-9 list-none p-0 m-0">
            <li className="border-t-[3px] border-[var(--ink)] pt-4">
              <span className="font-extrabold text-[15px] text-[var(--accent)] block mb-1.5">
                1
              </span>
              <h3 className="text-[21px] font-bold tracking-[-0.01em] mb-1.5">
                You ship
              </h3>
              <p className="text-[16px] text-[var(--muted)] leading-relaxed m-0">
                Merge a release. Tenfold reads the release notes and pull request titles. It never reads your secrets or source files.
              </p>
            </li>
            <li className="border-t-[3px] border-[var(--ink)] pt-4">
              <span className="font-extrabold text-[15px] text-[var(--accent)] block mb-1.5">
                2
              </span>
              <h3 className="text-[21px] font-bold tracking-[-0.01em] mb-1.5">
                It drafts
              </h3>
              <p className="text-[16px] text-[var(--muted)] leading-relaxed m-0">
                A post for LinkedIn, a post for X, a changelog entry, and an image in your brand colors. Ready in about two minutes.
              </p>
            </li>
            <li className="border-t-[3px] border-[var(--ink)] pt-4">
              <span className="font-extrabold text-[15px] text-[var(--accent)] block mb-1.5">
                3
              </span>
              <h3 className="text-[21px] font-bold tracking-[-0.01em] mb-1.5">
                You approve
              </h3>
              <p className="text-[16px] text-[var(--muted)] leading-relaxed m-0">
                Fix a line if you want, then tap approve. Tenfold publishes it and shows you how it performed in your weekly summary.
              </p>
            </li>
          </ol>
        </section>

        {/* Section: Your Team */}
        <section id="team" className="py-16 sm:py-[72px] border-t border-[var(--line)]">
          <h2 className="text-[clamp(28px,4vw,42px)] tracking-[-0.025em] leading-[1.1] font-extrabold mb-3.5 max-w-[18em]">
            The team you can&apos;t afford to hire
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-[36em] mb-10">
            Each teammate owns a result, not a prompt. They all share what you&apos;ve told Tenfold about your product.
          </p>
          <ul className="list-none m-0 p-0 border-t border-[var(--line)]">
            <li className="grid grid-cols-1 sm:grid-cols-[200px_1fr_auto] gap-2 sm:gap-5 items-baseline py-5 border-b border-[var(--line)]">
              <b className="text-[21px] font-bold tracking-[-0.01em]">Marketer</b>
              <span className="text-[var(--muted)] text-[16px]">
                Turns releases into posts, threads, and changelogs in your voice.
              </span>
              <span className="text-[13px] font-semibold px-2.5 py-0.5 rounded-full bg-[var(--done)] text-white w-fit">
                Available at launch
              </span>
            </li>
            <li className="grid grid-cols-1 sm:grid-cols-[200px_1fr_auto] gap-2 sm:gap-5 items-baseline py-5 border-b border-[var(--line)]">
              <b className="text-[21px] font-bold tracking-[-0.01em]">Designer</b>
              <span className="text-[var(--muted)] text-[16px]">
                Makes social images and cards that match your brand.
              </span>
              <span className="text-[13px] font-semibold px-2.5 py-0.5 rounded-full bg-[var(--done)] text-white w-fit">
                Available at launch
              </span>
            </li>
            <li className="grid grid-cols-1 sm:grid-cols-[200px_1fr_auto] gap-2 sm:gap-5 items-baseline py-5 border-b border-[var(--line)]">
              <b className="text-[21px] font-bold tracking-[-0.01em]">Support</b>
              <span className="text-[var(--muted)] text-[16px]">
                Answers repeat questions and files bugs from emails, reviews, and DMs.
              </span>
              <span className="text-[13px] font-semibold px-2.5 py-0.5 rounded-full border border-[var(--line)] text-[var(--muted)] w-fit">
                Coming next
              </span>
            </li>
            <li className="grid grid-cols-1 sm:grid-cols-[200px_1fr_auto] gap-2 sm:gap-5 items-baseline py-5 border-b border-[var(--line)]">
              <b className="text-[21px] font-bold tracking-[-0.01em]">Growth</b>
              <span className="text-[var(--muted)] text-[16px]">
                Finds places your users hang out and drafts the outreach.
              </span>
              <span className="text-[13px] font-semibold px-2.5 py-0.5 rounded-full border border-[var(--line)] text-[var(--muted)] w-fit">
                Planned
              </span>
            </li>
            <li className="grid grid-cols-1 sm:grid-cols-[200px_1fr_auto] gap-2 sm:gap-5 items-baseline py-5 border-b border-[var(--line)]">
              <b className="text-[21px] font-bold tracking-[-0.01em]">Ops</b>
              <span className="text-[var(--muted)] text-[16px]">
                Tracks costs, revenue, and renewals in one weekly summary.
              </span>
              <span className="text-[13px] font-semibold px-2.5 py-0.5 rounded-full border border-[var(--line)] text-[var(--muted)] w-fit">
                Planned
              </span>
            </li>
          </ul>
        </section>

        {/* Section: Voice */}
        <section id="voice" className="py-16 sm:py-[72px] border-t border-[var(--line)]">
          <h2 className="text-[clamp(28px,4vw,42px)] tracking-[-0.025em] leading-[1.1] font-extrabold mb-3.5 max-w-[18em]">
            Every edit teaches it how you write
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-[36em] mb-10">
            Tenfold keeps what you approve and what you change. Your next draft starts from there.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] p-5.5">
              <h3 className="text-[15px] text-[var(--muted)] font-semibold mb-2.5">
                First draft
              </h3>
              <p className="text-[16.5px] leading-relaxed text-[var(--ink)] m-0">
                &ldquo;We&apos;re thrilled to announce an exciting new feature that will revolutionize how you discover restaurants!&rdquo;
              </p>
            </div>
            <div className="bg-[var(--surface)] border-2 border-[var(--accent)] rounded-[14px] p-5.5 shadow-sm">
              <h3 className="text-[15px] text-[var(--accent)] font-semibold mb-2.5">
                After you edit it
              </h3>
              <p className="text-[16.5px] leading-relaxed text-[var(--ink)] m-0">
                &ldquo;Tablely now has an &lsquo;open now&rsquo; filter. Three of you asked for it, so I built it this week.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Section: FAQ */}
        <section id="faq" className="py-16 sm:py-[72px] border-t border-[var(--line)]">
          <h2 className="text-[clamp(28px,4vw,42px)] tracking-[-0.025em] leading-[1.1] font-extrabold mb-8 max-w-[18em]">
            Questions
          </h2>
          <div className="space-y-0">
            <details className="border-b border-[var(--line)] py-4.5 group cursor-pointer">
              <summary className="font-semibold text-[19px] list-none flex justify-between items-center text-[var(--ink)] select-none">
                <span>Will it post without asking me?</span>
                <span className="text-[var(--accent)] font-extrabold text-xl group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="text-[var(--muted)] mt-2.5 max-w-[40em] leading-relaxed text-[16px]">
                No. Every post waits in your queue until you approve it. This is built into the product, not a setting you can forget to turn on.
              </p>
            </details>

            <details className="border-b border-[var(--line)] py-4.5 group cursor-pointer">
              <summary className="font-semibold text-[19px] list-none flex justify-between items-center text-[var(--ink)] select-none">
                <span>What does it read from my code?</span>
                <span className="text-[var(--accent)] font-extrabold text-xl group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="text-[var(--muted)] mt-2.5 max-w-[40em] leading-relaxed text-[16px]">
                Release notes and pull request titles and descriptions. It does not read source files, environment files, or secrets.
              </p>
            </details>

            <details className="border-b border-[var(--line)] py-4.5 group cursor-pointer">
              <summary className="font-semibold text-[19px] list-none flex justify-between items-center text-[var(--ink)] select-none">
                <span>I run more than one product. Does that work?</span>
                <span className="text-[var(--accent)] font-extrabold text-xl group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="text-[var(--muted)] mt-2.5 max-w-[40em] leading-relaxed text-[16px]">
                Yes. Each product keeps its own brief, brand, voice, and connected accounts.
              </p>
            </details>

            <details className="border-b border-[var(--line)] py-4.5 group cursor-pointer">
              <summary className="font-semibold text-[19px] list-none flex justify-between items-center text-[var(--ink)] select-none">
                <span>Which platforms can it post to?</span>
                <span className="text-[var(--accent)] font-extrabold text-xl group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="text-[var(--muted)] mt-2.5 max-w-[40em] leading-relaxed text-[16px]">
                LinkedIn and X at launch. If a platform is unavailable, Tenfold gives you the finished text and image to post yourself.
              </p>
            </details>

            <details className="border-b border-[var(--line)] py-4.5 group cursor-pointer">
              <summary className="font-semibold text-[19px] list-none flex justify-between items-center text-[var(--ink)] select-none">
                <span>How much does it cost?</span>
                <span className="text-[var(--accent)] font-extrabold text-xl group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="text-[var(--muted)] mt-2.5 max-w-[40em] leading-relaxed text-[16px]">
                Pricing isn&apos;t set yet. Waitlist members will hear first and get early access.
              </p>
            </details>
          </div>
        </section>

        {/* CTA Waitlist Box */}
        <div
          className="bg-[var(--ink)] text-[var(--bg)] rounded-[22px] p-8 sm:p-14 mb-[72px]"
          id="join"
        >
          <h2 className="text-[var(--bg)] text-[clamp(28px,3.8vw,38px)] font-extrabold max-w-[14em] mb-2 leading-tight">
            Get your time back for building
          </h2>
          <p className="opacity-80 mb-6 max-w-[32em] text-base sm:text-lg">
            Join the waitlist and get early access when Tenfold opens.
          </p>

          <form onSubmit={handleWaitlistSubmit} className="flex flex-wrap gap-2.5 max-w-lg">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourproduct.com"
              aria-label="Email address"
              autoComplete="email"
              className="flex-1 min-w-[220px] text-base px-4 py-3.5 rounded-[10px] border-2 border-transparent bg-[var(--bg)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
            />
            <button
              type="submit"
              className="btn-primary text-base font-semibold px-6 py-3.5"
            >
              Join the waitlist
            </button>
          </form>

          {emailStatus.message && (
            <div
              className={`mt-3.5 text-sm font-medium ${
                emailStatus.type === 'error' ? 'text-rose-400' : 'text-emerald-400'
              }`}
              role="status"
            >
              {emailStatus.message}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-7 sm:pb-10 text-[var(--muted)] text-sm border-t border-[var(--line)] flex flex-col sm:flex-row justify-between items-center gap-3">
        <span>Tenfold is a working name. © 2026</span>
        <div className="flex items-center gap-4 text-xs">
          <Link href="#how" className="hover:text-[var(--ink)] transition-colors">
            How it works
          </Link>
          <Link href="#team" className="hover:text-[var(--ink)] transition-colors">
            Team
          </Link>
          <Link href="#faq" className="hover:text-[var(--ink)] transition-colors">
            FAQ
          </Link>
        </div>
      </footer>
    </div>
  );
}
