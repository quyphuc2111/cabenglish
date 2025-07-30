import React, { useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadZoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  title?: string;
  subtitle?: string;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export function FileUploadZone({
  file,
  onFileChange,
  acceptedTypes = ['.xlsx', '.xls'],
  maxSize = 5,
  title = 'Kéo thả file hoặc click để chọn',
  subtitle = 'Hỗ trợ file Excel (.xlsx, .xls)',
  className = '',
  disabled = false,
  isLoading = false
}: FileUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (selectedFile: File | null) => {
    if (!selectedFile) return;

    // Check file type
    const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      alert(`Vui lòng chọn file có định dạng: ${acceptedTypes.join(', ')}`);
      return;
    }

    // Check file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      alert(`Kích thước file không được vượt quá ${maxSize}MB`);
      return;
    }

    onFileChange(selectedFile);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    handleFileInput(selectedFile);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const droppedFile = event.dataTransfer.files?.[0] || null;
    handleFileInput(droppedFile);
  };

  const handleRemoveFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && !isLoading) {
      fileInputRef.current?.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={acceptedTypes.join(',')}
        className="hidden"
        disabled={disabled || isLoading}
      />
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors duration-200 cursor-pointer
          ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
          ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center gap-3">
          {isLoading ? (
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className={`w-8 h-8 sm:w-10 sm:h-10 ${file ? 'text-green-500' : 'text-gray-400'}`} />
          )}
          
          {file ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <FileText className="w-4 h-4" />
                <p className="font-medium break-all">{file.name}</p>
              </div>
              <p className="text-sm text-gray-500">
                {formatFileSize(file.size)}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="font-medium text-sm sm:text-base">{title}</p>
              <p className="text-xs sm:text-sm text-gray-500">
                {subtitle} - Tối đa {maxSize}MB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Remove button */}
      {file && !disabled && !isLoading && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveFile();
          }}
        >
          <X className="h-3 w-3 text-muted-foreground hover:text-red-500" />
        </Button>
      )}
    </div>
  );
} 