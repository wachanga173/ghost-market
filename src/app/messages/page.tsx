'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const P2PChat = dynamic(() => import('@/components/P2PChat'), {
  ssr: false,
});

function MessagesContent() {
  const params = useSearchParams();
  const defaultTo = useMemo(() => params.get('to') ?? '', [params]);
  const [toAddress, setToAddress] = useState(defaultTo);
  const [activeAddress, setActiveAddress] = useState(defaultTo);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-black px-4 py-10 md:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Encrypted Messages</h1>
          <p className="text-gray-400">Direct wallet-to-wallet chat over Gun.js SEA.</p>
        </header>

        <div className="flex flex-col gap-3 rounded-xl border border-white/20 bg-white/5 p-4 md:flex-row">
          <input
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="0x recipient wallet address"
            className="flex-1 rounded-lg border border-white/20 bg-black/30 px-4 py-3 text-white outline-none"
          />
          <button
            onClick={() => setActiveAddress(toAddress.trim())}
            className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-black"
          >
            Open Chat
          </button>
        </div>

        {activeAddress ? (
          <div className="h-[600px]">
            <P2PChat otherParticipant={activeAddress} />
          </div>
        ) : (
          <div className="rounded-xl border border-white/15 bg-white/5 p-8 text-gray-300">
            Enter a wallet address to start a conversation.
          </div>
        )}
      </div>
    </main>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-gray-950 to-black px-4 py-10 md:px-8 text-gray-300">
          Loading messages...
        </main>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
