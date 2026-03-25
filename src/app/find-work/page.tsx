'use client';

import dynamic from 'next/dynamic';

const JobPostComposer = dynamic(() => import('@/components/JobPostComposer'), {
  ssr: false,
});

const MarketplaceFeed = dynamic(() => import('@/components/MarketplaceFeed'), {
  ssr: false,
});

export default function FindWorkPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-black px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Find Work</h1>
          <p className="text-gray-400">Publish jobs to the mesh and browse live opportunities.</p>
        </header>

        <JobPostComposer />
        <MarketplaceFeed />
      </div>
    </main>
  );
}
