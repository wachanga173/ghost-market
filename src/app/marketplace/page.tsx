'use client';

import dynamic from 'next/dynamic';

const MarketplaceFeed = dynamic(() => import('@/components/MarketplaceFeed'), {
  ssr: false,
});

export default function MarketplacePage() {
  return (
    <main className="flex flex-col flex-1 w-full">
      <MarketplaceFeed />
    </main>
  );
}
