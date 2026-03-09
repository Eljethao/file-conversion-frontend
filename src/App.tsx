import React, { useState, useEffect, useRef } from 'react';
import { FileUploader } from './components/FileUploader';
import { ProgressIndicator } from './components/ProgressIndicator';
import { DownloadButton } from './components/DownloadButton';
import { api } from './api';
import { ConversionStage } from './types';
import { POLLING_INTERVAL } from './config';
import { FileText, RefreshCw } from 'lucide-react';

function App() {
  const [stage, setStage] = useState<ConversionStage>('idle');
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setStage('uploading');
    setProgress(0);
    setError(null);

    try {
      setProgress(10);
      const { upload_url, file_id } = await api.getPresignedUrl(file.name, file.type);

      setProgress(30);
      await api.uploadToS3(upload_url, file);

      setProgress(50);
      const conversionResponse = await api.startConversion(file_id, file.name);

      setStage('processing');
      setProgress(60);

      startPolling(conversionResponse.task_id);
    } catch (err: any) {
      console.error('Error during upload/conversion:', err);
      setStage('error');
      setError(err.response?.data?.detail || err.message || 'An unexpected error occurred');
    }
  };

  const POLL_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
  const pollStartTimeRef = useRef<number>(0);

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const startPolling = (taskId: string) => {
    stopPolling();
    pollStartTimeRef.current = Date.now();

    pollingIntervalRef.current = setInterval(async () => {
      // Timeout guard — stop polling if worker never picks up the task
      if (Date.now() - pollStartTimeRef.current > POLL_TIMEOUT_MS) {
        stopPolling();
        setStage('error');
        setError('Conversion timed out after 5 minutes. The server may be busy — please try again.');
        return;
      }

      try {
        const status = await api.getTaskStatus(taskId);

        if (status.progress !== undefined) {
          setProgress(status.progress);
        }

        if (status.status === 'COMPLETED') {
          stopPolling();
          setStage('completed');
          setDownloadUrl(status.download_url || null);
          setProgress(100);
        } else if (status.status === 'FAILED' || status.status === 'TIMEOUT') {
          stopPolling();
          setStage('error');
          setError(status.error || 'Conversion failed. Please try again.');
        }
      } catch (err: any) {
        console.error('Error polling task status:', err);
        stopPolling();
        setStage('error');
        setError('Failed to check conversion status. Please try again.');
      }
    }, POLLING_INTERVAL);
  };

  const handleReset = () => {
    stopPolling();
    setStage('idle');
    setProgress(0);
    setSelectedFile(null);
    setDownloadUrl(null);
    setError(null);
  };

  useEffect(() => {
    return () => { stopPolling(); };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            PDF to DOCX Converter
          </h1>
          <p className="text-white/80">
            Convert your PDF files to editable DOCX documents instantly
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          {stage === 'idle' && (
            <FileUploader onFileSelect={handleFileSelect} disabled={false} />
          )}

          {(stage === 'uploading' || stage === 'processing') && (
            <ProgressIndicator
              stage={stage}
              progress={progress}
              filename={selectedFile?.name}
            />
          )}

          {stage === 'completed' && downloadUrl && (
            <div className="text-center space-y-6">
              <ProgressIndicator stage={stage} progress={progress} />
              <DownloadButton
                downloadUrl={downloadUrl}
                filename={selectedFile?.name || 'converted.docx'}
              />
              <button
                onClick={handleReset}
                className="
                  flex items-center justify-center space-x-2 mx-auto px-4 py-2
                  text-primary-600 hover:text-primary-700 font-medium
                  transition-colors duration-200
                "
              >
                <RefreshCw className="w-4 h-4" />
                <span>Convert Another File</span>
              </button>
            </div>
          )}

          {stage === 'error' && (
            <div className="text-center space-y-6">
              <ProgressIndicator stage={stage} error={error || undefined} />
              <button
                onClick={handleReset}
                className="
                  flex items-center justify-center space-x-2 mx-auto px-6 py-3
                  bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg
                  transition-colors duration-200
                "
              >
                <RefreshCw className="w-5 h-5" />
                <span>Try Again</span>
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-white/60 text-sm">
          <p>Files are automatically deleted after 24 hours</p>
          <p className="mt-1">Secure • Fast • Private</p>
        </div>
      </div>
    </div>
  );
}

export default App;
