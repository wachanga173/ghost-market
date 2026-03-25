# 👻 Ghost Market

**The Platform That Holds No Data**

A sovereign, decentralized peer-to-peer freelance marketplace built on zero centralized infrastructure. 

## 🎯 Core Architecture

Ghost Market operates on four distributed technology pillars:

### 1. **Gun.js** - Decentralized Graph Database
- Real-time mesh network for job listings, user profiles, and conversations
- Every peer is a node; no central point of failure
- Automatic data synchronization across all peers
- Used for: Jobs feed, user discovery, P2P messaging

### 2. **IPFS** - Immutable Content Storage
- Job descriptions, portfolios, and metadata stored as content-addressable hashes
- Once published, content becomes permanent and tamper-proof
- Public IPFS gateways ensure universal accessibility
- Used for: Job details, user profiles, contract documents

### 3. **Ethereum + SIWE** - Identity & Payments
- Your Ethereum wallet is your singular identity
- Sign-In With Ethereum (SIWE) replaces traditional auth
- Smart contract escrow for milestone-based payments
- All transactions signed client-side only

### 4. **Supabase Static Storage** - Media Only
- STRICTLY limited to image/video files
- NO application logic or user databases
- Bucket-based access only
- Used for: Job images, portfolio thumbnails, hero images

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Ethereum wallet (MetaMask, WalletConnect, etc.)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ghost-market.git
cd ghost-market

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Fill in your Supabase and Ethereum credentials
# See .env.local.example for details
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will:
- Connect to Gun.js peers automatically
- Attempt to find your Ethereum wallet
- Load jobs from the p2p network
- Cache everything for offline use (PWA)

### Production Build

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
ghost-market/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Hero landing page
│   │   ├── marketplace/
│   │   │   └── page.tsx             # Marketplace feed
│   │   ├── legal/
│   │   │   └── page.tsx             # Master Service Agreement
│   │   └── layout.tsx               # PWA meta tags & layout
│   ├── components/
│   │   ├── Hero.tsx                 # Hero section with wallet connect
│   │   └── MarketplaceFeed.tsx      # Gun.js jobs feed
│   ├── lib/
│   │   ├── gun.ts                   # Gun.js wrapper & data structures
│   │   ├── ipfs.ts                  # IPFS client wrapper
│   │   ├── auth.ts                  # SIWE & wallet authentication
│   │   ├── supabase-storage.ts      # Supabase file storage
│   │   └── escrow.ts                # Ethereum escrow & payments
│   ├── types/
│   │   └── index.ts                 # Global type definitions
│   └── styles/
│       └── globals.css              # Tailwind + custom styles
├── public/
│   ├── manifest.json                # PWA manifest
│   └── icons/                       # PWA icons
├── next.config.ts                   # Next.js + PWA config
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts               # Tailwind CSS config
├── postcss.config.mjs               # PostCSS config
└── package.json                     # Dependencies
```

## 🏗️ Key Features Implemented

### ✅ Completed
- [x] Next.js 14 with TypeScript & App Router
- [x] Gun.js wrapper for decentralized data sync
- [x] IPFS client integration for content storage
- [x] Ethereum/SIWE authentication (wallet-only)
- [x] Supabase static file storage integration
- [x] Smart contract escrow module
- [x] PWA configuration with offline support
- [x] Corporate-dark glassmorphism UI
- [x] Hero landing page with wallet connect
- [x] Marketplace feed (live Gun.js jobs)
- [x] Legal master service agreement (comprehensive)
- [x] Type definitions for entire ecosystem

### 🔄 In Progress
- [ ] P2P chat with Gun.js SEA encryption
- [ ] Job posting & proposal flow
- [ ] User profiles & portfolio management
- [ ] Payment & escrow release workflows
- [ ] Dispute resolution UI
- [ ] Notifications & real-time updates

### 📋 Roadmap
- [ ] Mobile app (React Native using same libs)
- [ ] USDC/stablecoin support
- [ ] Multi-chain support (Polygon, Arbitrum)
- [ ] Built-in DAO governance
- [ ] Content moderation suggestions (ML)
- [ ] Reputation & review system
- [ ] Advanced search & filtering
- [ ] Job templates & automation

## 🔑 How It Works

### 1. User Registration (No Database)
```
User → MetaMask Connect 
     → Sign Message (SIWE)
     → User data published to Gun.js + IPFS
```

### 2. Post a Job
```
User → Fill job form
     → Upload description to IPFS (get CID)
     → Broadcast job data on Gun.js mesh
     → Job appears in marketplace within 1-5 seconds (P2P sync)
```

### 3. Find Work
```
User → Browse Gun.js mesh
     → Load job descriptions from IPFS
     → Filter by skills/budget
     → Click job → Download full metadata from IPFS
```

### 4. Accept & Pay (Escrow)
```
Client → Select freelancer
       → Deposit funds to smart contract escrow
       → Freelancer notified on Gun.js
       → Upon completion, client releases funds via blockchain
```

### 5. P2P Messaging
```
User1 → Send encrypted message
      → Encrypted with Gun.js SEA
      → Delivered P2P (never touches server)
      → User2 receives & decrypts with SEA
```

## 🔐 Security & Privacy

- **No passwords.** Wallet authentication only.
- **No servers.** Gun.js peers sync without central control.
- **No data collection.** No analytics, no tracking, no profiling.
- **Encryption end-to-end.** Messages encrypted with Gun.js SEA.
- **Immutable records.** All content on IPFS is permanent.

## ⚠️ Disclaimers

**Ghost Market Holds Zero Data**
- No central database means no data breach risk for Ghost Market, but also no account recovery.
- If your wallet is compromised, your identity becomes compromised.
- Use a hardware wallet for production.

**Smart Contract Risk**
- Escrow contracts are executed on Ethereum mainnet.
- If there's a bug in the smart contract, funds may be lost permanently.
- Always audit contracts before production use.

**Decentralized = No Support**
- No email support, no Discord mods, no 24/7 helpline.
- The community handles support via GitHub issues and forum discussions.

**Legal Jurisdiction**
- Laws vary by jurisdiction. Check your local regulations before using for freelance work.
- This is not legal advice. Consult a lawyer.

## 🛠️ Development

### Connect to Local Gun.js Peer (Advanced)
```typescript
// Edit src/lib/gun.ts to use local peer
const peers = [
  'http://localhost:8765/gun',  // Local peer
];
```

### Test IPFS Upload Locally
```bash
# Start IPFS daemon
ipfs daemon

# Update src/lib/ipfs.ts
const ipfsClient = create({
  host: '127.0.0.1',
  port: 5001,
  protocol: 'http',
});
```

### Build PWA Locally
```bash
npm run build
npm run start

# Open browser DevTools → Application → Service Workers
# PWA should be registered and ready to cache
```

## 📚 Resources

- [Gun.js Docs](https://gun.eco/docs/)
- [IPFS Docs](https://docs.ipfs.io/)
- [Ethers.js Docs](https://docs.ethers.org/)
- [SIWE Docs](https://github.com/spruceid/siwe)
- [Next.js Docs](https://nextjs.org/docs)
- [PWA Guide](https://web.dev/progressive-web-apps/)

## 📝 License

Ghost Market is open-source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request
4. Include tests & documentation

## 📞 Community

- **GitHub Issues:** [Report bugs](https://github.com/yourusername/ghost-market/issues)
- **Discussions:** [Community forum](https://github.com/yourusername/ghost-market/discussions)
- **Twitter:** [@ghost_market](https://twitter.com)

---

**Built with ❤️ for a sovereign, decentralized future.**
