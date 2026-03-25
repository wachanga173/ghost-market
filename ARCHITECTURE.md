# Ghost Market P2P Architecture

## System Overview

Ghost Market is engineered as a **zero-database freelance marketplace** using fully decentralized infrastructure. Every component operates independently without centralized control.

```
┌─────────────────────────────────────────────────────────────┐
│                    GHOST MARKET LAYERS                      │
├─────────────────────────────────────────────────────────────┤
│ 1. PRESENTATION (Next.js React Components + PWA)            │
├─────────────────────────────────────────────────────────────┤
│ 2. CLIENT-SIDE LOGIC (Auth, Jobs, Chat, Payments)           │
├─────────────────────────────────────────────────────────────┤
│ 3. DECENTRALIZED PROTOCOLS (Gun.js, IPFS, Ethereum SEA)     │
├─────────────────────────────────────────────────────────────┤
│ 4. PEER NETWORK (Gun Nodes, IPFS Gateways, Blockchain RPC) │
└─────────────────────────────────────────────────────────────┘
```

## 1. Identity Layer (SIWE + Ethereum)

### Account Management
- **No passwords or emails**
- **Wallet = Identity**: Your Ethereum address is your permanent, immutable user ID
- **Sign-In With Ethereum (SIWE)**: Users sign a time-limited message to prove wallet ownership
- **No account recovery**: If wallet is lost, identity is lost. Use hardware wallets.

### Flow
```
User Visits → Connect MetaMask → Sign SIWE Message → Wallet Verified
                                    ↓
                        Gun.js receives signed proof
                        Publishes to mesh network
                        ↓
                        Profile data stored on IPFS
                        User can now post jobs/proposals
```

## 2. Data Layer (Gun.js + IPFS)

### Gun.js (Decentralized Graph Database)
**Purpose**: Real-time synchronization of user-generated content across a P2P mesh

**Data Stored on Gun.js**:
- Job metadata (title, budget, skills, status)
- User profiles (name, rating, skills list)
- Conversation metadata (participants, timestamps)
- Proposal submissions
- Review/rating records

**Architecture**:
```
User A (Gun Peer)  ←→  Gun Network  ←→  User B (Gun Peer)
   ↓                                          ↓
Local Gun Cache                        Local Gun Cache
   ↓                                          ↓
Syncs automatically                  Syncs automatically
   ↓                                          ↓
Job Posted → Broadcast to peers → Peers update local cache → Other users see job
```

**Key Properties**:
- Real-time updates (latency: 1-5 seconds)
- Offline-first (works with local cache)
- No single point of failure
- No data loss if one peer goes down

### IPFS (Content-Addressable Storage)
**Purpose**: Immutable, tamper-proof storage of large job descriptions and portfolios

**Data Stored on IPFS**:
- Full job descriptions (detailed markdown)
- Portfolio work samples
- Contract templates
- Dispute evidence
- Any file > 1MB

**Architecture**:
```
File Upload → Hashed with SHA-256 → Returns CID (Content ID) → 
Published to IPFS → Pinned on multiple gateways → 
Accessible via ipfs.io/ipfs/{CID}
```

**Flow**:
```
Job Description:
{
  "title": "Build React Dashboard",
  "details": [Long markdown...],
  "requirements": [...]
}
    ↓
Uploaded to IPFS
    ↓
CID: QmXxxxxxYyyyyy
    ↓
Gun.js stores reference:
{
  "id": "job-123",
  "title": "Build React Dashboard",
  "ipfsHash": "QmXxxxxxYyyyyy"  ← Link to full content
}
```

## 3. Messaging Layer (Gun.js SEA Encryption)

### End-to-End Encrypted P2P Chat
**Technology**: Gun.js SEA (Security, Encryption, and Authorization)

**How It Works**:
```
User A Sends Message
    ↓
    └─→ User A's gun.user() creates SEA encryption key
    └─→ Retrieves User B's public key from Gun.js
    └─→ Encrypts message with User B's public key
    └─→ Stores encrypted message on Gun.js
    ↓
User B Receives
    ↓
    └─→ Retrieves encrypted message from Gun.js
    └─→ Decrypts with own private key (only B can decrypt)
    └─→ Message readable only by User B
```

**Security Properties**:
- Messages never stored in plaintext
- Only recipient can decrypt
- No central server ever sees plaintext
- Keys exist only in user's browser memory

## 4. Payment Layer (Ethereum Smart Contracts)

### Escrow & Settlement

**Process**:
```
1. Client Posts Job & Offers Payment
   ├─→ Creates smart contract with freelancer + job ID + amount
   └─→ Deposits ETH/USDC to contract

2. Freelancer Accepted
   ├─→ Gun.js notifies freelancer in real-time
   └─→ Both parties can negotiate milestones

3. Work Completed
   ├─→ Client verifies work
   ├─→ Calls contract.releaseEscrow()
   └─→ Freelancer receives funds on-chain

4. Alternative: Refund
   ├─→ Dispute during work
   ├─→ Contract.refundEscrow() (requires both signatures)
   └─→ Client recovers funds
```

**Contract Interface**:
```solidity
interface Escrow {
  function depositEscrow(
    address freelancer, 
    bytes32 jobId
  ) payable;
  
  function releaseEscrow(bytes32 jobId);
  
  function refundEscrow(bytes32 jobId);
  
  function getBalance(bytes32 jobId) 
    view returns (uint256);
}
```

## 5. Storage Layer (Supabase - Media Only)

### Constraints
- **NO application logic**
- **NO databases**
- **ONLY static file hosting**

**What's Stored**:
- Job cover images
- User profile pictures
- Portfolio thumbnails
- Demo videos
- Miscellaneous media

**Bucket Structure**:
```
job-media/
├── hero-images/
│   └── heroimage.png
├── job-images/
│   └── {jobId}-{timestamp}.png
├── portfolio/
│   └── {portfolioId}-{timestamp}.jpg
└── documents/
    └── {contractId}-{timestamp}.pdf
```

## 6. Authentication & Session Flow

### Initial Setup
```
User Visits ghost-market.app
    ↓
    ├─→ PWA Service Worker caches app shell
    ├─→ Initializes Gun.js peer
    └─→ Connects to public IPFS gateway
    ↓
User Clicks "Connect Wallet"
    ├─→ Prompts MetaMask/WalletConnect
    ├─→ Generates SIWE message
    ├─→ User signs message
    └─→ Recovery: signature verified client-side
    ↓
User Logged In
    ├─→ Wallet address = username
    ├─→ Session persisted in localStorage
    └─→ Gun.js peer syncs with network
```

### Session Persistence
```
App Reload
    ↓
    ├─→ Service Worker loads cached app shell instantly
    ├─→ localStorage retrieves wallet address
    ├─→ Gun.js cache loaded from IndexedDB
    ├─→ User sees previous state (messages, jobs)
    └─→ Background: Syncs with network for updates
```

## 7. PWA Offline-First Architecture

### Service Worker Strategy
```
Network Request
    ↓
    ├─→ If online: Fetch from network first
    │            ├─→ Cache response
    │            └─→ Return to page
    │
    └─→ If offline: Return from cache
                ├─→ If available: Use cached response
                └─→ If missing: Show offline placeholder
```

### Cached Assets
- All React components (JS bundles)
- CSS and fonts
- Images and media
- Manifest.json

### Sync After Reconnect
```
App Reconnects to network
    ↓
    ├─→ Service Worker detects online status
    ├─→ Triggers background sync
    ├─→ Merges local changes with network
    ├─→ Resolves conflicts (Gun.js CRDTs handle this)
    └─→ Updates UI with latest data
```

## Data Flow Examples

### Example 1: Posting a Job

```
Frontend (Hero.tsx)
    ↓
User fills form:
  - Title: "Build API"
  - Description: "Create REST API..."
  - Budget: 500 ETH
  - Skills: ["API", "Node.js"]
    ↓
onClick(postJob)
    ├─→ Upload description to IPFS
    │   ├─→ IPFS returns CID: QmXxxx
    │   └─→ Promise resolved
    │
    ├─→ Call gun.postJobToNetwork()
    │   ├─→ Create job object with IPFS CID
    │   ├─→ Add wallet address as postedBy
    │   ├─→ Broadcast to Gun.js peers
    │   └─→ Peers propagate to network
    │
    └─→ User sees "Job Posted!"
    ├─→ Within 1-5 seconds
    ├─→ Other users' feeds update via Gun.js subscription
    └─→ Job appears live on marketplace
```

### Example 2: Sending an Encrypted Message

```
Frontend (P2PChat.tsx)
    ↓
User types message: "When can you start?"
    ↓
onClick(sendMessage)
    ├─→ gun.user() gets sender's SEA pair
    ├─→ Retrieves recipient's public key from Gun.js
    ├─→ Encrypts message with SEA
    │   └─→ Message unreadable without recipient's private key
    │
    ├─→ Stores encryption on Gun.js
    │   ├─→ Conversation thread updated
    │   └─→ Notification sent to recipient
    │
    └─→ Recipient receives
        ├─→ Gun.js subscription fires
        ├─→ Message loaded in browser
        ├─→ Decrypted with recipient's private key (stored in memory)
        └─→ User sees: "When can you start?"
```

### Example 3: Payment Release

```
Frontend (EscrowComponent.tsx)
    ↓
Client clicks "Release Payment"
    ├─→ Gets signer from wallet
    ├─→ Prepares contract transaction:
    │   └─→ contract.releaseEscrow(jobId)
    │
    ├─→ MetaMask prompts user to sign
    │   └─→ User approves in wallet UI
    │
    ├─→ Transaction sent to Ethereum mainnet
    │   ├─→ Miners include in block
    │   └─→ Confirmation received
    │
    ├─→ Transaction confirmed on-chain
    │   ├─→ Freelancer's address receives ETH
    │   └─→ Escrow contract balance = 0
    │
    ├─→ Gun.js updated with transaction hash
    │   └─→ Both parties are notified
    │
    └─→ Frontend displays "Payment Released ✓"
        └─→ Funds irreversibly transferred to freelancer
```

## Security Properties

### What's Protected
```
✓ User Identity (private keys never leave wallet)
✓ Messages (end-to-end encrypted with SEA)
✓ Transactions (signed client-side only)
✓ Reputation (immutable on Gun.js)
✓ Portfolio (tamper-proof on IPFS)
```

### What's Not Protected
```
✗ Wallet compromise (if private key stolen, identity compromised)
✗ Smart contract bugs (if contract has exploit, funds can be lost)
✗ User fraud (Ghost Market doesn't verify claims)
✗ Network attacks (large DDoS could slow Gun.js mesh)
```

## Scalability Considerations

### Throughput
- **Gun.js**: ~1,000 operations/second per peer
- **IPFS**: Dependent on gateway, typically 100-1000 req/s
- **Ethereum**: 12-15 transactions/second (network-wide)

### Storage
- **Gun.js**: All peers store all current data (broadcast model)
- **IPFS**: Distributed, only pinned content kept alive
- **Supabase**: Unlimited for media files

### Latency
- **Gun.js updates**: 1-5 seconds global propagation
- **IPFS retrieval**: 100-500ms (depends on peer availability)
- **Blockchain confirmation**: 12-15 seconds average

## Future Enhancements

1. **Sharding**: Split Gun.js network by geography/topic
2. **Layer 2**: Use Polygon for faster, cheaper payments
3. **IPFS Clustering**: Run dedicated IPFS cluster for app
4. **Filecoin Integration**: Incentivized content pinning
5. **DAO Governance**: Community votes on contract upgrades
6. **Reputation System**: On-chain scoring based on transactions
7. **Dispute DAO**: Decentralized arbitration for conflicts

---

**Built for absolute user sovereignty. Forever.**
