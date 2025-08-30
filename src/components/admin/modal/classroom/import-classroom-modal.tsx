import React from "react";
import { useModal } from "@/hooks/useModalStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import * as XLSX from 'xlsx';
import { useCreateClassroom } from "@/hooks/use-classrooms";
import { useClassroomsValidation } from "@/hooks/use-classrooms-validation";
import { showToast } from "@/utils/toast-config";
import { ClassroomFormValues } from "@/lib/validations/classroom";
import { importClassroomSchema } from "@/lib/validations/import-classroom";
import { ExcelPreviewTable } from "@/components/common/excel-preview-table";
import { FullDataViewModal } from "@/components/common/full-data-view-modal";
import { FileUploadZone } from "@/components/common/file-upload-zone";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ImportOptionsSelector } from "@/components/common/import-options-selector";
import { ValidationError } from "@/components/common/validation-error";
import { useQueryClient } from "@tanstack/react-query";
import { DialogDescription } from "@radix-ui/react-dialog";

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

type ValidationErrorType = {
  rowIndex: number;
  field: string;
  message: string;
};

type PreviewData = {
  headers: string[];
  rows: any[][];
  errors: ValidationErrorType[];
};

type FullDataView = {
  headers: string[];
  rows: any[][];
  totalRows: number;
  currentPage: number;
  pageSize: number;
};

function ImportClassroomModal() {
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
  const [validationErrors, setValidationErrors] = React.useState<ValidationErrorType[]>([]);
  

  const { mutate: createClassroom, isPending: isCreating } = useCreateClassroom();
  const {
    checkDuplicateClassname,
    checkDuplicateOrder,
    existingClassrooms,
    isLoading: isDuplicateChecking
  } = useClassroomsValidation();

  const validateData = React.useCallback(async (rows: any[][], headers: string[]): Promise<ValidationErrorType[]> => {
    const errors: ValidationErrorType[] = [];
    const classnameIndex = headers.indexOf('Tên lớp học');
    const descriptionIndex = headers.indexOf('Mô tả');
    const imageurlIndex = headers.indexOf('Hình ảnh');
    const orderIndex = headers.indexOf('Thứ tự');

    const seenClassnames = new Set<string>();
    const seenOrders = new Set<number>();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowData = {
        classname: String(row[classnameIndex] || ''),
        description: String(row[descriptionIndex] || ''),
        imageurl: String(row[imageurlIndex] || ''),
        order: row[orderIndex] !== null && row[orderIndex] !== '' ? Number(row[orderIndex]) : undefined,
      };

      const validationResult = importClassroomSchema.safeParse(rowData);

      

      if (!validationResult.success) {
        validationResult.error.errors.forEach(err => {
          errors.push({
            rowIndex: i,
            field: err.path[0] as string,
            message: err.message,
          });
        });
      }

      const classname = String(rowData.classname || '').trim();
      if (classname) {
        if (seenClassnames.has(classname.toLowerCase())) {
          errors.push({
            rowIndex: i,
            field: 'classname',
            message: 'Tên lớp học bị trùng trong file',
          });
        } else {
          seenClassnames.add(classname.toLowerCase());
          if (checkDuplicateClassname(classname)) {
            errors.push({
              rowIndex: i,
              field: 'classname',
              message: 'Tên lớp học đã tồn tại trong hệ thống',
            });
          }
        }
      }

      // Check for duplicate order within the file
      const order = Number(rowData.order);
      if (order) {
        if (seenOrders.has(order)) {
          errors.push({
            rowIndex: i,
            field: 'order',
            message: 'Thứ tự bị trùng trong file',
          });
        } else {
          seenOrders.add(order);
          if (checkDuplicateOrder(order)) {
            errors.push({
              rowIndex: i,
              field: 'order',
              message: 'Thứ tự đã tồn tại trong hệ thống',
            });
          }
        }
      }
    }

    return errors;
  }, [checkDuplicateClassname, checkDuplicateOrder, existingClassrooms]);
  const queryClient = useQueryClient();

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
        
        setValidationErrors([]);
        return;
      }

      setPreviewData(null);
      setFullData(null);
      setRawJsonData([]);
      setTotalRows(0);
      

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
      
    }
  };

   

  const handleUpload = async () => {
    if (!file) {
      showToast.error("Vui lòng chọn file để import");
      return;
    }

    

    try {
      setIsUploading(true);

      const fileClone = new File([file], file.name, {
        type: file.type,
      });
      const data = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
        reader.onerror = () => {
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

      if (jsonData.length < 2) {
        throw new Error("File không có dữ liệu để import");
      }

      const headers = jsonData[0] as string[];
      
      const filteredRows = (jsonData.slice(1) as any[][]).filter(row => 
        row.some(cell => cell !== null && cell !== undefined && cell !== '')
      );

      const formattedData = filteredRows.map(row => {
        const rowData: Record<string, any> = {};
        headers.forEach((header, index) => {
          const cellValue = index < row.length ? row[index] : null;
          rowData[header] = cellValue || null;
        });
        return rowData;
      });

      const importData = formattedData.map((item) => ({
        classname: String(item['Tên lớp học'] || '').trim(),
        description: String(item['Mô tả'] || '').trim(),
        imageurl: String(item['Hình ảnh'] || '').trim(),
        class_id: 0,
        numliked: 0,
        progress: 0,
        order: 0
      }));

      if (importOption === "create") {
        createClassroom(importData as unknown as ClassroomFormValues, {
          onSuccess: () => {
            // Invalidate cache để cập nhật dữ liệu validation
            queryClient.invalidateQueries({ queryKey: ["classrooms-validation"] });
            queryClient.invalidateQueries({ queryKey: ["classrooms"] });
            
            showToast.success("Import dữ liệu thành công!");
            handleClose();
          },
          onError: (error: Error) => {
            console.error("Import error:", error);
            
            // Hiển thị toast với button xem chi tiết
            showToast.error(
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
              <p className="font-medium">Có lỗi xảy ra khi import dữ liệu</p>
              <p className="text-sm text-gray-600">
                    {error.message.length > 100 
                      ? error.message.substring(0, 100) + "..."
                      : error.message}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => showErrorDetailsModal(error)}
                  className="w-fit"
                >
                  Xem chi tiết lỗi
                </Button>
              </div>
            );
          }
        });
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
    
    setValidationErrors([]);
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
    const templateUrl = "/template_file/classroom-template.xlsx";
    const a = document.createElement("a");
    a.href = templateUrl;
    a.download = "classroom-template.xlsx";
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
      
      const requiredColumns = ['Tên lớp học', 'Mô tả', 'Hình ảnh', 'Thứ tự'];
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));
      
      if (missingColumns.length > 0) {
        setValidationErrors([{ rowIndex: -1, field: 'file', message: `File Excel thiếu các cột bắt buộc: ${missingColumns.join(', ')}` }]);
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
        setValidationErrors([{ rowIndex: -1, field: 'file', message: `Số lượng dữ liệu vượt quá giới hạn cho phép. Tối đa 100 dòng, hiện tại có ${validRows.length} dòng.` }]);
        setPreviewData(null);
        setRawJsonData([]);
        setFullData(null);
        return;
      }
      
      const previewRows = allRows.slice(0, 5);
      const normalizedPreviewRows = await normalizeRowsInChunks(previewRows, headers, 5);

      const validationErrors = await validateData(validRows, headers);
      setValidationErrors(validationErrors);

      setPreviewData({
        headers,
        rows: normalizedPreviewRows,
        errors: validationErrors,
      });

    } catch (error) {
      console.error("Lỗi khi đọc file Excel:", error);
      showToast.error("Không thể đọc file Excel");
      setPreviewData(null);
      setTotalRows(0);
      setRawJsonData([]);
      setFullData(null);
      setValidationErrors([{ rowIndex: -1, field: 'file', message: 'Không thể đọc file Excel. Vui lòng kiểm tra lại file và thử lại.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || type !== "importClassroom") return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[95vw] lg:max-w-[1150px] max-h-[90vh] overflow-y-auto !rounded-xl">
        <DialogHeader>
          <DialogTitle>
            <motion.div
              className="flex items-center gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Upload className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-medium">Nhập Dữ Liệu Lớp Học</span>
            </motion.div>
          </DialogTitle>
          <DialogDescription />
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
                  <li>Các cột bắt buộc: Tên lớp học, Mô tả, Hình ảnh, Thứ tự</li>
                  <li>Thứ tự phải là một số duy nhất và không được trùng lặp.</li>
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
                  
                  {validationErrors.some(e => e.rowIndex === -1) ? (
                    <ValidationError
                      error={validationErrors.find(e => e.rowIndex === -1)?.message || "Lỗi không xác định"}
                      title="File Excel không hợp lệ"
                      suggestions={[]}
                    />
                  ) : previewData ? (
                    <ExcelPreviewTable
                      headers={previewData.headers}
                      rows={previewData.rows}
                      requiredColumns={['Tên lớp học', 'Mô tả', 'Hình ảnh', 'Thứ tự']}
                      totalRows={totalRows}
                      onViewAll={handleShowFullData}
                      isLoading={isProcessing}
                      errors={validationErrors}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Xem trước dữ liệu sẽ hiển thị ở đây.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 mt-6 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
              className="border-2 w-full sm:w-auto order-2 sm:order-1"
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading || !isOptionAvailable(importOption) || isCreating || validationErrors.length > 0 || isDuplicateChecking}
              className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto order-1 sm:order-2"
            >
              {isUploading || isDuplicateChecking ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isDuplicateChecking ? 'Đang kiểm tra...' : 'Đang xử lý...'}</span>
                </div>
              ) : (
                "Nhập dữ liệu"
              )}
            </Button>
          </div>
        </motion.div>
      </DialogContent>

      <FullDataViewModal
        isOpen={showFullData}
        onClose={() => setShowFullData(false)}
        title="Xem toàn bộ dữ liệu Excel"
        headers={fullData?.headers || []}
        rows={fullData?.rows || []}
        totalRows={fullData?.totalRows || 0}
        currentPage={fullData?.currentPage || 1}
        pageSize={fullData?.pageSize || 50}
        onPageChange={handlePageChange}
        isLoading={isProcessing}
        requiredColumns={['Tên lớp học', 'Mô tả', 'Hình ảnh']}
      />
      
      
    </Dialog>
  );
}

export default ImportClassroomModal;
