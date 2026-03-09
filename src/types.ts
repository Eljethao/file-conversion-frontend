export interface PresignedUrlResponse {
  upload_url: string;
  file_id: string;
  file_key: string;
}

export interface ConversionResponse {
  task_id: string;
  status: string;
  message: string;
}

export interface TaskStatusResponse {
  task_id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress?: number;
  download_url?: string;
  error?: string;
}

export type ConversionStage = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
