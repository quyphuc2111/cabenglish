import React from 'react';
import { Button } from '@/components/ui/button';

interface ValidationError {
  rowIndex: number;
  field: string;
  message: string;
}

interface ExcelPreviewTableProps {
  headers: string[];
  rows: any[][];
  requiredColumns?: string[];
  showRowNumbers?: boolean;
  maxRows?: number;
  onViewAll?: () => void;
  totalRows?: number;
  isLoading?: boolean;
  className?: string;
  errors?: ValidationError[];
}

export function ExcelPreviewTable({
  headers,
  rows,
  requiredColumns = [],
  showRowNumbers = true,
  maxRows = 5,
  onViewAll,
  totalRows = 0,
  isLoading = false,
  className = '',
  errors = []
}: ExcelPreviewTableProps) {
  if (isLoading) {
    return (
      <div className="text-sm text-gray-500 flex items-center justify-center py-8">
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
        Đang xử lý dữ liệu...
      </div>
    );
  }

  if (!headers.length || !rows.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Không có dữ liệu để hiển thị
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header and View All Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span className="text-sm font-medium text-gray-700">
          Dữ liệu xem trước ({Math.min(rows.length, maxRows)} dòng đầu)
        </span>
        {onViewAll && totalRows > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onViewAll}
            className="text-xs w-full sm:w-auto"
          >
            <i className="fas fa-table mr-1"></i>
            Xem toàn bộ ({totalRows} dòng)
          </Button>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {showRowNumbers && (
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  #
                </th>
              )}
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
              {rows.length > 0 && (
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] sm:min-w-[120px]">
                  Trạng thái
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.slice(0, maxRows).map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {showRowNumbers && (
                  <td className="px-2 sm:px-3 py-2 text-xs text-gray-400 font-medium">
                    {rowIndex + 1}
                  </td>
                )}
                {headers.map((header, cellIndex) => {
                  const cellValue = row[cellIndex];
                  const isEmpty = !cellValue || cellValue.toString().trim() === '';
                  const isRequired = requiredColumns.includes(header);

                  const headerKey = header.toLowerCase().replace(/\s+/g, '');
                  const cellError = errors.find(
                    (e) => e.rowIndex === rowIndex && e.field.toLowerCase() === headerKey
                  );
                  const isInvalid = !!cellError;

                  return (
                    <td
                      key={cellIndex}
                      className={`px-2 sm:px-3 py-2 text-xs max-w-[120px] sm:max-w-[200px] ${
                        isInvalid
                          ? 'bg-red-50 text-red-600 border-l-2 border-red-300'
                          : isEmpty && isRequired
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
                {rows.length > 0 && (
                  <td className="px-2 sm:px-3 py-2 text-xs">
                    {(() => {
                      const rowErrors = errors.filter(
                        (e) => e.rowIndex === rowIndex
                      );
                      if (rowErrors.length > 0) {
                        return (
                          <div className="text-red-600">
                            {rowErrors.map((e, index) => (
                              <div key={`error-${rowIndex}-${index}`}>{`- ${e.message}`}</div>
                            ))}
                          </div>
                        );
                      }
                      return <span className="text-green-600">Hợp lệ</span>;
                    })()}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span>* Hiển thị tối đa {maxRows} dòng đầu tiên</span>
          <span className="flex items-center gap-1">
            <span className="text-red-500">*</span>
            Cột bắt buộc
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-gray-600">
            Xem trước: {Math.min(rows.length, maxRows)}/{maxRows} dòng
          </div>
          {totalRows > 0 && (
            <div className={`font-medium ${totalRows > 100 ? 'text-red-600' : 'text-green-600'}`}>
              Tổng: {totalRows} dòng {totalRows > 100 && '(Vượt quá giới hạn!)'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 