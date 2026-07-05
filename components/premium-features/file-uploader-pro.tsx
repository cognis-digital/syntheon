interface FileUploaderProProps {
  // Upload configuration
  onUpload: (files: File[]) => Promise<UploadResult[]>;
  maxFiles?: number;
  maxSizeMB?: number;
  allowedTypes?: string[];
  
  // UI customization
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

interface UploadResult {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}
