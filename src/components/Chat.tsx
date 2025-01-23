import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import FileUpload from './FileUpload';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  documents: any[];
  onUploadComplete: (files: any[]) => void;
  selectedDocument: any;
}

const Chat: React.FC<ChatProps> = ({ documents, onUploadComplete, selectedDocument }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Here we would make the API call to Gemini or GROQ
      const context = documents.map(doc => `${doc.name}: ${doc.content || doc.url}`).join('\n');
      
      // Simulated API call - Replace with actual AI integration
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `I'm analyzing your documents and will provide a response based on the context. This is a placeholder response. To integrate with Gemini AI or GROQ, you'll need to implement the API call here.`,
          },
        ]);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error processing your request. Please try again.');
      setLoading(false);
    }
  };

  const handleUploadComplete = (files: any[]) => {
    onUploadComplete(files);
    setShowUpload(false);
    toast.success('Documents added successfully!');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-rag-primary text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {selectedDocument && selectedDocument.type.startsWith('image/') && (
        <div className="p-4 border-t">
          <img 
            src={selectedDocument.url} 
            alt={selectedDocument.name}
            className="max-h-64 mx-auto rounded-lg"
          />
        </div>
      )}

      <div className="p-4 border-t">
        <div className="flex items-center space-x-2 mb-4">
          <Dialog open={showUpload} onOpenChange={setShowUpload}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Source
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Add New Document</DialogTitle>
              </DialogHeader>
              <FileUpload onUploadComplete={handleUploadComplete} />
            </DialogContent>
          </Dialog>
        </div>

        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your documents..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rag-primary"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-rag-primary text-white p-2 rounded-lg hover:bg-rag-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;