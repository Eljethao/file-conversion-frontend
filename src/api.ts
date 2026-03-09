import axios from 'axios';
import { API_ENDPOINTS } from './config';
import { PresignedUrlResponse, ConversionResponse, TaskStatusResponse } from './types';

export const api = {
  async getPresignedUrl(filename: string, contentType: string = 'application/pdf'): Promise<PresignedUrlResponse> {
    const response = await axios.post<PresignedUrlResponse>(API_ENDPOINTS.PRESIGNED_URL, {
      filename,
      content_type: contentType,
    });
    return response.data;
  },

  async uploadToS3(presignedUrl: string, file: File): Promise<void> {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  },

  async startConversion(fileId: string, filename: string): Promise<ConversionResponse> {
    const response = await axios.post<ConversionResponse>(API_ENDPOINTS.CONVERT, {
      file_id: fileId,
      filename,
    });
    return response.data;
  },

  async getTaskStatus(taskId: string): Promise<TaskStatusResponse> {
    const response = await axios.get<TaskStatusResponse>(API_ENDPOINTS.STATUS(taskId));
    return response.data;
  },

  async checkHealth(): Promise<{ status: string }> {
    const response = await axios.get(API_ENDPOINTS.HEALTH);
    return response.data;
  },
};
