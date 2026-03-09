import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, disabled }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
        transition-all duration-200 ease-in-out
        ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-white'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-400 hover:bg-primary-50'}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        {isDragActive ? (
          <>
            <FileText className="w-16 h-16 text-primary-500" />
            <p className="text-lg font-medium text-primary-600">Drop your PDF here</p>
          </>
        ) : (
          <>
            <Upload className="w-16 h-16 text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-700">
                Drag & drop your PDF file here
              </p>
              <p className="text-sm text-gray-500 mt-2">or click to browse</p>
            </div>
            <p className="text-xs text-gray-400">Only PDF files are supported</p>
          </>
        )}
      </div>
    </div>
  );
};
