'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getJobDescriptionFromIPFS } from '@/lib/ipfs';

interface GunJob {
  id: string;
  title: string;
  budget: {
    amount: number;
    currency: string;
    paymentType: string;
  };
  skills: string[];
  postedBy: string;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  metadata?: {
    ipfsHash?: string;
  };
}

interface JobPageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailPage({ params }: JobPageProps) {
  const [jobId, setJobId] = useState<string>('');
  const [job, setJob] = useState<GunJob | null>(null);
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const resolved = await params;
      if (!active) return;
      setJobId(resolved.id);

      const { gun } = await import('@/lib/gun');

      gun.get('jobs').get(resolved.id).once(async (data: GunJob) => {
        if (!active) return;

        if (!data?.id) {
          setLoading(false);
          return;
        }

        setJob(data);

        if (data.metadata?.ipfsHash) {
          const full = await getJobDescriptionFromIPFS(data.metadata.ipfsHash);
          if (active && full?.description) {
            setDescription(full.description);
          }
        }

        setLoading(false);
      });
    };

    load();

    return () => {
      active = false;
    };
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-4 py-10 text-gray-300">
        Loading job details from mesh...
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-black px-4 py-10">
        <p className="text-gray-300">Job not found on this peer.</p>
        <Link href="/marketplace" className="mt-4 inline-block text-cyan-400">
          Back to marketplace
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-black px-4 py-10 md:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link href="/marketplace" className="text-cyan-400">← Back to marketplace</Link>

        <section className="rounded-xl border border-white/20 bg-white/5 p-6">
          <h1 className="text-3xl font-bold text-white">{job.title}</h1>
          <p className="mt-2 text-sm text-gray-400">Job ID: {jobId}</p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-white/15 bg-black/30 p-4">
              <p className="text-xs text-gray-400">Budget</p>
              <p className="text-xl font-semibold text-cyan-300">${job.budget.amount} {job.budget.currency}</p>
              <p className="text-xs text-gray-500">{job.budget.paymentType}</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-black/30 p-4">
              <p className="text-xs text-gray-400">Posted By</p>
              <p className="font-mono text-white">{job.postedBy.slice(0, 6)}...{job.postedBy.slice(-4)}</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-black/30 p-4">
              <p className="text-xs text-gray-400">Status</p>
              <p className="text-white">{job.status}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-400">Description (IPFS)</p>
            <p className="mt-2 whitespace-pre-wrap text-gray-200">
              {description || 'Description not yet available from current gateway.'}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-purple-400/40 bg-purple-500/20 px-3 py-1 text-xs text-purple-200"
              >
                {skill}
              </span>
            ))}
          </div>

          <Link
            href={`/messages?to=${job.postedBy}`}
            className="mt-6 inline-block rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-black"
          >
            Message Poster
          </Link>
        </section>
      </div>
    </main>
  );
}
