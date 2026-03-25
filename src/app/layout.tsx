import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ghost Market - Sovereign Freelance Marketplace",
  description: "Zero-database P2P freelance marketplace. Truly sovereign. Fully decentralized. Powered by Gun.js, Ethereum, and IPFS.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ghost Market",
  },
  formatDetection: {
    telephone: false,
  },
  keywords: [
    "freelance",
    "marketplace",
    "decentralized",
    "P2P",
    "Ethereum",
    "Web3",
    "Gun.js",
    "IPFS",
  ],
  authors: [{ name: "Ghost Market" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ghost-market.app",
    title: "Ghost Market - Sovereign Freelance Marketplace",
    description: "Zero-database P2P freelance marketplace powered by decentralized tech",
    siteName: "Ghost Market",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ghost Market" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://ipfs.io" />
        <link rel="dns-prefetch" href="https://infura-ipfs.io" />
      </head>
      <body className="min-h-full flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
        {children}
      </body>
    </html>
  );
}
