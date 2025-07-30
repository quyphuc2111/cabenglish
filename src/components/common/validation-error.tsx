import React from 'react';
import { AlertCircle, FileX } from 'lucide-react';

interface ValidationErrorProps {
  error: string;
  title?: string;
  suggestions?: string[];
  className?: string;
}

export function ValidationError({
  error,
  title = "Lỗi dữ liệu",
  suggestions = [],
  className = ''
}: ValidationErrorProps) {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center gap-2">
            <FileX className="w-4 h-4" />
            {title}
          </h4>
          <p className="text-sm text-red-700 mb-3">
            {error}
          </p>
          
          {suggestions.length > 0 && (
            <div>
              <p className="text-sm font-medium text-red-800 mb-2">Hướng dẫn khắc phục:</p>
              <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 