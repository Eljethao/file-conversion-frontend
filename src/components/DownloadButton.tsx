import React from 'react';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  downloadUrl: string;
  filename: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ downloadUrl, filename }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename.replace(/\.pdf$/i, '.docx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="
        flex items-center justify-center space-x-2 px-6 py-3 
        bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg
        transition-colors duration-200 shadow-lg hover:shadow-xl
        transform hover:scale-105
      "
    >
      <Download className="w-5 h-5" />
      <span>Download DOCX</span>
    </button>
  );
};
