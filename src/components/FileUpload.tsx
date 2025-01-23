import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Link, AlertCircle, Type } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const supabase = createClient(
  'https://cjcbhrywareegjrbzotq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqY2Jocnl3YXJlZWdqcmJ6b3RxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzUyNTY2MywiZXhwIjoyMDUzMTAxNjYzfQ.kXqRH-4UQkIytNEdvc6b-fgFsuFBr58b3Stg-3JHXDA'
);

const ACCEPTED_FILE_TYPES = {
  'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
  'video/*': ['.mp4', '.avi', '.mov'],
  'audio/*': ['.mp3', '.wav'],
  'application/pdf': ['.pdf'],
  'application/vnd.ms-excel': ['.xls', '.xlsx'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt', '.pptx'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/csv': ['.csv'],
};

interface FileUploadProps {
  onUploadComplete: (files: any[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setProgress(0);
    
    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const fileName = `${Date.now()}-${file.name}`;
        
        const { data, error } = await supabase.storage
          .from('documents')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;
        
        return {
          name: file.name,
          type: file.type,
          size: file.size,
          url: data.path,
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setProgress(100);
      onUploadComplete(uploadedFiles);
      toast.success('Files uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading files. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  const handleUrlSubmit = async () => {
    if (!url.trim()) return;
    setUploading(true);
    
    try {
      // Here you would typically process the URL, fetch its content, and store it
      const urlData = {
        name: new URL(url).hostname,
        type: 'url',
        size: 0,
        url: url,
      };
      
      onUploadComplete([urlData]);
      toast.success('URL added successfully!');
      setUrl('');
    } catch (error) {
      console.error('URL processing error:', error);
      toast.error('Error processing URL. Please check the URL and try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!text.trim()) return;
    setUploading(true);
    
    try {
      const textData = {
        name: 'Text Document',
        type: 'text/plain',
        size: new Blob([text]).size,
        content: text,
      };
      
      onUploadComplete([textData]);
      toast.success('Text added successfully!');
      setText('');
    } catch (error) {
      console.error('Text processing error:', error);
      toast.error('Error processing text. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    multiple: true,
  });

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <Tabs defaultValue="files" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="url">URL</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
        </TabsList>
        
        <TabsContent value="files">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragActive
                ? 'border-rag-primary bg-rag-accent/20'
                : 'border-gray-300 hover:border-rag-primary'
            }`}
          >
            <input {...getInputProps()} />
            <Upload
              className={`w-12 h-12 mx-auto mb-4 ${
                isDragActive ? 'text-rag-primary' : 'text-gray-400'
              }`}
            />
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              or click to select files
            </p>
            <div className="text-xs text-gray-400">
              Supported formats: Images, Videos, Audio, PDF, Excel, PowerPoint, Word, CSV
            </div>
          </div>
        </TabsContent>

        <TabsContent value="url">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="Enter URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Button onClick={handleUrlSubmit} disabled={!url.trim() || uploading}>
                <Link className="w-4 h-4 mr-2" />
                Add URL
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="text">
          <div className="space-y-4">
            <Textarea
              placeholder="Enter or paste text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px]"
            />
            <Button 
              onClick={handleTextSubmit}
              disabled={!text.trim() || uploading}
              className="w-full"
            >
              <Type className="w-4 h-4 mr-2" />
              Add Text
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-rag-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Uploading... {progress}%
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;