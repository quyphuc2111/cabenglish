import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "./pagination-controls";
import { Table, X } from 'lucide-react';

interface FullDataViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  headers: string[];
  rows: any[][];
  totalRows: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  requiredColumns?: string[];
  className?: string;
}

export function FullDataViewModal({
  isOpen,
  onClose,
  title = "Xem toàn bộ dữ liệu",
  headers,
  rows,
  totalRows,
  currentPage,
  pageSize,
  onPageChange,
  isLoading = false,
  requiredColumns = [],
  className = ''
}: FullDataViewModalProps) {
  const totalPages = Math.ceil(totalRows / pageSize);

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className={`sm:max-w-[95vw] sm:max-h-[90vh] !rounded-xl ${className}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Table className="w-5 h-5 text-blue-500" />
              <span className="text-lg sm:text-xl font-medium">{title}</span>
            </div>
         
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
              <span className="text-lg text-gray-600">Đang tải dữ liệu...</span>
            </div>
          ) : headers.length > 0 && rows.length > 0 ? (
            <>
              {/* Pagination Controls Top */}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalRows={totalRows}
                pageSize={pageSize}
                onPageChange={onPageChange}
                isLoading={isLoading}
                className="bg-gray-50 p-3 rounded-lg"
              />

              {/* Data Table */}
              <div className="overflow-auto rounded-lg border border-gray-200 max-h-[55vh] sm:max-h-[60vh]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12 sm:w-16">
                        #
                      </th>
                      {headers.map((header, index) => (
                        <th
                          key={index}
                          className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] sm:min-w-[120px]"
                        >
                          <div className="flex items-center gap-1">
                            <span className="truncate">{header}</span>
                            {requiredColumns.includes(header) && (
                              <span className="text-red-500 flex-shrink-0">*</span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rows.map((row, rowIndex) => {
                      const actualRowNumber = (currentPage - 1) * pageSize + rowIndex + 1;
                      return (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          <td className="px-2 sm:px-3 py-2 text-xs text-gray-400 font-medium">
                            {actualRowNumber}
                          </td>
                          {headers.map((header, cellIndex) => {
                            const cellValue = row[cellIndex];
                            const isEmpty = !cellValue || cellValue.toString().trim() === '';
                            const isRequired = requiredColumns.includes(header);
                            
                            return (
                              <td
                                key={cellIndex}
                                className={`px-2 sm:px-3 py-2 text-xs max-w-[120px] sm:max-w-[200px] ${
                                  isEmpty && isRequired 
                                    ? 'bg-red-50 text-red-600 border-l-2 border-red-300' 
                                    : isEmpty 
                                    ? 'text-gray-400 bg-gray-50' 
                                    : 'text-gray-700'
                                }`}
                              >
                                <div className="truncate" title={cellValue?.toString() || ''}>
                                  {isEmpty ? (
                                    <span className="italic">
                                      {isRequired ? 'Thiếu dữ liệu bắt buộc' : 'Trống'}
                                    </span>
                                  ) : (
                                    cellValue.toString()
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls Bottom */}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalRows={totalRows}
                pageSize={pageSize}
                onPageChange={onPageChange}
                isLoading={isLoading}
                showInfo={false}
                className="border-t pt-4"
              />
            </>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Không có dữ liệu để hiển thị
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 