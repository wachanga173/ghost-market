/**
 * Global TypeScript Definitions
 * Types for the entire Ghost Market P2P ecosystem
 */

export interface UserProfile {
  id: string;
  walletAddress: string;
  displayName: string;
  bio: string;
  avatar: string; // IPFS CID
  portfolio: PortfolioItem[];
  skills: Skill[];
  rating: {
    average: number;
    count: number;
    reviews: Review[];
  };
  socialLinks?: {
    twitter?: string;
    github?: string;
    website?: string;
    linkedin?: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    emailNotifications: boolean;
  };
  createdAt: number;
  lastActive: number;
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'expert';
  endorsements: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // IPFS CID or Supabase URL
  link?: string;
  tags: string[];
  createdAt: number;
}

export interface Review {
  id: string;
  from: string;
  rating: number; // 1-5
  comment: string;
  jobId: string;
  createdAt: number;
}

export interface Job {
  id: string;
  title: string;
  description: string; // IPFS CID
  descriptionText?: string; // Cached plain text
  budget: {
    min: number;
    max: number;
    currency: 'ETH' | 'USDC';
  };
  paymentType: 'escrow' | 'milestone' | 'hourly' | 'fixed';
  skills: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  duration: 'hours' | 'days' | 'weeks' | 'months' | 'ongoing';
  scope: {
    durationEstimate?: number;
    hoursPerWeek?: number;
  };
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  postedBy: string; // Wallet address
  postedAt: number;
  deadline?: number;
  attachments: string[]; // IPFS CIDs
  metadata: {
    ipfsHash: string;
    views: number;
    proposals: number;
  };
  milestones?: Milestone[];
  escrowContract?: string;
  escrowStatus?: 'pending' | 'active' | 'completed' | 'refunded';
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: number;
  amount: number;
  status: 'pending' | 'completed' | 'approved' | 'rejected';
  deliverables?: string[]; // IPFS CIDs
}

export interface Proposal {
  id: string;
  jobId: string;
  freelancerId: string;
  bidAmount: number;
  currency: 'ETH' | 'USDC';
  coverLetter: string; // IPFS CID
  deliveryDays: number;
  hoursPerWeek?: number;
  availability: 'full-time' | 'part-time' | 'both';
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  submittedAt: number;
  attachments: string[]; // IPFS CIDs
}

export interface Message {
  id: string;
  conversationId: string;
  from: string;
  to: string;
  content: string;
  contentEncrypted: boolean; // SEA encryption
  attachments: string[]; // IPFS CIDs
  timestamp: number;
  read: boolean;
  reactions?: Record<string, string[]>; // emoji -> [userAddresses]
}

export interface Conversation {
  id: string;
  participants: string[]; // Wallet addresses
  lastMessage?: Message;
  lastMessageAt?: number;
  createdAt: number;
  jobId?: string; // Reference to associated job
  status: 'active' | 'archived' | 'blocked';
  encryptionKey?: string; // for end-to-end encryption
}

export interface Dispute {
  id: string;
  jobId: string;
  claimant: string;
  respondent: string;
  reason: string;
  evidence: string[]; // IPFS CIDs
  resolution?: {
    status: 'pending' | 'resolved' | 'escalated';
    outcome?: 'claimant-wins' | 'respondent-wins' | 'split';
    comment?: string;
  };
  createdAt: number;
}

export interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'tip';
  from: string;
  to: string;
  amount: number;
  currency: 'ETH' | 'USDC';
  jobId?: string;
  contractAddress?: string;
  transactionHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  blockNumber?: number;
  gasUsed?: string;
}

export interface AgreementTemplate {
  id: string;
  title: string;
  content: string; // IPFS CID (long-form document)
  version: string;
  createdAt: number;
  jurisdiction: string;
  acceptedBy: string[]; // Wallet addresses
  type: 'master-service-agreement' | 'work-for-hire' | 'contractor';
}

export interface NotificationSettings {
  messageNotifications: boolean;
  jobNotifications: boolean;
  bidNotifications: boolean;
  paymentNotifications: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
}

export interface SearchFilters {
  skills?: string[];
  budgetMin?: number;
  budgetMax?: number;
  duration?: string[];
  paymentType?: string[];
  experienceLevel?: string;
  sortBy?: 'newest' | 'budget' | 'deadline' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

export type NetworkStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

export interface AppState {
  user: UserProfile | null;
  wallet: {
    address: string | null;
    balance: string | null;
    network: string | null;
    status: NetworkStatus;
  };
  gun: {
    connected: boolean;
    peers: number;
  };
  ipfs: {
    connected: boolean;
    nodeId: string | null;
  };
}
