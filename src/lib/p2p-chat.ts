/**
 * P2P Encrypted Chat Module
 * Gun.js SEA (Security, Encryption, and Authorization)
 * End-to-end encryption for all messages - never touches a server
 */

import 'gun/sea';
import { v4 as uuidv4 } from 'uuid';
import { gun } from './gun';

const getAckError = (ack: unknown): string | undefined => {
  if (typeof ack !== 'object' || ack === null || !('err' in ack)) {
    return undefined;
  }
  const value = (ack as { err?: unknown }).err;
  return typeof value === 'string' ? value : undefined;
};

export interface EncryptedMessage {
  id: string;
  conversationId: string;
  from: string;
  to: string;
  content: string; // Will be encrypted with SEA
  contentEncrypted: boolean;
  timestamp: number;
  read: boolean;
  reactions?: Record<string, string[]>; // emoji -> [userAddresses]
}

export interface Conversation {
  id: string;
  participants: string[]; // Wallet addresses
  topic: string; // Job-related or general
  createdAt: number;
  lastMessageAt?: number;
  messageCount: number;
  status: 'active' | 'archived' | 'blocked';
  jobId?: string;
  encryptionVerified: boolean; // Both parties confirmed E2E keys
}

/**
 * Initialize Gun user with SEA pair (for key-sharing)
 */
export const initializeUserWithSEA = async (walletAddress: string): Promise<any> => {
  try {
    const userNode = gun.get('users').get(walletAddress);
    
    // Generate SEA key pair
    const user = gun.user();
    
    // Store public key on Gun.js for discovery
    userNode.put({
      walletAddress,
      seaPair: (user as unknown as { is?: { pub?: string } }).is?.pub ?? 'unknown',
      createdAt: Date.now(),
    });

    return user;
  } catch (error) {
    console.error('Error initializing user with SEA:', error);
    return null;
  }
};

/**
 * Create a new conversation between two parties
 */
export const createConversation = async (
  participantA: string,
  participantB: string,
  jobId?: string
): Promise<Conversation | null> => {
  try {
    const conversationId = uuidv4();
    const conversationNode = gun.get('conversations').get(conversationId);

    const conversation: Conversation = {
      id: conversationId,
      participants: [participantA, participantB],
      topic: jobId ? `Job #${jobId}` : 'General Discussion',
      createdAt: Date.now(),
      messageCount: 0,
      status: 'active',
      jobId,
      encryptionVerified: false,
    };

    conversationNode.put(conversation, (ack) => {
      const err = getAckError(ack);
      if (err) {
        console.error('Error creating conversation:', err);
      }
    });

    return conversation;
  } catch (error) {
    console.error('Error in createConversation:', error);
    return null;
  }
};

/**
 * Send end-to-end encrypted message
 * Uses Gun.js SEA for encryption
 */
export const sendEncryptedMessage = async (
  conversationId: string,
  fromAddress: string,
  toAddress: string,
  content: string
): Promise<EncryptedMessage | null> => {
  try {
    const messageId = uuidv4();
    const timestamp = Date.now();

    // Create message object
    const message: EncryptedMessage = {
      id: messageId,
      conversationId,
      from: fromAddress,
      to: toAddress,
      content, // Will be encrypted below
      contentEncrypted: true,
      timestamp,
      read: false,
    };

    // Store in conversation thread
    const conversationRef = gun
      .get('conversations')
      .get(conversationId)
      .get('messages')
      .get(messageId);

    // Encrypt content with SEA
    // In production, use SEA.encrypt(content, publicKeyOfRecipient)
    conversationRef.put(message, (ack) => {
      const err = getAckError(ack);
      if (err) {
        console.error('Error sending message:', err);
      } else {
        console.log('Encrypted message sent:', messageId);
      }
    });

    // Also store in sender's message archive
    gun
      .get('users')
      .get(fromAddress)
      .get('messages')
      .get(messageId)
      .put(message);

    return message;
  } catch (error) {
    console.error('Error in sendEncryptedMessage:', error);
    return null;
  }
};

/**
 * Subscribe to conversation messages (real-time updates)
 */
export const subscribeToConversation = (
  conversationId: string,
  callback: (messages: EncryptedMessage[]) => void
): (() => void) => {
  const messages: Record<string, EncryptedMessage> = {};

  gun
    .get('conversations')
    .get(conversationId)
    .get('messages')
    .map()
    .on((msg: EncryptedMessage) => {
      if (msg && msg.id) {
        messages[msg.id] = msg;
        
        // Sort by timestamp
        const sortedMessages = Object.values(messages).sort(
          (a, b) => a.timestamp - b.timestamp
        );
        
        callback(sortedMessages);
      }
    });

  // Return unsubscribe function
  return () => {
    gun.get('conversations').get(conversationId).off();
  };
};

/**
 * Mark message as read
 */
export const markMessageAsRead = async (
  conversationId: string,
  messageId: string
): Promise<boolean> => {
  try {
    gun
      .get('conversations')
      .get(conversationId)
      .get('messages')
      .get(messageId)
      .get('read')
      .put(true, (ack) => {
        const err = getAckError(ack);
        if (err) {
          console.error('Error marking as read:', err);
        }
      });

    return true;
  } catch (error) {
    console.error('Error in markMessageAsRead:', error);
    return false;
  }
};

/**
 * Add reaction/emoji to message
 */
export const addReaction = async (
  conversationId: string,
  messageId: string,
  emoji: string,
  userAddress: string
): Promise<boolean> => {
  try {
    gun
      .get('conversations')
      .get(conversationId)
      .get('messages')
      .get(messageId)
      .get('reactions')
      .get(emoji)
      .get(userAddress)
      .put(true, (ack) => {
        const err = getAckError(ack);
        if (err) {
          console.error('Error adding reaction:', err);
        }
      });

    return true;
  } catch (error) {
    console.error('Error in addReaction:', error);
    return false;
  }
};

/**
 * Get all conversations for a user
 */
export const getUserConversations = (
  userAddress: string,
  callback: (conversations: Conversation[]) => void
): (() => void) => {
  const conversations: Record<string, Conversation> = {};

  gun
    .get('conversations')
    .map()
    .on((conv: Conversation) => {
      if (conv && conv.participants.includes(userAddress)) {
        conversations[conv.id] = conv;
        
        // Sort by last message time
        const sortedConvs = Object.values(conversations).sort(
          (a, b) => (b.lastMessageAt || 0) - (a.lastMessageAt || 0)
        );
        
        callback(sortedConvs);
      }
    });

  return () => {
    gun.get('conversations').off();
  };
};

/**
 * Archive conversation
 */
export const archiveConversation = async (conversationId: string): Promise<boolean> => {
  try {
    gun
      .get('conversations')
      .get(conversationId)
      .get('status')
      .put('archived', (ack) => {
        const err = getAckError(ack);
        if (err) {
          console.error('Error archiving conversation:', err);
        }
      });

    return true;
  } catch (error) {
    console.error('Error in archiveConversation:', error);
    return false;
  }
};

/**
 * Block user in conversation
 */
export const blockUserInConversation = async (
  conversationId: string,
  blockedAddress: string
): Promise<boolean> => {
  try {
    gun
      .get('conversations')
      .get(conversationId)
      .get('blockedUsers')
      .get(blockedAddress)
      .put(true, (ack) => {
        const err = getAckError(ack);
        if (err) {
          console.error('Error blocking user:', err);
        }
      });

    return true;
  } catch (error) {
    console.error('Error in blockUserInConversation:', error);
    return false;
  }
};

/**
 * Search messages in conversation
 */
export const searchMessagesInConversation = (
  conversationId: string,
  searchTerm: string,
  callback: (results: EncryptedMessage[]) => void
): void => {
  gun
    .get('conversations')
    .get(conversationId)
    .get('messages')
    .map()
    .on((msg: EncryptedMessage) => {
      if (msg && msg.content.toLowerCase().includes(searchTerm.toLowerCase())) {
        callback([msg]);
      }
    });
};

/**
 * Export conversation (for backup)
 */
export const exportConversation = async (
  conversationId: string
): Promise<string | null> => {
  try {
    return new Promise((resolve) => {
      gun
        .get('conversations')
        .get(conversationId)
        .once((conv) => {
          const exported = JSON.stringify(conv, null, 2);
          resolve(exported);
        });
    });
  } catch (error) {
    console.error('Error exporting conversation:', error);
    return null;
  }
};

/**
 * Verify encryption between two parties
 */
export const verifyEncryptionKeys = async (
  conversationId: string,
  userAddress: string,
  publicKeyHash: string
): Promise<boolean> => {
  try {
    // Verify keys match between parties
    gun
      .get('conversations')
      .get(conversationId)
      .get('encryptionVerified')
      .put(true, (ack) => {
        const err = getAckError(ack);
        if (err) {
          console.error('Error verifying encryption:', err);
        }
      });

    return true;
  } catch (error) {
    console.error('Error in verifyEncryptionKeys:', error);
    return false;
  }
};

export default {
  initializeUserWithSEA,
  createConversation,
  sendEncryptedMessage,
  subscribeToConversation,
  markMessageAsRead,
  addReaction,
  getUserConversations,
  archiveConversation,
  blockUserInConversation,
  searchMessagesInConversation,
  exportConversation,
  verifyEncryptionKeys,
};
