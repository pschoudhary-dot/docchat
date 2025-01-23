import React from 'react';
import { File, FileText, Image, Video, Music, FileSpreadsheet, FileType } from 'lucide-react';

interface Document {
  name: string;
  type: string;
  size: number;
  url: string;
}

interface DocumentListProps {
  documents: Document[];
}

const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  const getIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (type.startsWith('video/')) return <Video className="w-6 h-6" />;
    if (type.startsWith('audio/')) return <Music className="w-6 h-6" />;
    if (type.includes('spreadsheet') || type.includes('csv')) return <FileSpreadsheet className="w-6 h-6" />;
    if (type.includes('presentation')) return <FileType className="w-6 h-6" />;
    if (type.includes('pdf') || type.includes('word')) return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
        <div className="space-y-2">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="text-gray-500 mr-3">
                {getIcon(doc.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {doc.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatSize(doc.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentList;