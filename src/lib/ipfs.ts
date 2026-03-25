/**
 * IPFS Wrapper
 * Handles immutable, distributed content storage
 * Job descriptions, portfolios, and metadata stored here
 */

const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL || 'https://ipfs.io/ipfs/';
const IPFS_API = process.env.NEXT_PUBLIC_IPFS_API_URL || 'https://ipfs.infura.io:5001';

const toCid = (hash: string): string => hash.replace(/^ipfs:\/\//, '').trim();

/**
 * Upload content to IPFS and return CID
 */
export const uploadToIPFS = async (
  content: string | object,
  fileName: string = 'file'
): Promise<string | null> => {
  try {
    const data = typeof content === 'string' ? content : JSON.stringify(content);
    const formData = new FormData();
    formData.append('file', new Blob([data], { type: 'application/json' }), fileName);

    const res = await fetch(`${IPFS_API}/api/v0/add?pin=true`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`IPFS upload failed: ${res.status}`);
    }

    const text = await res.text();
    const parsed = JSON.parse(text);
    const cid = parsed?.Hash as string | undefined;

    if (!cid) {
      throw new Error('IPFS response did not include a CID hash');
    }

    return cid;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    return null;
  }
};

/**
 * Download content from IPFS using CID
 */
export const downloadFromIPFS = async (cid: string): Promise<string | null> => {
  try {
    const cleanCid = toCid(cid);
    const res = await fetch(`${IPFS_GATEWAY}${cleanCid}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`IPFS download failed: ${res.status}`);
    }

    return await res.text();
  } catch (error) {
    console.error('Error downloading from IPFS:', error);
    return null;
  }
};

/**
 * Upload job description to IPFS
 */
export const uploadJobDescription = async (jobData: {
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  budget: number;
  deadline?: number;
  attachments?: string[]; // IPFS CIDs
}): Promise<string | null> => {
  try {
    const jobJSON = {
      ...jobData,
      uploadedAt: Date.now(),
      version: '1.0',
    };

    const cid = await uploadToIPFS(jobJSON, `job-${Date.now()}.json`);
    return cid;
  } catch (error) {
    console.error('Error uploading job description:', error);
    return null;
  }
};

/**
 * Retrieve and parse job description from IPFS
 */
export const getJobDescriptionFromIPFS = async (
  cid: string
): Promise<any | null> => {
  try {
    const content = await downloadFromIPFS(cid);
    if (content) {
      return JSON.parse(content);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving job description:', error);
    return null;
  }
};

/**
 * Upload portfolio/user metadata to IPFS
 */
export const uploadUserProfile = async (profileData: {
  name: string;
  bio: string;
  skills: string[];
  portfolio: string[]; // URLs or IPFS CIDs
  socialLinks?: Record<string, string>;
  certifications?: string[];
}): Promise<string | null> => {
  try {
    const profileJSON = {
      ...profileData,
      createdAt: Date.now(),
      version: '1.0',
    };

    const cid = await uploadToIPFS(profileJSON, `profile-${Date.now()}.json`);
    return cid;
  } catch (error) {
    console.error('Error uploading user profile:', error);
    return null;
  }
};

/**
 * Get user profile metadata from IPFS
 */
export const getUserProfileFromIPFS = async (
  cid: string
): Promise<any | null> => {
  try {
    const content = await downloadFromIPFS(cid);
    if (content) {
      return JSON.parse(content);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return null;
  }
};

/**
 * Pin content to IPFS for persistence
 * (Uses public pinning service in production)
 */
export const pinToIPFS = async (cid: string): Promise<boolean> => {
  try {
    const cleanCid = toCid(cid);
    const res = await fetch(`${IPFS_API}/api/v0/pin/add?arg=${encodeURIComponent(cleanCid)}`, {
      method: 'POST',
    });

    if (!res.ok) {
      throw new Error(`IPFS pin failed: ${res.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error pinning to IPFS:', error);
    return false;
  }
};

/**
 * Get IPFS Gateway URL for CID
 */
export const getIPFSGatewayURL = (cid: string): string => {
  return `${IPFS_GATEWAY}${toCid(cid)}`;
};

/**
 * Get Infura IPFS Gateway URL for CID
 */
export const getInfuraGatewayURL = (cid: string): string => {
  return `https://infura-ipfs.io/ipfs/${toCid(cid)}`;
};

const ipfs = {
  uploadToIPFS,
  downloadFromIPFS,
  pinToIPFS,
  getIPFSGatewayURL,
  getInfuraGatewayURL,
};

export default ipfs;
