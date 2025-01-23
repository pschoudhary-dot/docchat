import React, { useState } from 'react';
import { File, FileText, Image, Video, Music, FileSpreadsheet, FileType, MoreVertical, Eye, Trash, ChevronDown, ChevronUp, FileEdit, Headphones, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Document {
  name: string;
  type: string;
  size: number;
  url: string;
  content?: string;
}

interface DocumentListProps {
  documents: Document[];
  onDocumentSelect?: (doc: Document) => void;
  onDocumentDelete?: (doc: Document) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onDocumentSelect, onDocumentDelete }) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showPreview, setShowPreview] = useState(false);

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

  const handleDelete = (doc: Document) => {
    onDocumentDelete?.(doc);
    toast.success('Document removed successfully');
  };

  const renderPreview = (doc: Document) => {
    if (doc.type.startsWith('image/')) {
      return <img src={doc.url} alt={doc.name} className="max-h-[70vh] w-auto mx-auto" />;
    }
    if (doc.type.startsWith('video/')) {
      return (
        <video controls className="max-h-[70vh] w-auto mx-auto">
          <source src={doc.url} type={doc.type} />
          Your browser does not support the video tag.
        </video>
      );
    }
    if (doc.type.startsWith('audio/')) {
      return (
        <audio controls className="w-full">
          <source src={doc.url} type={doc.type} />
          Your browser does not support the audio tag.
        </audio>
      );
    }
    // For other file types, open in new tab
    return (
      <div className="text-center p-8">
        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          Open {doc.name} in new tab
        </a>
      </div>
    );
  };

  const displayedDocuments = showAll ? documents : documents.slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Uploaded Documents</h3>
          <div className="flex gap-2">
            <button
              onClick={() => toast.info('Feature coming soon!')}
              className="text-sm text-gray-600 flex items-center gap-1 hover:text-gray-900"
            >
              <FileEdit className="w-4 h-4" />
              Notes
            </button>
            <button
              onClick={() => toast.info('Feature coming soon!')}
              className="text-sm text-gray-600 flex items-center gap-1 hover:text-gray-900"
            >
              <Headphones className="w-4 h-4" />
              Podcast
            </button>
            <button
              onClick={() => toast.info('Chat export coming soon!')}
              className="text-sm text-gray-600 flex items-center gap-1 hover:text-gray-900"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {displayedDocuments.map((doc, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors",
                "hover:border-rag-primary/50 border border-transparent"
              )}
            >
              <div className="text-gray-500 mr-3" onClick={() => onDocumentSelect?.(doc)}>
                {getIcon(doc.type)}
              </div>
              <div className="flex-1 min-w-0" onClick={() => onDocumentSelect?.(doc)}>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {doc.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatSize(doc.size)}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <MoreVertical className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => {
                    setSelectedDoc(doc);
                    setShowPreview(true);
                  }}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(doc)}>
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
        {documents.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-4 w-full text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedDoc?.name}</DialogTitle>
          </DialogHeader>
          {selectedDoc && renderPreview(selectedDoc)}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentList;