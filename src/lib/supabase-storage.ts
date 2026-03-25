/**
 * Supabase Storage Integration
 * Static file hosting ONLY - NO databases
 * Used for images, videos, and media in job-media bucket
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rtvumsbcqxnqboosytgn.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Upload file to Supabase storage
 */
export const uploadMediaToSupabase = async (
  file: File,
  folder: string = 'uploads'
): Promise<string | null> => {
  try {
    const fileName = `${folder}/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from('job-media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('job-media')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading media:', error);
    return null;
  }
};

/**
 * Get public URL for stored file
 */
export const getMediaURL = (fileName: string): string => {
  const { data } = supabase.storage.from('job-media').getPublicUrl(fileName);
  return data.publicUrl;
};

/**
 * Delete file from Supabase storage
 */
export const deleteMediaFromSupabase = async (fileName: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage.from('job-media').remove([fileName]);

    if (error) {
      console.error('Supabase delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting media:', error);
    return false;
  }
};

/**
 * List files in bucket
 */
export const listMediaFiles = async (folder: string = ''): Promise<string[]> => {
  try {
    const { data, error } = await supabase.storage
      .from('job-media')
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'updated_at', order: 'desc' },
      });

    if (error) {
      console.error('Error listing files:', error);
      return [];
    }

    return data.map((file) => file.name) || [];
  } catch (error) {
    console.error('Error listing media files:', error);
    return [];
  }
};

/**
 * Upload image for job posting
 */
export const uploadJobImage = async (file: File): Promise<string | null> => {
  return uploadMediaToSupabase(file, 'job-images');
};

/**
 * Upload portfolio work sample
 */
export const uploadPortfolioSample = async (file: File): Promise<string | null> => {
  return uploadMediaToSupabase(file, 'portfolio');
};

/**
 * Get hero image from bucket
 */
export const getHeroImage = (): string => {
  return getMediaURL('hero-images/heroimage.png');
};

/**
 * Download file (for documents, contracts, etc.)
 */
export const downloadFile = async (fileName: string): Promise<Blob | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('job-media')
      .download(fileName);

    if (error) {
      console.error('Download error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error downloading file:', error);
    return null;
  }
};

export default supabase;
