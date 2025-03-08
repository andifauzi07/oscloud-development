import { useState } from 'react';
import { supabase } from '@/backend/supabase/supabaseClient';

interface ImageUploadOptions {
  maxSizeInMB?: number;
  allowedFileTypes?: string[];
  bucketName: string;
  folderPath: string;
}

interface ImageUploadResult {
  uploadImage: (file: File) => Promise<string>;
  isUploading: boolean;
  error: Error | null;
}

export const useImageUpload = ({
  maxSizeInMB = 3,
  allowedFileTypes = ['image/jpeg', 'image/png'],
  bucketName,
  folderPath,
}: ImageUploadOptions): ImageUploadResult => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const validateFile = (file: File): void => {
    if (file.size > maxSizeInMB * 1024 * 1024) {
      throw new Error(`File size must be less than ${maxSizeInMB}MB`);
    }

    if (!allowedFileTypes.includes(file.type)) {
      throw new Error(`Only ${allowedFileTypes.join(', ')} files are allowed`);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      setError(null);

      validateFile(file);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${folderPath}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to upload image');
      setError(error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, error };
};