import React from "react";
import { useModal } from "@/hooks/useModalStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { showToast } from "@/utils/toast-config";
import { useCreateNotiType, checkNotiTypeExists, useNotiType, checkMultipleNotiTypeExists, clearNotiTypeCache } from "@/hooks/use-notitype";
import { NotiTypeFormValues, notiTypeFormSchema } from "@/lib/validations/notitype";
import { ExcelPreviewTable } from "@/components/common/excel-preview-table";
import { FullDataViewModal } from "@/components/common/full-data-view-modal";
import { FileUploadZone } from "@/components/common/file-upload-zone";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ImportOptionsSelector } from "@/components/common/import-options-selector";
import { ValidationError } from "@/components/common/validation-error";

const importOptions = [
  {
    id: "create",
    title: "Tạo mới dữ liệu",
    description: "Chỉ thêm các bản ghi mới, bỏ qua nếu đã tồn tại",
    available: true
  },
  {
    id: "override",
    title: "Ghi đè dữ liệu",
    description: "Cập nhật dữ liệu nếu đã tồn tại, tạo mới nếu chưa có",
    comingSoon: true
  },
  {
    id: "replace",
    title: "Thay thế toàn bộ",
    description: "Xóa dữ liệu cũ và thay thế bằng dữ liệu mới",
    comingSoon: true
  }
];

type PreviewData = {
  headers: string[];
  rows: any[][];
};

type FullDataView = {
  headers: string[];
  rows: any[][];
  totalRows: number;
  currentPage: number;
  pageSize: number;
};

// Thêm hàm delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function ImportNotiTypeModal() {
  const { isOpen, onClose, type } = useModal();
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [importOption, setImportOption] = React.useState<string>("create");
  const [previewData, setPreviewData] = React.useState<PreviewData | null>(null);
  const [totalRows, setTotalRows] = React.useState<number>(0);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showFullData, setShowFullData] = React.useState(false);
  const [fullData, setFullData] = React.useState<FullDataView | null>(null);
  const [rawJsonData, setRawJsonData] = React.useState<any[][]>([]);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [duplicateRows, setDuplicateRows] = React.useState<number[]>([]);
  const [isValidating, setIsValidating] = React.useState(false);

  const { mutate: createNotiType, isPending: isCreating } = useCreateNotiType();
  const {data: notiTypeExists, isLoading: notiTypeLoading, error: notiTypeError} = useNotiType();

  // Function để hiển thị error details modal sử dụng useModal store
  const showErrorDetailsModal = (error: Error, title?: string) => {
    useModal.getState().onOpen("errorDetails", {
      error,
      errorTitle: title || "Chi tiết lỗi Import"
    });
  };

  const handleFileChange = async (selectedFile: File | null) => {
    try {
      if (!selectedFile) {
        setFile(null);
        setPreviewData(null);
        setFullData(null);
        setRawJsonData([]);
        setTotalRows(0);
        setValidationError(null);
        setDuplicateRows([]);
        setIsValidating(false);
        return;
      }

      setPreviewData(null);
      setFullData(null);
      setRawJsonData([]);
      setTotalRows(0);
      setValidationError(null);
      setDuplicateRows([]);
      setIsValidating(false);

      const fileClone = new File([selectedFile], selectedFile.name, {
        type: selectedFile.type,
      });
      
      setFile(fileClone);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      await generatePreview(fileClone);
      
    } catch (error) {
      console.error("Lỗi khi đọc file:", error);
      showToast.error(
        <div className="flex flex-col gap-1">
          <p className="font-medium">Lỗi khi đọc file</p>
          <p className="text-sm text-gray-600">
            Vui lòng thử lại hoặc chọn file khác
          </p>
        </div>
      );
      setFile(null);
      setPreviewData(null);
      setTotalRows(0);
      setRawJsonData([]);
      setFullData(null);
      setIsProcessing(false);
      setValidationError(null);
      setDuplicateRows([]);
      setIsValidating(false);
    }
  };



  const handleUpload = async () => {
    if (!file) {
      showToast.error("Vui lòng chọn file để import");
      return;
    }

    try {
      setIsUploading(true);

      // Tạo bản sao của file để tránh conflict
      const fileClone = new File([file], file.name, {
        type: file.type,
      });

      // Đọc dữ liệu từ file Excel với Promise
      const data = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
        reader.onerror = (error) => {
          reject(new Error("Không thể đọc file. Vui lòng chọn lại file Excel và thử lại"));
        };
        reader.readAsArrayBuffer(fileClone);
      });

      const workbook = XLSX.read(data, { type: 'array' });
      
      if (!workbook.SheetNames.length) {
        throw new Error("File Excel không có sheet nào");
      }

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Kiểm tra dữ liệu
      if (jsonData.length < 2) {
        throw new Error("File không có dữ liệu để import");
      }

      const headers = jsonData[0] as string[];
      
      // Lọc bỏ các hàng trống (tất cả các ô trong hàng đều null hoặc undefined hoặc empty string)
      const filteredRows = (jsonData.slice(1) as any[][]).filter(row => 
        row.some(cell => cell !== null && cell !== undefined && cell !== '')
      );

      // Kiểm tra các cột bắt buộc
      const requiredColumns = ['Loại thông báo'];
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));
      
      if (missingColumns.length > 0) {
        throw new Error(`Thiếu các cột bắt buộc: ${missingColumns.join(', ')}`);
      }

      // Chuẩn bị dữ liệu để gửi lên server
      const formattedData = filteredRows.map(row => {
        const rowData: Record<string, any> = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index] || null;
        });
        return rowData;
      });

      const importData = formattedData.map((item) => {
        const value = item["Loại thông báo"];
        
        // Validate dữ liệu trước khi tạo object
        if (!value || value.toString().trim() === '') {
          throw new Error(`Dữ liệu "Loại thông báo" không được để trống`);
        }
        
        return {
          ntId: 0,
          value: value.toString().trim()
        };
      });
      
      // Kiểm tra dữ liệu trùng lặp trong file Excel
      const valueSet = new Set<string>();
      const duplicatesInFile: string[] = [];
      
      importData.forEach((item, index) => {
        const normalizedValue = item.value.toLowerCase();
        if (valueSet.has(normalizedValue)) {
          duplicatesInFile.push(`Dòng ${index + 2}: "${item.value}"`);
        } else {
          valueSet.add(normalizedValue);
        }
      });
      
      if (duplicatesInFile.length > 0) {
        throw new Error(`Phát hiện dữ liệu trùng lặp trong file Excel:\n${duplicatesInFile.join('\n')}`);
      }

      // Kiểm tra dữ liệu trùng lặp với database trước khi import
      const duplicateIndexes = await validateDuplicateData(importData.map((item, index) => [item.value]), ['Loại thông báo']);
      
      if (duplicateIndexes.length > 0) {
        const duplicateValues = duplicateIndexes.map(index => importData[index].value);
        showToast.error(
          <div className="flex flex-col gap-1">
            <p className="font-medium">Không thể nhập dữ liệu trùng lặp</p>
            <p className="text-sm text-gray-600">
              Phát hiện {duplicateIndexes.length} dữ liệu đã tồn tại: {duplicateValues.slice(0, 3).join(', ')}{duplicateValues.length > 3 ? '...' : ''}
            </p>
          </div>,
          {
            autoClose: 8000,
          }
        );
        return;
      }
      
      // Sử dụng tất cả dữ liệu vì đã kiểm tra không có trùng lặp
      const nonDuplicateData = importData;
      
      if (nonDuplicateData.length === 0) {
        showToast.error(
          <div className="flex flex-col gap-1">
            <p className="font-medium">Không có dữ liệu để import</p>
            <p className="text-sm text-gray-600">
              File không chứa dữ liệu hợp lệ
            </p>
          </div>
        );
        return;
      }

      if (importOption === "create") {
        try {
          let successCount = 0;
          // Tạo tuần tự từng notitype
          for (const [index, item] of nonDuplicateData.entries()) {
            try {
              // Validate dữ liệu với schema trước khi gửi
              let validatedItem;
              try {
                validatedItem = notiTypeFormSchema.parse(item);
              } catch (validationError: any) {
                throw new Error(`Dữ liệu dòng ${index + 1} không hợp lệ: ${validationError.errors?.map((e: any) => e.message).join(', ') || validationError.message}`);
              }
              
              // Đợi cho đến khi tạo xong mới tiếp tục
              await new Promise((resolve, reject) => {
                createNotiType(validatedItem, {
                  onSuccess: () => {
                    successCount++;
                    // Hiển thị tiến độ
                    showToast.success(
                      <div className="flex flex-col gap-1">
                        <p className="font-medium">Đang import dữ liệu...</p>
                        <p className="text-sm text-gray-600">
                          Đã tạo {successCount}/{nonDuplicateData.length} loại thông báo
                        </p>
                      </div>
                    );
                    resolve(true);
                  },
                  onError: (error: Error) => {
                    reject(error);
                  }
                });
              });

              // Đợi 500ms trước khi tạo tiếp
              if (index < nonDuplicateData.length - 1) {
                await delay(500);
              }
            } catch (error) {
              throw new Error(`Lỗi khi tạo loại thông báo thứ ${index + 1}: ${error instanceof Error ? error.message : "Lỗi không xác định"}`);
            }
          }

          // Hiển thị thông báo khi hoàn thành tất cả
          showToast.success(
            <div className="flex flex-col gap-1">
              <p className="font-medium">Import dữ liệu thành công!</p>
              <p className="text-sm text-gray-600">
                Đã tạo {successCount}/{nonDuplicateData.length} loại thông báo
              </p>
            </div>
          );
          
          // Clear cache sau khi import thành công để đảm bảo dữ liệu được cập nhật
          clearNotiTypeCache();
          handleClose();
        } catch (error) {
          console.error("Import error:", error);
          
          const errorObj = error instanceof Error 
            ? error 
            : new Error(typeof error === 'string' ? error : "Vui lòng thử lại");
          
          // Hiển thị toast với button xem chi tiết
          showToast.error(
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <p className="font-medium">Có lỗi xảy ra khi import dữ liệu</p>
                <p className="text-sm text-gray-600">
                  {errorObj.message.length > 100 
                    ? errorObj.message.substring(0, 100) + "..."
                    : errorObj.message}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => showErrorDetailsModal(errorObj)}
                className="w-fit"
              >
                Xem chi tiết lỗi
              </Button>
            </div>
          );
        }
      }
    } catch (error) {
      console.error("Import error:", error);
      
      const errorObj = error instanceof Error 
        ? error 
        : new Error(typeof error === 'string' ? error : "Vui lòng đóng file Excel và thử lại");
      
      // Hiển thị toast với button xem chi tiết
      showToast.error(
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <p className="font-medium">Lỗi khi import dữ liệu</p>
            <p className="text-sm text-gray-600">
              {errorObj.message.length > 100 
                ? errorObj.message.substring(0, 100) + "..."
                : errorObj.message}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => showErrorDetailsModal(errorObj)}
            className="w-fit"
          >
            Xem chi tiết lỗi
          </Button>
        </div>,
        {
          autoClose: 8000, 
          style: {
            backgroundColor: '#FEF2F2',
            color: '#991B1B',
          },
        }
      );
      
      setFile(null);
      setPreviewData(null);
      setTotalRows(0);
      setRawJsonData([]);
      setFullData(null);
      setValidationError(null);
      setDuplicateRows([]);
      setIsValidating(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setImportOption("create"); 
    setPreviewData(null);
    setTotalRows(0);
    setIsProcessing(false);
    setShowFullData(false);
    setFullData(null);
    setRawJsonData([]);
    setValidationError(null);
    setDuplicateRows([]);
    setIsValidating(false);
    onClose();
  };

  const generateFullDataView = async (page: number = 1, pageSize: number = 50) => {
    if (!rawJsonData.length) return;
    
    try {
      setIsProcessing(true);
      
      const headers = rawJsonData[0] as string[];
      const allRows = rawJsonData.slice(1) as any[][];
      
      const validRows = allRows.filter(row => 
        row.some(cell => cell !== null && cell !== undefined && cell !== '')
      );
      
      const totalRows = validRows.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalRows);
      const pageRows = validRows.slice(startIndex, endIndex);
      
      const normalizedRows = await normalizeRowsInChunks(pageRows, headers, pageSize);
      
      setFullData({
        headers,
        rows: normalizedRows,
        totalRows,
        currentPage: page,
        pageSize
      });
      
    } catch (error) {
      console.error("Lỗi khi tạo full data view:", error);
      showToast.error("Không thể tạo view dữ liệu đầy đủ");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShowFullData = async () => {
    if (!rawJsonData.length) {
      showToast.error("Chưa có dữ liệu để hiển thị");
      return;
    }
    setShowFullData(true);
    await generateFullDataView(1, 50);
  };

  const handlePageChange = async (newPage: number) => {
    if (!fullData) return;
    await generateFullDataView(newPage, fullData.pageSize);
  };

  const isOptionAvailable = (optionId: string) => {
    return optionId === "create";
  };

  const handleDownloadTemplate = () => {
    const templateUrl = "/template_file/schoolweek-template.xlsx";
    const a = document.createElement("a");
    a.href = templateUrl;
    a.download = "schoolweek-template.xlsx";
    a.click();
  };

  const normalizeRowsInChunks = (
    rows: any[][], 
    headers: string[], 
    chunkSize: number = 100
  ): Promise<any[][]> => {
    return new Promise((resolve) => {
      const normalizedRows: any[][] = [];
      let currentIndex = 0;

      const processChunk = () => {
        const endIndex = Math.min(currentIndex + chunkSize, rows.length);
        
        for (let i = currentIndex; i < endIndex; i++) {
          const row = rows[i];
          const normalizedRow = [...row];
          
          while (normalizedRow.length < headers.length) {
            normalizedRow.push('');
          }
          normalizedRows.push(normalizedRow.slice(0, headers.length));
        }

        currentIndex = endIndex;

        if (currentIndex < rows.length) {
          setTimeout(processChunk, 0); 
        } else {
          resolve(normalizedRows);
        }
      };

      processChunk();
    });
  };

  const validateDuplicateData = async (validRows: any[][], headers: string[]) => {
    try {
      setIsValidating(true);
      const duplicateIndexes: number[] = [];
      
      const notiTypeColumnIndex = headers.indexOf('Loại thông báo');
      if (notiTypeColumnIndex === -1) return [];

      // Lấy tất cả giá trị cần kiểm tra
      const valuesToCheck: (string | number)[] = [];
      const validIndexes: number[] = [];
      const valueMap = new Map<string, number[]>(); // Map để theo dõi trùng lặp trong file
      
      for (let i = 0; i < validRows.length; i++) {
        const row = validRows[i];
        const notiTypeValue = row[notiTypeColumnIndex];
        
        // Kiểm tra cả string và number, và cả giá trị null/undefined
        if (notiTypeValue !== null && notiTypeValue !== undefined && notiTypeValue !== '') {
          // Chuyển đổi về string để so sánh nhất quán
          const normalizedValue = String(notiTypeValue).trim().toLowerCase();
          if (normalizedValue) {
            // Kiểm tra trùng lặp trong file Excel
            if (!valueMap.has(normalizedValue)) {
              valueMap.set(normalizedValue, []);
            }
            valueMap.get(normalizedValue)!.push(i);
            
            valuesToCheck.push(String(notiTypeValue).trim());
            validIndexes.push(i);
          }
        }
      }
      
      // Thêm các index trùng lặp trong file Excel (từ lần xuất hiện thứ 2 trở đi)
      valueMap.forEach((indexes) => {
        if (indexes.length > 1) {
          // Thêm tất cả các index trùng lặp (từ lần xuất hiện thứ 2)
          duplicateIndexes.push(...indexes.slice(1));
        }
      });
      
      // Batch validation với database - chỉ gọi API một lần duy nhất
      if (valuesToCheck.length > 0) {
        try {
          const existsResults = await checkMultipleNotiTypeExists(valuesToCheck);
          
          // Xử lý kết quả từ database
          existsResults.forEach((exists, index) => {
            if (exists && !duplicateIndexes.includes(validIndexes[index])) {
              duplicateIndexes.push(validIndexes[index]);
            }
          });
        } catch (error) {
          console.warn('Lỗi khi kiểm tra trùng lặp batch:', error);
        }
      }
      
      // Sắp xếp duplicateIndexes để đảm bảo thứ tự
      duplicateIndexes.sort((a, b) => a - b);
      
      setDuplicateRows(duplicateIndexes);
      return duplicateIndexes;
    } catch (error) {
      console.error('Lỗi khi validate dữ liệu trùng lặp:', error);
      return [];
    } finally {
      setIsValidating(false);
    }
  };

  const generatePreview = async (file: File) => {
    try {
      setIsProcessing(true);
      
      const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
        reader.onerror = (e) => reject(e);
        reader.readAsArrayBuffer(file);
      });

      await new Promise(resolve => setTimeout(resolve, 10)); 

      const workbook = XLSX.read(buffer, { type: 'array' });
      
      if (!workbook.SheetNames.length) {
        throw new Error("File Excel không có sheet nào");
      }

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (!Array.isArray(jsonData) || jsonData.length < 1) {
        throw new Error("Không thể đọc dữ liệu từ file Excel");
      }

      const headers = jsonData[0] as string[];
      const allRows = jsonData.slice(1) as any[][];
      
      const requiredColumns = ['Loại thông báo'];
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));
      
      if (missingColumns.length > 0) {
        setValidationError(`File Excel thiếu các cột bắt buộc: ${missingColumns.join(', ')}`);
        setPreviewData(null);
        setTotalRows(0);
        setRawJsonData([]);
        setFullData(null);
        return;
      }
      
      setRawJsonData(jsonData as any[][]);
      
      const validRows: any[][] = [];
      const chunkSize = 500;
      
      for (let i = 0; i < allRows.length; i += chunkSize) {
        const chunk = allRows.slice(i, i + chunkSize);
        const validChunk = chunk.filter(row => 
          row.some(cell => cell !== null && cell !== undefined && cell !== '')
        );
        validRows.push(...validChunk);
        
        if (i % 1000 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1)); 
        }
      }
      
      setTotalRows(validRows.length);

      if (validRows.length > 100) {
        setValidationError(`Số lượng dữ liệu vượt quá giới hạn cho phép. Tối đa 100 dòng, hiện tại có ${validRows.length} dòng.`);
        setPreviewData(null);
        setRawJsonData([]);
        setFullData(null);
        return;
      }
      
      const previewRows = allRows.slice(0, 5);
      const normalizedPreviewRows = await normalizeRowsInChunks(previewRows, headers, 5);

      setPreviewData({
        headers,
        rows: normalizedPreviewRows
      });
      
      // Validate dữ liệu trùng lặp
      await validateDuplicateData(validRows, headers);

    } catch (error) {
      console.error("Lỗi khi đọc file Excel:", error);
      showToast.error("Không thể đọc file Excel");
      setPreviewData(null);
      setTotalRows(0);
      setRawJsonData([]);
      setFullData(null);
      setValidationError("Không thể đọc file Excel. Vui lòng kiểm tra lại file và thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || type !== "importNotiType") return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[1150px] !rounded-xl">
          <DialogHeader>
            <DialogTitle>
              <motion.div
                className="flex items-center gap-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Upload className="w-6 h-6 text-blue-500" />
                <span className="text-xl font-medium">Import Dữ Liệu Loại Thông Báo</span>
              </motion.div>
            </DialogTitle>
          </DialogHeader>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mt-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6 order-1 lg:order-1">
                <FileUploadZone
                  file={file}
                  onFileChange={handleFileChange}
                  isLoading={isProcessing}
                  disabled={isUploading}
                />

                <ImportOptionsSelector
                  options={importOptions}
                  value={importOption}
                  onChange={setImportOption}
                />
              </div>

              <div className="space-y-6 order-2 lg:order-2">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                    <i className="fas fa-info-circle"></i>
                    Hướng dẫn import dữ liệu
                  </h4>
                  <ul className="text-sm text-blue-600 space-y-2 list-disc list-inside mb-4">
                    <li>Sử dụng template mẫu để đảm bảo dữ liệu được import chính xác</li>
                    <li>Các cột bắt buộc: Loại thông báo</li>
                    <li>Không thay đổi tên và thứ tự các cột trong template</li>
                    <li>Giới hạn tối đa 100 dòng dữ liệu trong một lần import</li>
                    <li>Các ô trống trong cột bắt buộc sẽ được đánh dấu màu đỏ</li>
                  </ul>
                  <Button 
                    variant="link" 
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                    onClick={handleDownloadTemplate}
                  >
                    <i className="fas fa-download mr-2"></i>
                    Tải template mẫu
                  </Button>
                </div>

                {file && (
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <i className="fas fa-eye text-blue-500"></i>
                      Xem trước dữ liệu
                    </h4>
                    
                    {validationError ? (
                      <ValidationError
                        error={validationError}
                        title="File Excel không hợp lệ"
                        suggestions={
                          validationError.includes('thiếu các cột') ? [
                            'Tải template mẫu và sử dụng đúng tên cột',
                            'Đảm bảo file có đầy đủ cột: "Loại thông báo"',
                            'Không thay đổi tên header trong template',
                            'Kiểm tra lại định dạng file Excel (.xlsx, .xls)'
                          ] : validationError.includes('vượt quá giới hạn') ? [
                            'Chia nhỏ dữ liệu thành nhiều file, mỗi file tối đa 100 dòng',
                            'Xóa bớt các dòng không cần thiết',
                            'Import từng phần một cách có hệ thống'
                          ] : [
                            'Kiểm tra lại format file Excel',
                            'Đảm bảo file không bị lỗi hoặc corrupt',
                            'Thử mở file bằng Excel để kiểm tra'
                          ]
                        }
                      />
                    ) : (
                      <>
                        {/* Hiển thị trạng thái validation */}
                        {isValidating && (
                          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2 text-yellow-700">
                              <LoadingSpinner size="sm" />
                              <span className="text-sm font-medium">Đang kiểm tra dữ liệu trùng lặp...</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Hiển thị thông báo dữ liệu trùng lặp */}
                        {!isValidating && duplicateRows.length > 0 && (
                          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <i className="fas fa-exclamation-triangle text-orange-500 mt-0.5"></i>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-orange-700 mb-1">
                                  Phát hiện {duplicateRows.length} dòng dữ liệu trùng lặp
                                </p>
                                <p className="text-xs text-orange-600">
                                  Các dòng này đã tồn tại trong hệ thống và sẽ bị bỏ qua khi import.
                                  Dòng trùng lặp: {duplicateRows.map(i => i + 2).join(', ')}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Hiển thị thông báo không có dữ liệu trùng lặp */}
                        {!isValidating && duplicateRows.length === 0 && totalRows > 0 && (
                          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 text-green-700">
                              <i className="fas fa-check-circle text-green-500"></i>
                              <span className="text-sm font-medium">Không có dữ liệu trùng lặp</span>
                            </div>
                          </div>
                        )}
                        
                        <ExcelPreviewTable
                          headers={previewData?.headers || []}
                          rows={previewData?.rows || []}
                          requiredColumns={['Loại thông báo']}
                          totalRows={totalRows}
                          duplicateRows={duplicateRows}
                          onViewAll={handleShowFullData}
                          isLoading={isProcessing}
                        />
                        </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={handleClose}>
                Hủy
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!file || isUploading || isCreating || !!validationError}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUploading || isCreating ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Đang import...
                  </>
                ) : (
                  "Import dữ liệu"
                )}
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Full Data View Modal */}
      <FullDataViewModal
        isOpen={showFullData}
        onClose={() => setShowFullData(false)}
        headers={fullData?.headers || []}
        rows={fullData?.rows || []}
        totalRows={fullData?.totalRows || 0}
        currentPage={fullData?.currentPage || 1}
        pageSize={fullData?.pageSize || 50}
        onPageChange={handlePageChange}
        isLoading={isProcessing}
        title="Dữ liệu đầy đủ - Loại Thông Báo"
        requiredColumns={['Loại thông báo']}
        duplicateRows={duplicateRows}
      />
    </>
  );
}

export default ImportNotiTypeModal;
