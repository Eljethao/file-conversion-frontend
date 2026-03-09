export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const POLLING_INTERVAL = 2000;

export const API_ENDPOINTS = {
  PRESIGNED_URL: `${API_BASE_URL}/api/upload/presigned-url`,
  CONVERT: `${API_BASE_URL}/api/convert`,
  STATUS: (taskId: string) => `${API_BASE_URL}/api/status/${taskId}`,
  HEALTH: `${API_BASE_URL}/health`,
};
