import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import DocumentList from '../components/DocumentList';
import Chat from '../components/Chat';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Index = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  const handleUploadComplete = (files: any[]) => {
    const totalSize = [...documents, ...files].reduce((acc, file) => acc + (file.size || 0), 0);
    if (totalSize > 104857600) { // 100MB in bytes
      toast.error('Total document size exceeds 100MB limit');
      return;
    }
    setDocuments(prev => [...prev, ...files]);
  };

  const handleDocumentSelect = (doc: any) => {
    setSelectedDocument(doc);
  };

  const handleDocumentDelete = (docToDelete: any) => {
    setDocuments(prev => prev.filter(doc => doc !== docToDelete));
    if (selectedDocument === docToDelete) {
      setSelectedDocument(null);
    }
  };

  const handleProceed = () => {
    if (documents.length === 0) {
      toast.error('Please upload at least one document');
      return;
    }
    setShowChat(true);
  };

  return (
    <div className="min-h-screen bg-rag-background">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Multimodal RAG Assistant
        </h1>
        
        {!showChat ? (
          <div className="space-y-6">
            <FileUpload onUploadComplete={handleUploadComplete} />
            {documents.length > 0 && (
              <>
                <DocumentList 
                  documents={documents} 
                  onDocumentSelect={handleDocumentSelect}
                  onDocumentDelete={handleDocumentDelete}
                />
                <div className="flex justify-center">
                  <Button 
                    onClick={handleProceed}
                    className="bg-rag-primary hover:bg-rag-primary/90 text-white px-8"
                  >
                    Proceed to Chat
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Chat 
                documents={documents} 
                onUploadComplete={handleUploadComplete}
                selectedDocument={selectedDocument}
              />
            </div>
            <div className="lg:col-span-1">
              <DocumentList 
                documents={documents} 
                onDocumentSelect={handleDocumentSelect}
                onDocumentDelete={handleDocumentDelete}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;