import React from 'react';
import { Loader2, Upload, Cog, CheckCircle, XCircle } from 'lucide-react';
import { ConversionStage } from '../types';

interface ProgressIndicatorProps {
  stage: ConversionStage;
  progress?: number;
  filename?: string;
  error?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  stage,
  progress = 0,
  filename,
  error,
}) => {
  const getStageInfo = () => {
    switch (stage) {
      case 'uploading':
        return {
          icon: <Upload className="w-8 h-8 text-primary-500" />,
          title: 'Uploading to Cloud',
          description: `Uploading ${filename || 'file'} to secure storage...`,
          color: 'text-primary-600',
        };
      case 'processing': {
        let description = 'Starting conversion...';
        if (progress >= 80) description = 'Uploading converted file...';
        else if (progress >= 30) description = 'Analyzing and converting document layout, text, fonts, and images...';
        else if (progress >= 10) description = 'Downloading PDF for processing...';

        return {
          icon: <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />,
          title: 'Converting PDF to DOCX',
          description,
          color: 'text-primary-600',
        };
      }
      case 'completed':
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-500" />,
          title: 'Conversion Complete!',
          description: 'Your DOCX file is ready to download',
          color: 'text-green-600',
        };
      case 'error':
        return {
          icon: <XCircle className="w-8 h-8 text-red-500" />,
          title: 'Conversion Failed',
          description: error || 'An error occurred during conversion',
          color: 'text-red-600',
        };
      default:
        return null;
    }
  };

  const stageInfo = getStageInfo();

  if (!stageInfo) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
          {stageInfo.icon}
        </div>
        
        <div className="text-center">
          <h3 className={`text-xl font-semibold ${stageInfo.color}`}>
            {stageInfo.title}
          </h3>
          <p className="text-sm text-gray-600 mt-2">{stageInfo.description}</p>
        </div>

        {(stage === 'uploading' || stage === 'processing') && (
          <div className="w-full">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">{progress}%</p>
          </div>
        )}

        {stage === 'processing' && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Cog className="w-4 h-4 animate-spin-slow" />
            <span>This may take a few moments...</span>
          </div>
        )}
      </div>
    </div>
  );
};
