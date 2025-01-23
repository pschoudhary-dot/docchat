import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

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
        
        // Here you would typically process the file for embeddings
        // This is a placeholder for the actual processing logic
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    multiple: true,
  });

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
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