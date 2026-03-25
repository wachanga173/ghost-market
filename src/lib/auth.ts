/**
 * Ethereum & SIWE (Sign-In With Ethereum) Authentication
 * Replaces traditional username/password with wallet-based identity
 * All transactions signed client-side only
 */

import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

/**
 * Get or request Ethereum wallet connection
 */
export const connectWallet = async (): Promise<string | null> => {
  try {
    if (!window.ethereum) {
      alert('Please install an Ethereum wallet');
      return null;
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    return accounts[0]; // Return primary account
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return null;
  }
};

/**
 * Get signer from wallet for signing transactions
 */
export const getSigner = async (): Promise<ethers.Signer | null> => {
  try {
    if (!window.ethereum) {
      return null;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return signer;
  } catch (error) {
    console.error('Error getting signer:', error);
    return null;
  }
};

/**
 * Generate SIWE message for authentication
 */
export const generateSiweMessage = async (
  address: string,
  chainId: number = 1 // Ethereum mainnet
): Promise<SiweMessage | null> => {
  try {
    const message = new SiweMessage({
      domain: typeof window !== 'undefined' ? window.location.host : 'localhost',
      address: address,
      statement: 'Sign in to Ghost Market - Your Sovereign Freelance Marketplace',
      uri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
      version: '1',
      chainId: chainId,
      nonce: Math.random().toString(26).substring(2, 10), // Random nonce
      issuedAt: new Date().toISOString(),
      expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h expiry
    });

    return message;
  } catch (error) {
    console.error('Error generating SIWE message:', error);
    return null;
  }
};

/**
 * Sign SIWE message with wallet
 */
export const signSiweMessage = async (
  message: SiweMessage
): Promise<string | null> => {
  try {
    const signer = await getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    const signature = await signer.signMessage(message.prepareMessage());
    return signature;
  } catch (error) {
    console.error('Error signing SIWE message:', error);
    return null;
  }
};

/**
 * Verify SIWE signature (in production, verify on backend)
 */
export const verifySiweMessage = async (
  message: SiweMessage,
  signature: string
): Promise<boolean> => {
  try {
    const result = await message.verify({ signature });
    return Boolean(result?.success);
  } catch (error) {
    console.error('Error verifying SIWE message:', error);
    return false;
  }
};

/**
 * Full SIWE authentication flow
 */
export const authenticateWithSIWE = async (): Promise<{
  address: string;
  message: SiweMessage;
  signature: string;
} | null> => {
  try {
    // Connect wallet
    const address = await connectWallet();
    if (!address) {
      throw new Error('Wallet connection failed');
    }

    // Generate SIWE message
    const message = await generateSiweMessage(address);
    if (!message) {
      throw new Error('SIWE message generation failed');
    }

    // Sign message with wallet
    const signature = await signSiweMessage(message);
    if (!signature) {
      throw new Error('Message signing failed');
    }

    // Verify signature
    const isValid = await verifySiweMessage(message, signature);
    if (!isValid) {
      throw new Error('Signature verification failed');
    }

    console.log('SIWE Authentication successful:', address);

    return {
      address,
      message,
      signature,
    };
  } catch (error) {
    console.error('SIWE authentication error:', error);
    return null;
  }
};

/**
 * Get current wallet address
 */
export const getCurrentAddress = async (): Promise<string | null> => {
  try {
    if (!window.ethereum) {
      return null;
    }

    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });

    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Error getting current address:', error);
    return null;
  }
};

/**
 * Get wallet balance in ETH
 */
export const getWalletBalance = async (address: string): Promise<string | null> => {
  try {
    if (!window.ethereum) {
      return null;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return null;
  }
};

/**
 * Get network info
 */
export const getNetworkInfo = async (): Promise<{
  chainId: number;
  name: string;
} | null> => {
  try {
    if (!window.ethereum) {
      return null;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();

    return {
      chainId: Number(network.chainId),
      name: network.name,
    };
  } catch (error) {
    console.error('Error getting network info:', error);
    return null;
  }
};

export default {
  connectWallet,
  getSigner,
  generateSiweMessage,
  signSiweMessage,
  verifySiweMessage,
  authenticateWithSIWE,
  getCurrentAddress,
  getWalletBalance,
  getNetworkInfo,
};
