'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { authenticateWithSIWE, getCurrentAddress } from '@/lib/auth';
import { getNetworkInfo, getWalletBalance } from '@/lib/auth';

export default function Hero() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    const address = await getCurrentAddress();
    if (address) {
      setWalletAddress(address);
      setIsConnected(true);

      // Get network info and balance
      const networkInfo = await getNetworkInfo();
      if (networkInfo) {
        setNetwork(networkInfo.name);
      }

      const walletBalance = await getWalletBalance(address);
      if (walletBalance) {
        setBalance(walletBalance.slice(0, 6));
      }
    }
  };

  const handleConnect = async () => {
    setIsAuthenticating(true);
    const result = await authenticateWithSIWE();
    if (result) {
      setWalletAddress(result.address);
      setIsConnected(true);
      await checkWalletConnection();
    }
    setIsAuthenticating(false);
  };

  return (
    <section className="relative isolate min-h-screen w-full overflow-hidden bg-gradient-to-b from-gray-950 via-purple-950/10 to-black">
      {/* Full-bleed hero background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://rtvumsbcqxnqboosytgn.supabase.co/storage/v1/object/sign/job-media/heroimage.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zM2QzYzEyZC00ZmY0LTQ2OTAtYWU2Zi1kYWQ4NGM4MGJiOTQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJqb2ItbWVkaWEvaGVyb2ltYWdlLnBuZyIsImlhdCI6MTc3NDQ1MDY1NywiZXhwIjozMTcxMzQ0NTA2NTd9.ZgqEmysn42bmVNG8uHPykw4lE1PLVx3zKHXfSTAbaco"
          alt="Ghost Market background"
          fill
          priority
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />
      </div>

      {/* Animated background */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-50 animate-pulse animation-delay-2000" />
        <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl opacity-30 animate-pulse animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Header with wallet info */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 md:p-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-xl font-bold text-white">Ghost Market</span>
          </div>

          {isConnected && walletAddress && (
            <div className="hidden md:flex items-center gap-4 px-4 py-2 rounded-lg backdrop-blur-md bg-white/10 border border-white/20">
              <div className="text-sm">
                <div className="text-xs text-gray-400">
                  {network ? `Network: ${network}` : 'Connected'}
                </div>
                <div className="text-white font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
              </div>
              {balance && (
                <div className="text-sm text-cyan-300 font-mono">
                  {balance} ETH
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Hero Content */}
        <div className="text-center max-w-4xl mx-auto space-y-8 mb-16">
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent leading-tight">
              The Platform That
              <br />
              Holds No Data
            </h1>

            <h2 className="text-2xl md:text-3xl text-gray-300 font-light">
              A sovereign freelance marketplace built on <span className="text-cyan-300 font-semibold">zero centralization</span>
            </h2>
          </div>

          {/* Sub-heading */}
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Powered by <span className="text-cyan-300 font-semibold">Gun.js</span>, <span className="text-purple-300 font-semibold">Ethereum</span>, and <span className="text-orange-300 font-semibold">IPFS</span>. 
            Post jobs, connect with talent, and transact securely—all without a central server touching your data.
          </p>

        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          {!isConnected ? (
            <>
              <button
                onClick={handleConnect}
                disabled={isAuthenticating}
                className="px-8 py-4 rounded-lg font-semibold text-black bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-600 transition-all shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50"
              >
                {isAuthenticating ? 'Connecting...' : 'Connect Wallet'}
              </button>
              <Link
                href="/marketplace"
                className="px-8 py-4 rounded-lg font-semibold text-white bg-white/10 border border-white/30 hover:bg-white/20 hover:border-white/50 backdrop-blur transition-all"
              >
                Browse Jobs (Guest)
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/find-talent"
                className="px-8 py-4 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 transition-all shadow-lg hover:shadow-purple-500/50"
              >
                [FIND TALENT]
              </Link>
              <Link
                href="/find-work"
                className="px-8 py-4 rounded-lg font-semibold text-black bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/50"
              >
                [FIND WORK]
              </Link>
            </>
          )}
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20">
          <div className="p-6 rounded-lg backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-cyan-500/50 transition-all">
            <div className="text-2xl mb-2">🔐</div>
            <h3 className="text-lg font-semibold text-white mb-2">No Database</h3>
            <p className="text-sm text-gray-400">
              Your data lives in decentralized networks. We operate Gun.js peers, not servers.
            </p>
          </div>

          <div className="p-6 rounded-lg backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-purple-500/50 transition-all">
            <div className="text-2xl mb-2">⛓️</div>
            <h3 className="text-lg font-semibold text-white mb-2">Self-Sovereign</h3>
            <p className="text-sm text-gray-400">
              Sign in with your wallet. Full control over your identity and assets.
            </p>
          </div>

          <div className="p-6 rounded-lg backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-orange-500/50 transition-all">
            <div className="text-2xl mb-2">🚀</div>
            <h3 className="text-lg font-semibold text-white mb-2">Offline-First</h3>
            <p className="text-sm text-gray-400">
              PWA technology means Ghost Market works even if the domain is taken down.
            </p>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-32 px-4 py-6 rounded-lg backdrop-blur-md bg-white/5 border border-white/10 max-w-2xl text-center">
          <p className="text-sm text-gray-400">
            By using Ghost Market, you acknowledge the <Link href="/legal" className="text-cyan-400 hover:text-cyan-300">Master Decentralized Service Agreement</Link>.
            <br/>
            <span className="text-xs text-gray-500 mt-2 block">The platform holds no data. You hold all liability for your agreements.</span>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
