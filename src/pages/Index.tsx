import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import DocumentList from '../components/DocumentList';
import Chat from '../components/Chat';

const Index = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [showChat, setShowChat] = useState(false);

  const handleUploadComplete = (files: any[]) => {
    setDocuments(prev => [...prev, ...files]);
    if (files.length > 0 && !showChat) {
      setShowChat(true);
    }
  };

  return (
    <div className="min-h-screen bg-rag-background">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Multimodal RAG Assistant
        </h1>
        
        {!showChat ? (
          <FileUpload onUploadComplete={handleUploadComplete} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Chat documents={documents} />
            </div>
            <div className="lg:col-span-1">
              <DocumentList documents={documents} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;