import type { NextConfig } from "next";
import withPWA from "next-pwa";

const withPWAConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: false,
  // Disable offline mode in development
  disable: process.env.NODE_ENV === "development",
  // Fallback pages
  fallbacks: {
    document: "/offline.html",
  },
  // Cache strategies
  buildExcludes: [/middleware-manifest.json$/],
});

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {},
  webpack: (config, { isServer }) => {
    // Fix for Gun.js and crypto libraries
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default withPWAConfig(nextConfig);
