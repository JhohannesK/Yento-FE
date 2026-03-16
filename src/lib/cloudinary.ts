import { axiosInstance } from '@/lib/api/axios';

export interface UploadSignatureResult {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
}

export async function getUploadSignature(): Promise<UploadSignatureResult> {
  const { data } = await axiosInstance.get<UploadSignatureResult>(
    'products/upload-signature'
  );
  return data;
}

export async function uploadImage(file: File): Promise<string> {
  const sig = await getUploadSignature();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', sig.apiKey);
  formData.append('timestamp', String(sig.timestamp));
  formData.append('signature', sig.signature);
  formData.append('folder', sig.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || response.statusText || 'Upload failed');
  }

  const result = await response.json();
  return result.secure_url;
}
