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
  duplicateRows?: number[];
  errors?: { rowIndex: number; field: string; message: string }[];
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
  duplicateRows = [],
  errors = [],
  className = ''
}: FullDataViewModalProps) {
  const totalPages = Math.ceil(totalRows / pageSize);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`w-[95vw] max-w-[95vw] h-[90vh] max-h-[90vh] !rounded-xl p-4 sm:p-6 ${className}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Table className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              <span className="text-base sm:text-lg md:text-xl font-medium">{title}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
              <span className="text-lg text-gray-600">Đang tải dữ liệu...</span>
            </div>
          ) : headers.length > 0 && rows.length > 0 ? (
            <>
              {/* Legend for status */}
              {(duplicateRows.length > 0 || requiredColumns.length > 0) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
                  <div className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-blue-500 text-sm">ℹ️</span>
                      <span className="font-medium text-blue-700">Chú thích:</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2 ml-4 sm:ml-6">
                      {duplicateRows.length > 0 && (
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-orange-500 text-xs">⚠️</span>
                          <span className="text-orange-700 text-[10px] sm:text-xs">Trùng lặp</span>
                        </div>
                      )}
                      {requiredColumns.length > 0 && (
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-red-500 text-xs">❌</span>
                          <span className="text-red-700 text-[10px] sm:text-xs">Không hợp lệ</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-green-500 text-xs">✓</span>
                        <span className="text-green-700 text-[10px] sm:text-xs">Hợp lệ</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pagination Controls Top */}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalRows={totalRows}
                pageSize={pageSize}
                onPageChange={onPageChange}
                isLoading={isLoading}
                className="bg-gray-50 p-2 sm:p-3 rounded-lg"
              />

              {/* Data Table */}
              <div className="overflow-auto rounded-lg border border-gray-200 max-h-[45vh] sm:max-h-[50vh]">
                <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-2 py-1.5 sm:px-3 sm:py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider w-10 sm:w-16">
                        #
                      </th>
                      <th className="px-2 py-1.5 sm:px-3 sm:py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[70px] sm:min-w-[100px]">
                        Trạng thái
                      </th>
                      {headers.map((header, index) => (
                        <th
                          key={index}
                          className="px-2 py-1.5 sm:px-3 sm:py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] sm:min-w-[120px]"
                        >
                          <div className="flex items-center gap-1">
                            <span className="truncate">{header}</span>
                            {requiredColumns.includes(header) && (
                              <span className="text-red-500 flex-shrink-0 text-xs">*</span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rows.map((row, rowIndex) => {
                      const actualRowNumber = (currentPage - 1) * pageSize + rowIndex + 1;
                      const globalRowIndex = (currentPage - 1) * pageSize + rowIndex;
                      const isDuplicateRow = duplicateRows.includes(globalRowIndex);
                      
                      // Kiểm tra xem có ô trống nào trong cột bắt buộc không
                      const rowErrors = errors.filter(e => e.rowIndex === globalRowIndex);
                      
                      // Xác định trạng thái chính xác
                      let statusType: 'duplicate' | 'invalid' | 'valid' = 'valid';
                      if (rowErrors.length > 0) {
                        statusType = 'invalid';
                      } else if (isDuplicateRow) {
                        statusType = 'duplicate';
                      }
                      
                      return (
                        <tr key={rowIndex} className={`hover:bg-gray-50 ${
                          statusType === 'invalid' ? 'bg-red-50 border-l-2 sm:border-l-4 border-red-400' :
                          statusType === 'duplicate' ? 'bg-orange-50 border-l-2 sm:border-l-4 border-orange-400' : ''
                        }`}>
                          <td className={`px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs font-medium ${
                            statusType === 'invalid' ? 'text-red-600' :
                            statusType === 'duplicate' ? 'text-orange-600' : 'text-gray-400'
                          }`}>
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              {actualRowNumber}
                              {statusType === 'invalid' && (
                                <span className="text-red-500 text-[10px] sm:text-xs" title="Dữ liệu không hợp lệ">
                                  ❌
                                </span>
                              )}
                              {statusType === 'duplicate' && (
                                <span className="text-orange-500 text-[10px] sm:text-xs" title="Dữ liệu trùng lặp">
                                  ⚠️
                                </span>
                              )}
                            </div>
                          </td>
                          <td className={`px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs font-medium ${
                            statusType === 'duplicate' ? 'bg-orange-50 text-orange-700' : 
                            statusType === 'invalid' ? 'bg-red-50 text-red-700' : 
                            'text-green-600'
                          }`}>
                            <div className="flex items-center gap-1">
                              {statusType === 'invalid' ? (
                                <div className="text-red-600">
                                  {rowErrors.map((e, index) => (
                                    <div key={`error-${globalRowIndex}-${index}`}>{`- ${e.message}`}</div>
                                  ))}
                                </div>
                              ) : statusType === 'duplicate' ? (
                                <div className="text-orange-700">
                                  - Trùng lặp
                                </div>
                              ) : (
                                <div className="text-green-600">
                                  Hợp lệ
                                </div>
                              )}
                            </div>
                          </td>
                          {headers.map((header, cellIndex) => {
                            const cellValue = row[cellIndex];
                            const isEmpty = !cellValue || cellValue.toString().trim() === '';
                            const isRequired = requiredColumns.includes(header);
                            
                            return (
                              <td
                                key={cellIndex}
                                className={`px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs max-w-[100px] sm:max-w-[200px] ${
                                  statusType === 'duplicate'
                                    ? 'bg-orange-50 text-orange-700'
                                    : statusType === 'invalid'
                                    ? 'bg-red-50 text-red-700'
                                    : isEmpty && isRequired 
                                    ? 'bg-red-50 text-red-600 border-l border-red-300' 
                                    : isEmpty 
                                    ? 'text-gray-400 bg-gray-50' 
                                    : 'text-gray-700'
                                }`}
                              >
                                <div className="truncate" title={cellValue?.toString() || ''}>
                                  {isEmpty ? (
                                    <span className="italic text-[9px] sm:text-[10px]">
                                      {isRequired ? 'Thiếu dữ liệu' : 'Trống'}
                                    </span>
                                  ) : (
                                    <span className={statusType !== 'valid' ? 'font-medium' : ''}>
                                      {cellValue.toString()}
                                    </span>
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
                className="border-t pt-2 sm:pt-4"
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