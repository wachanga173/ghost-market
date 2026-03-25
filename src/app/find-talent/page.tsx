'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

interface GunJob {
  postedBy: string;
  skills: string[];
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
}

interface TalentCard {
  wallet: string;
  skills: string[];
  openJobs: number;
}

export default function FindTalentPage() {
  const [jobs, setJobs] = useState<GunJob[]>([]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const load = async () => {
      const { subscribeToJobs } = await import('@/lib/gun');
      cleanup = subscribeToJobs((jobMap) => {
        const all = Object.values(jobMap).filter(Boolean) as GunJob[];
        setJobs(all);
      });
    };

    load();

    return () => {
      cleanup?.();
    };
  }, []);

  const talent = useMemo<TalentCard[]>(() => {
    const byWallet = new Map<string, { skills: Set<string>; openJobs: number }>();

    for (const job of jobs) {
      const wallet = job.postedBy;
      if (!byWallet.has(wallet)) {
        byWallet.set(wallet, { skills: new Set<string>(), openJobs: 0 });
      }

      const entry = byWallet.get(wallet)!;
      for (const skill of job.skills) {
        entry.skills.add(skill);
      }
      if (job.status === 'open') {
        entry.openJobs += 1;
      }
    }

    return Array.from(byWallet.entries()).map(([wallet, data]) => ({
      wallet,
      skills: Array.from(data.skills),
      openJobs: data.openJobs,
    }));
  }, [jobs]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-black px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Find Talent</h1>
          <p className="text-gray-400">Discover active wallets publishing work on the Ghost Market mesh.</p>
        </header>

        {talent.length === 0 ? (
          <div className="rounded-xl border border-white/15 bg-white/5 p-8 text-gray-300">
            No active publishers yet. As jobs appear on Gun.js, talent cards will populate here.
          </div>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {talent.map((item) => (
              <article
                key={item.wallet}
                className="rounded-xl border border-white/20 bg-white/5 p-5 backdrop-blur-md"
              >
                <h2 className="font-mono text-white">
                  {item.wallet.slice(0, 6)}...{item.wallet.slice(-4)}
                </h2>
                <p className="mt-2 text-sm text-gray-400">Open jobs: {item.openJobs}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.skills.slice(0, 6).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-purple-400/40 bg-purple-500/20 px-2 py-1 text-xs text-purple-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/messages?to=${item.wallet}`}
                  className="mt-4 inline-block rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-black"
                >
                  Start Chat
                </Link>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
