import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, X, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

interface ErrorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: Error | null;
  title?: string;
}

interface ValidationError {
  field: string;
  messages: string[];
  row?: number;
}

interface ParsedError {
  type: string;
  title: string;
  status: number;
  errors: Record<string, string[]>;
  traceId?: string;
}

export function ErrorDetailsModal({ 
  isOpen, 
  onClose, 
  error, 
  title = "Chi tiết lỗi" 
}: ErrorDetailsModalProps) {
  const [copied, setCopied] = React.useState(false);

  // Parse error message để extract JSON nếu có
  const parseError = (error: Error | null): { parsedError: ParsedError | null; rawMessage: string } => {
    if (!error) return { parsedError: null, rawMessage: "" };

    const rawMessage = error.message;
    
    try {
      // Tìm JSON trong error message
      const jsonMatch = rawMessage.match(/\{.*\}/s);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const parsed = JSON.parse(jsonStr) as ParsedError;
        return { parsedError: parsed, rawMessage };
      }
    } catch (e) {
      // Không parse được JSON, return raw message
    }

    return { parsedError: null, rawMessage };
  };

  // Chuyển đổi errors object thành mảng ValidationError dễ đọc
  const formatValidationErrors = (errors: Record<string, string[]>): ValidationError[] => {
    const validationErrors: ValidationError[] = [];

    Object.entries(errors).forEach(([key, messages]) => {
      // Parse key để lấy row index và field name
      // Format: [1].description hoặc [3].imageurl
      const match = key.match(/\[(\d+)\]\.(.+)/);
      
      if (match) {
        const row = parseInt(match[1]) + 1;
        const field = match[2];
        
        validationErrors.push({
          field: field,
          messages,
          row
        });
      } else {
        // Trường hợp không có row index
        validationErrors.push({
          field: key,
          messages
        });
      }
    });

    // Sort theo row number
    return validationErrors.sort((a, b) => (a.row || 0) - (b.row || 0));
  };

  // Group validation errors theo row
  const groupErrorsByRow = (validationErrors: ValidationError[]): Map<number, ValidationError[]> => {
    const grouped = new Map<number, ValidationError[]>();
    
    validationErrors.forEach(error => {
      if (error.row) {
        if (!grouped.has(error.row)) {
          grouped.set(error.row, []);
        }
        grouped.get(error.row)!.push(error);
      }
    });

    return grouped;
  };

  // Copy error details to clipboard
  const handleCopyError = async () => {
    if (!error) return;

    try {
      await navigator.clipboard.writeText(error.message);
      setCopied(true);
      toast.success("Đã sao chép chi tiết lỗi vào clipboard!");
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Không thể sao chép vào clipboard");
    }
  };

  const { parsedError, rawMessage } = parseError(error);
  const validationErrors = parsedError ? formatValidationErrors(parsedError.errors) : [];
  const groupedErrors = groupErrorsByRow(validationErrors);

  // Translate field names
  const translateFieldName = (fieldName: string): string => {
    const translations: Record<string, string> = {
      'description': 'Mô tả',
      'imageurl': 'Hình ảnh',
      'classname': 'Tên lớp học',
      'class_id': 'Mã lớp học'
    };
    
    return translations[fieldName] || fieldName;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {title}
                </DialogTitle>
                {parsedError && (
                  <p className="text-sm text-gray-500 mt-1">
                    {parsedError.title} - Status: {parsedError.status}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyError}
                className="flex items-center gap-2 mr-5"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Đã sao chép
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Sao chép
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[60vh] px-6">
            {parsedError ? (
              <div className="space-y-6 py-4">
                {/* Tổng quan lỗi */}
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-medium text-red-800 mb-2">
                    Tổng quan lỗi validation
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-red-600 font-medium">Tổng số lỗi:</span>{" "}
                      <Badge variant="destructive" className="ml-1">
                        {validationErrors.length}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-red-600 font-medium">Số dòng bị lỗi:</span>{" "}
                      <Badge variant="destructive" className="ml-1">
                        {groupedErrors.size}
                      </Badge>
                    </div>
                  </div>
                  {parsedError.traceId && (
                    <div className="mt-2 text-xs text-red-600">
                      Trace ID: <code className="bg-red-100 px-1 py-0.5 rounded">{parsedError.traceId}</code>
                    </div>
                  )}
                </div>

                {/* Chi tiết lỗi theo dòng */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 sticky top-0 bg-white py-2 border-b">
                    Chi tiết lỗi theo dòng dữ liệu
                  </h3>
                  
                  {Array.from(groupedErrors.entries()).map(([row, errors]) => (
                    <div key={row} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            Dòng {row}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {errors.length} lỗi
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        {errors.map((error, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 mb-1">
                                {translateFieldName(error.field)}
                              </div>
                              <ul className="space-y-1">
                                {error.messages.map((message, msgIndex) => (
                                  <li key={msgIndex} className="text-sm text-red-600">
                                    {message}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Raw JSON cho developer */}
                <details className="bg-gray-50 rounded-lg border">
                  <summary className="p-4 cursor-pointer font-medium text-gray-700 hover:bg-gray-100">
                    Raw Error Data (Dành cho developer)
                  </summary>
                  <div className="px-4 pb-4">
                    <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                      {JSON.stringify(parsedError, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            ) : (
              /* Hiển thị raw error message nếu không parse được */
              <div className="py-4 space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-medium text-red-800 mb-2">
                    Thông báo lỗi
                  </h3>
                  <p className="text-red-700 text-sm leading-relaxed">
                    {rawMessage}
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 