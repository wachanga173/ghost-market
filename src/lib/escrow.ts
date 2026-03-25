/**
 * Ethereum Smart Contract Escrow & Payments
 * P2P payment handling with escrow smart contracts
 * All transactions signed and executed client-side
 */

import { ethers } from 'ethers';
import { getSigner } from './auth';

/**
 * Simple Escrow Contract ABI (minimal for demo)
 * In production, this would be a full smart contract
 */
const ESCROW_ABI = [
  'function depositEscrow(address freelancer, bytes32 jobId) payable',
  'function releaseEscrow(bytes32 jobId)',
  'function refundEscrow(bytes32 jobId)',
  'function getBalance(bytes32 jobId) view returns (uint256)',
];

/**
 * Payment structure
 */
export interface Payment {
  id: string;
  from: string;
  to: string;
  amount: number;
  currency: 'ETH' | 'USDC';
  jobId: string;
  status: 'pending' | 'completed' | 'refunded';
  timestamp: number;
  signature?: string;
}

/**
 * Create escrow payment for job
 */
export const createEscrowPayment = async (
  freelancerAddress: string,
  jobId: string,
  amountInEth: number,
  escrowContractAddress: string
): Promise<{ transactionHash: string; paymentId: string } | null> => {
  try {
    const signer = await getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    // Create contract instance
    const escrowContract = new ethers.Contract(
      escrowContractAddress,
      ESCROW_ABI,
      signer
    );

    // Send ETH and call escrow deposit
    const tx = await escrowContract.depositEscrow(freelancerAddress, jobId, {
      value: ethers.parseEther(amountInEth.toString()),
    });

    console.log('Escrow tx sent:', tx.hash);

    // Wait for confirmation
    const receipt = await tx.wait();
    if (!receipt) {
      throw new Error('Escrow deposit receipt not found');
    }
    console.log('Escrow deposit confirmed:', receipt.hash);

    return {
      transactionHash: receipt.hash,
      paymentId: jobId,
    };
  } catch (error) {
    console.error('Error creating escrow payment:', error);
    return null;
  }
};

/**
 * Release escrow payment upon job completion
 */
export const releaseEscrowPayment = async (
  jobId: string,
  escrowContractAddress: string
): Promise<string | null> => {
  try {
    const signer = await getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    const escrowContract = new ethers.Contract(
      escrowContractAddress,
      ESCROW_ABI,
      signer
    );

    const tx = await escrowContract.releaseEscrow(jobId);
    const receipt = await tx.wait();
    if (!receipt) {
      throw new Error('Escrow release receipt not found');
    }

    console.log('Escrow released:', receipt.hash);
    return receipt.hash;
  } catch (error) {
    console.error('Error releasing escrow:', error);
    return null;
  }
};

/**
 * Refund escrow payment (job cancelled)
 */
export const refundEscrowPayment = async (
  jobId: string,
  escrowContractAddress: string
): Promise<string | null> => {
  try {
    const signer = await getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    const escrowContract = new ethers.Contract(
      escrowContractAddress,
      ESCROW_ABI,
      signer
    );

    const tx = await escrowContract.refundEscrow(jobId);
    const receipt = await tx.wait();
    if (!receipt) {
      throw new Error('Escrow refund receipt not found');
    }

    console.log('Escrow refunded:', receipt.hash);
    return receipt.hash;
  } catch (error) {
    console.error('Error refunding escrow:', error);
    return null;
  }
};

/**
 * Check balance held in escrow
 */
export const checkEscrowBalance = async (
  jobId: string,
  escrowContractAddress: string
): Promise<string | null> => {
  try {
    if (!window.ethereum) {
      return null;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const escrowContract = new ethers.Contract(
      escrowContractAddress,
      ESCROW_ABI,
      provider
    );

    const balance = await escrowContract.getBalance(jobId);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error checking escrow balance:', error);
    return null;
  }
};

/**
 * Direct P2P ETH transfer (for tipping or direct payments)
 */
export const sendDirectPayment = async (
  toAddress: string,
  amountInEth: number
): Promise<string | null> => {
  try {
    const signer = await getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    const tx = await signer.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(amountInEth.toString()),
    });

    const receipt = await tx.wait();
    if (!receipt) {
      throw new Error('Direct payment receipt not found');
    }
    console.log('Direct payment sent:', receipt.hash);

    return receipt.hash;
  } catch (error) {
    console.error('Error sending direct payment:', error);
    return null;
  }
};

/**
 * Sign payment authorization (without sending immediately)
 */
export const signPaymentAuthorization = async (
  paymentData: Omit<Payment, 'signature'>
): Promise<string | null> => {
  try {
    const signer = await getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    const messageHash = ethers.solidityPackedKeccak256(
      ['string', 'string', 'string', 'uint256', 'string', 'string', 'uint256'],
      [
        paymentData.id,
        paymentData.from,
        paymentData.to,
        ethers.parseEther(paymentData.amount.toString()),
        paymentData.currency,
        paymentData.jobId,
        paymentData.timestamp,
      ]
    );

    const signature = await signer.signMessage(
      ethers.getBytes(messageHash)
    );

    return signature;
  } catch (error) {
    console.error('Error signing payment authorization:', error);
    return null;
  }
};

/**
 * Get transaction details
 */
export const getTransactionDetails = async (
  transactionHash: string
): Promise<ethers.TransactionResponse | null> => {
  try {
    if (!window.ethereum) {
      return null;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const tx = await provider.getTransaction(transactionHash);

    return tx;
  } catch (error) {
    console.error('Error getting transaction details:', error);
    return null;
  }
};

/**
 * Get transaction receipt (confirmation status)
 */
export const getTransactionReceipt = async (
  transactionHash: string
): Promise<ethers.TransactionReceipt | null> => {
  try {
    if (!window.ethereum) {
      return null;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const receipt = await provider.getTransactionReceipt(transactionHash);

    return receipt;
  } catch (error) {
    console.error('Error getting transaction receipt:', error);
    return null;
  }
};

export default {
  createEscrowPayment,
  releaseEscrowPayment,
  refundEscrowPayment,
  checkEscrowBalance,
  sendDirectPayment,
  signPaymentAuthorization,
  getTransactionDetails,
  getTransactionReceipt,
};
