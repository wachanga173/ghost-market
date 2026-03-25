declare module 'next-pwa' {
  import type { NextConfig } from 'next';

  type PWAConfig = {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    fallbacks?: {
      document?: string;
      image?: string;
      audio?: string;
      video?: string;
      font?: string;
    };
    buildExcludes?: RegExp[];
  };

  const withPWA: (config?: PWAConfig) => (nextConfig: NextConfig) => NextConfig;

  export default withPWA;
}
