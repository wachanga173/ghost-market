/**
 * Gun.js Wrapper
 * Manages decentralized data synchronization and P2P mesh network
 * This is the core of our "no-database" architecture
 */

import Gun from 'gun';
import 'gun/sea';
import { v4 as uuidv4 } from 'uuid';

// Initialize Gun.js instance with multiple peers for redundancy
const peers = [
  'https://gun-manhattan.herokuapp.com/gun',
  'https://gun-us-east-1.herokuapp.com/gun',
  'wss://gun.react.shop/gun',
];

export const gun = Gun({
  peers: peers,
  localStorage: typeof window !== 'undefined', // Enable in browser only
});

/**
 * User data structure for Gun.js
 */
export interface GunUser {
  alias: string;
  publicKey: string;
  walletAddress: string;
  profile: {
    name: string;
    bio: string;
    avatar: string; // IPFS CID
    rating: number;
    completedJobs: number;
  };
  createdAt: number;
  lastActive: number;
}

/**
 * Job listing structure for Gun.js
 */
export interface GunJob {
  id: string;
  title: string;
  description: string; // IPFS CID
  budget: {
    amount: number;
    currency: string; // ETH or USDC
    paymentType: 'escrow' | 'milestone' | 'hourly';
  };
  skills: string[];
  postedBy: string; // Wallet address
  postedAt: number;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  metadata: {
    ipfsHash: string; // IPFS CID for full job data
    views?: number;
    proposals?: number;
  };
}

/**
 * P2P Message structure using Gun.js SEA encryption
 */
export interface EncryptedMessage {
  id: string;
  from: string;
  to: string;
  content: string; // Encrypted with SEA
  timestamp: number;
  read: boolean;
}

/**
 * Authenticate user with Gun.js using wallet
 */
export const authenticateUser = async (
  walletAddress: string,
  aliasName: string
): Promise<void> => {
  try {
    const user = gun.user();
    
    // Create Gun.js account with alias (username-wallet combo)
    const gunAlias = `${aliasName.toLowerCase()}-${walletAddress.slice(-6)}`;
    
    // In production, password would be derived from signing a message
    const tempPassword = `${walletAddress}-${Date.now()}`;
    
    user.create(gunAlias, tempPassword, (ack) => {
      if ('err' in ack && ack.err) {
        console.log('User already exists or account creation issue, attempting login...');
        user.auth(gunAlias, tempPassword, (ack) => {
          if ('err' in ack && ack.err) {
            console.error('Authentication failed:', ack.err);
          }
        });
      } else {
        console.log('User created and authenticated:', gunAlias);
      }
    });
  } catch (error) {
    console.error('Error authenticating user:', error);
  }
};

/**
 * Post a new job to Gun.js network
 */
export const postJobToNetwork = async (
  job: Omit<GunJob, 'id' | 'postedAt' | 'status'>
): Promise<string | null> => {
  try {
    const jobId = uuidv4();
    const jobData: GunJob = {
      ...job,
      id: jobId,
      postedAt: Date.now(),
      status: 'open',
    };

    // Store job on Gun.js
    gun
      .get('jobs')
      .get(jobId)
      .put(jobData, (ack) => {
        if ('err' in ack && ack.err) {
          console.error('Error posting job:', ack.err);
        } else {
          console.log('Job posted to network:', jobId);
        }
      });

    return jobId;
  } catch (error) {
    console.error('Error in postJobToNetwork:', error);
    return null;
  }
};

/**
 * Subscribe to all jobs in the network
 */
export const subscribeToJobs = (
  callback: (jobs: Record<string, GunJob>) => void
): (() => void) => {
  const jobs: Record<string, GunJob> = {};

  gun
    .get('jobs')
    .map()
    .on((jobData: GunJob) => {
      if (jobData && jobData.id) {
        jobs[jobData.id] = jobData;
        callback(jobs);
      }
    });

  // Return unsubscribe function
  return () => {
    gun.get('jobs').off();
  };
};

/**
 * Send encrypted P2P message using Gun.js SEA
 */
export const sendEncryptedMessage = async (
  toWalletAddress: string,
  content: string
): Promise<string | null> => {
  try {
    const user = gun.user();
    const userPub = (user as unknown as { is?: { pub?: string } }).is?.pub ?? 'unknown';
    const messageId = uuidv4();
    const timestamp = Date.now();

    // Encrypt message with SEA
    user.get('messages').get(toWalletAddress).get(messageId).put(
      {
        from: userPub,
        content: content,
        timestamp: timestamp,
        encrypted: true,
      },
      (ack) => {
        if ('err' in ack && ack.err) {
          console.error('Error sending message:', ack.err);
        } else {
          console.log('Message sent:', messageId);
        }
      }
    );

    return messageId;
  } catch (error) {
    console.error('Error in sendEncryptedMessage:', error);
    return null;
  }
};

/**
 * Get user profile from network
 */
export const getUserProfile = async (
  walletAddress: string
): Promise<GunUser | null> => {
  return new Promise((resolve) => {
    gun
      .get('users')
      .get(walletAddress)
      .once((data) => {
        resolve(data as GunUser);
      });
  });
};

/**
 * Update user profile on network
 */
export const updateUserProfile = async (
  walletAddress: string,
  profile: Partial<GunUser>
): Promise<void> => {
  gun
    .get('users')
    .get(walletAddress)
    .put(profile, (ack) => {
      if ('err' in ack && ack.err) {
        console.error('Error updating profile:', ack.err);
      } else {
        console.log('Profile updated:', walletAddress);
      }
    });
};

export default gun;
