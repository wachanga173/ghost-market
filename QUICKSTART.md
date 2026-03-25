# 🚀 Ghost Market - Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies

```bash
cd "c:\Users\Peter\visual code\ghost-market"
npm install
```

This installs all required packages including:
- `next` & `react` (framework)
- `gun` (P2P database)
- `ipfs-http-client` (distributed storage)
- `ethers` (blockchain)
- `siwe` (wallet auth)
- `next-pwa` (offline support)

### Step 2: Configure Environment

```bash
# Copy the template
cp .env.local.example .env.local

# Edit .env.local with your values
```

**Required Keys:**
```
NEXT_PUBLIC_SUPABASE_URL=https://rtvumsbcqxnqboosytgn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here

NEXT_PUBLIC_INFURA_API_KEY=your-infura-key
NEXT_PUBLIC_ALCHEMY_API_KEY=your-alchemy-key

NEXT_PUBLIC_ETHEREUM_CHAIN_ID=1
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/your-key
```

**To Get Keys:**
- **Supabase**: Go to https://supabase.com/dashboard/project/rtvumsbcqxnqboosytgn/settings/api
- **Infura**: https://app.infura.io/products/ethereum
- **Alchemy**: https://dashboard.alchemy.com/?r=eyJkaXJlY3RvcnkiOiAicK9kYXNoYm9hcmQvIn0%3D

### Step 3: Start Development Server

```bash
npm run dev
```

Server runs at: `http://localhost:3000`

### Step 4: Connect Wallet

1. Open http://localhost:3000 in browser
2. Install MetaMask if needed: https://metamask.io
3. Click **"Connect Wallet"** button on hero
4. Approve in MetaMask
5. You're logged in! (No password needed)

---

## 🎯 Testing Core Features

### 1. Test Hero Page

```
✓ Hero displays with glassmorphism design
✓ [FIND TALENT] and [FIND WORK] buttons visible
✓ Wallet address shows after connecting
✓ Balance displays (if on Ethereum mainnet)
```

### 2. Test Marketplace Feed

```
Navigate to: /marketplace

✓ Connects to Gun.js network (may show loading)
✓ Loads recent jobs from P2P peers
✓ Filter by skills
✓ Sort by newest/budget
✓ Each job shows: title, budget, skills, proposals
```

### 3. Test Legal Page

```
Navigate to: /legal

✓ Master Decentralized Service Agreement
✓ Sections covering:
  - Platform Definition & Data Sovereignty
  - User Sovereignty & Identity
  - P2P Liability Waivers
  - Smart Contract Risk Disclaimer
  - Governing Law (all 10 sections)
```

### 4. Test PWA Offline Mode

```
1. Open DevTools (F12)
2. Go to Application → Service Workers
3. Check "Offline" checkbox
4. Refresh page
5. App should load from cache (if previously loaded)
```

---

## 📊 Architecture Quick Reference

```
┌──────────────────────────────────────┐
│      FRONTEND (Next.js + React)      │
│   Hero | Marketplace | Chat | Legal  │
└────────────────┬─────────────────────┘
                 │
┌────────────────▼─────────────────────┐
│   CLIENT-SIDE LIBRARIES               │
│  Gun.js │ IPFS │ Ethers │ SIWE      │
└────────────────┬─────────────────────┘
                 │
┌────────────────▼─────────────────────┐
│     DECENTRALIZED NETWORK             │
│  Gun Peers │ IPFS Nodes │ Ethereum   │
└──────────────────────────────────────┘
```

---

## 🔐 Security First

⚠️ **Never share your private key!**
⚠️ **Always use MetaMask or hardware wallet**
⚠️ **Keep Ethereum keys secure**

---

## 📚 Project Structure

```
Main Folders:
├── src/app/           → Pages (/marketplace, /legal, etc.)
├── src/components/    → React components (Hero, Chat, etc.)
├── src/lib/          → Core logic (Gun.js, IPFS, Auth, Escrow)
├── src/types/        → TypeScript definitions
└── public/           → PWA manifest, icons

Key Files:
├── ARCHITECTURE.md   → Technical deep-dive (READ THIS)
├── README.md         → Full documentation
├── next.config.ts    → PWA configuration
├── package.json      → Dependencies & scripts
└── .env.local        → Your API keys
```

---

## 🛠️ Common Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build optimized version
npm run start        # Start production server

# Maintenance
npm install          # Install/update packages
npm run lint         # Check code quality (if configured)
npm run test         # Run tests (if configured)
```

---

## 🐛 Troubleshooting

### **"Connection refused" / Gun.js not connecting**
```
Gun.js needs time to peer discovery (5-10 seconds)
Check browser console for logs
Refresh page if nothing loads
```

### **"MetaMask not detected"**
```
Install MetaMask: https://metamask.io
Install on Ethereum mainnet
Add funds for testing (faucet: https://fauceteth.com)
```

### **"IPFS gateway timeout"**
```
IPFS nodes may be slow
Wait 10-20 seconds for content to load
Check IPFS gateway at: https://ipfs.io/ipfs/QmTest
```

### **"Smart contract error"**
```
Contract may not be deployed on your network
Check NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS in .env.local
Deploy contract to testnet first: npx hardhat run scripts/deploy.js
```

### **"Service Worker not installing"**
```
PWA only works on HTTPS or localhost
Check DevTools → Application → Service Workers
Clear cache and hard refresh (Ctrl+Shift+R)
```

---

## 📖 Next Steps

After you get it running:

1. **Explore the Code**: Read `ARCHITECTURE.md` for technical overview
2. **Post a Test Job**: Use Gun.js to broadcast sample job
3. **Test Chat**: Send encrypted P2P message to another wallet
4. **Review Legal**: Understand the decentralized service agreement
5. **Build Features**: Add user dashboard, payment UI, etc.

---

## 🎓 Learning Resources

- **Gun.js Docs**: https://gun.eco
- **IPFS Guide**: https://docs.ipfs.io/
- **Ethers.js API**: https://docs.ethers.org/
- **SIWE Standard**: https://login.xyz/
- **Web3 Security**: https://secureum.substack.com/

---

## ❓ Questions?

Check the following:
1. **ARCHITECTURE.md** - Technical documentation
2. **README.md** - General overview
3. **src/lib/*.ts** - Source code comments
4. **GitHub Issues** - Community discussions

---

**Welcome to the future of decentralized freelance work.** 🚀
