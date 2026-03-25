# Ghost Market - Complete File Reference

## 📍 Key Documentation

| File | Purpose |
|------|---------|
| **README.md** | Overview, features, setup, resources |
| **ARCHITECTURE.md** | Technical deep-dive on P2P architecture |
| **QUICKSTART.md** | 5-minute setup & testing guide |
| **.env.local.example** | Environment configuration template |

---

## 🎨 Frontend Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **Hero** | `src/components/Hero.tsx` | Landing page with wallet connect |
| **MarketplaceFeed** | `src/components/MarketplaceFeed.tsx` | Live job listings from Gun.js |
| **P2PChat** | `src/components/P2PChat.tsx` | End-to-end encrypted messaging |

---

## 📄 Pages (Routes)

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/app/page.tsx` | Hero landing page |
| `/marketplace` | `src/app/marketplace/page.tsx` | Marketplace feed |
| `/legal` | `src/app/legal/page.tsx` | Service agreement |
| `*` | `src/app/layout.tsx` | Root layout (PWA config) |

---

## 🛠️ Core Libraries (Backend Logic)

| Module | Location | Exports |
|--------|----------|---------|
| **Gun Wrapper** | `src/lib/gun.ts` | `gun`, `postJobToNetwork()`, `subscribeToJobs()`, `sendEncryptedMessage()` |
| **IPFS Client** | `src/lib/ipfs.ts` | `uploadToIPFS()`, `downloadFromIPFS()`, `uploadJobDescription()` |
| **Ethereum Auth** | `src/lib/auth.ts` | `connectWallet()`, `authenticateWithSIWE()`, `getWalletBalance()` |
| **Smart Contracts** | `src/lib/escrow.ts` | `createEscrowPayment()`, `releaseEscrowPayment()`, `sendDirectPayment()` |
| **P2P Chat** | `src/lib/p2p-chat.ts` | `createConversation()`, `sendEncryptedMessage()`, `subscribeToConversation()` |
| **Supabase Storage** | `src/lib/supabase-storage.ts` | `uploadMediaToSupabase()`, `getMediaURL()`, `getHeroImage()` |

---

## 📦 Type Definitions

| File | Location | Contains |
|------|----------|----------|
| **Global Types** | `src/types/index.ts` | `UserProfile`, `Job`, `Message`, `Conversation`, `AppState`, etc. |

---

## ⚙️ Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js config + PWA setup |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.ts` | Tailwind CSS customization |
| `postcss.config.mjs` | PostCSS plugins |
| `package.json` | Dependencies & scripts |
| `public/manifest.json` | PWA manifest |
| `public/icon-*.png` | PWA icons (create these) |

---

## 🔑 Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

# Ethereum / Infura / Alchemy
NEXT_PUBLIC_INFURA_API_KEY
NEXT_PUBLIC_ALCHEMY_API_KEY
NEXT_PUBLIC_ETHEREUM_CHAIN_ID
NEXT_PUBLIC_ETHEREUM_RPC_URL

# Smart Contracts
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS
NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS

# Gun.js Peers
NEXT_PUBLIC_GUN_PEERS_1
NEXT_PUBLIC_GUN_PEERS_2
NEXT_PUBLIC_GUN_PEERS_3

# Feature Flags
NEXT_PUBLIC_ENABLE_PWA
NEXT_PUBLIC_ENABLE_NOTIFICATIONS
NEXT_PUBLIC_ENABLE_OFFLINE_MODE
```

---

## 📋 Data Structures

### Job (stored on Gun.js + IPFS)
```typescript
{
  id: string              // UUID
  title: string           // Job title
  description: string     // IPFS CID (link to full text)
  budget: {
    amount: number        // e.g., 500
    currency: string      // "ETH" | "USDC"
    paymentType: string   // "escrow" | "milestone" | "hourly" | "fixed"
  }
  skills: string[]        // ["React", "TypeScript"]
  postedBy: string        // Wallet address (0x...)
  postedAt: number        // Timestamp
  status: string          // "open" | "in-progress" | "completed" | "cancelled"
  metadata: {
    ipfsHash: string      // Full content on IPFS
    views: number
    proposals: number
  }
}
```

### Message (encrypted on Gun.js)
```typescript
{
  id: string              // UUID
  conversationId: string  // Links to conversation
  from: string            // Sender wallet
  to: string              // Recipient wallet
  content: string         // Encrypted with Gun.js SEA
  contentEncrypted: true
  timestamp: number
  read: boolean
}
```

### User Profile (on Gun.js + IPFS)
```typescript
{
  walletAddress: string   // Ethereum address
  displayName: string
  bio: string
  avatar: string          // IPFS CID
  portfolio: PortfolioItem[]
  skills: Skill[]
  rating: {
    average: number       // 1-5 stars
    count: number
  }
  createdAt: number
}
```

---

## 🚀 Development Workflow

### 1. Create a New Component
```bash
# Create file in src/components/MyComponent.tsx
'use client';  // Mark as client component
import { /* dependencies */ } from '@/lib/*'

export default function MyComponent() {
  // Your code here
}
```

### 2. Use Gun.js Data
```typescript
import { subscribeToJobs, postJobToNetwork } from '@/lib/gun';

// Subscribe to real-time updates
const unsubscribe = subscribeToJobs((jobs) => {
  setJobs(Object.values(jobs));
});

// Post new job
await postJobToNetwork({
  title: "My Job",
  description: "ipfsHash",
  // ...
});
```

### 3. Handle Wallet Authentication
```typescript
import { authenticateWithSIWE, getCurrentAddress } from '@/lib/auth';

const auth = await authenticateWithSIWE();
if (auth) {
  // User is authenticated with wallet
  // auth.address is their Ethereum address
}
```

### 4. Upload to IPFS
```typescript
import { uploadToIPFS, uploadJobDescription } from '@/lib/ipfs';

const cid = await uploadJobDescription({
  title: "Job",
  description: "...",
});
// cid = "QmXxxxYyyyy"
```

### 5. Handle Payments
```typescript
import { createEscrowPayment, releaseEscrowPayment } from '@/lib/escrow';

// Deposit funds
await createEscrowPayment(
  freelancerAddress,
  jobId,
  5.0, // ETH amount
  contractAddress
);

// Release funds
await releaseEscrowPayment(jobId, contractAddress);
```

---

## 🧪 Testing Checklist

- [ ] Wallet connects with MetaMask
- [ ] Hero page loads with glassmorphism UI
- [ ] Marketplace shows jobs from Gun.js
- [ ] Can filter jobs by skills
- [ ] Legal page has full service agreement
- [ ] P2P Chat UI renders (placeholder)
- [ ] PWA service worker registers
- [ ] Offline mode accessible (F12 → Application → check offline)
- [ ] Environment variables loaded correctly
- [ ] No console errors on load

---

## 📈 Deployment Checklist

Before deploying to production:

- [ ] Update all `NEXT_PUBLIC_*` variables in `.env.local`
- [ ] Deploy smart contracts to mainnet
- [ ] Test with real Ethereum mainnet
- [ ] Add real PWA icons (`public/icon-*.png`)
- [ ] Update domain in manifest.json
- [ ] Enable HTTPS (required for PWA)
- [ ] Test on mobile (PWA install)
- [ ] Review legal agreement with lawyer
- [ ] Setup monitoring/error tracking
- [ ] Document runbook for updates

---

## 🔗 External Dependencies

| Service | Purpose | URL |
|---------|---------|-----|
| **Supabase** | Media file storage | https://supabase.com |
| **Gun.js Peers** | P2P network nodes | https://gun.eco |
| **IPFS Gateway** | Content delivery | https://ipfs.io |
| **Ethereum RPC** | Blockchain access | Infura or Alchemy |
| **MetaMask** | Wallet provider | https://metamask.io |

---

## 🎯 Quick Navigation

```
Need to...?

1. Add a new page
   → Create file in src/app/{pageName}/page.tsx

2. Create a new component
   → Create file in src/components/{ComponentName}.tsx

3. Add library logic
   → Create/edit src/lib/{module}.ts

4. Change styles
   → Edit src/app/globals.css or add inline Tailwind classes

5. Add environment variables
   → Edit .env.local (don't commit!)

6. Deploy to production
   → Follow Deployment Checklist above
```

---

**Ghost Market: Zero Database. Full Sovereignty. 🚀**
