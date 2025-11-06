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
import { showToast } from "@/utils/toast-config";
import { useLessonStore } from "@/store/use-lesson-store";
import { useCreateSectionContent } from "@/hooks/useSectionContent";
import { useSectionContentValidation } from "@/hooks/use-section-content-validation";
import { sectionContentFormSchema } from "@/lib/validations/sectionContent";
import { FullDataViewModal } from "@/components/common/full-data-view-modal";
import { ExcelPreviewTable } from "@/components/common/excel-preview-table";
import { FileUploadZone } from "@/components/common/file-upload-zone";
import { ImportOptionsSelector } from "@/components/common/import-options-selector";
import { ValidationError } from "@/components/common/validation-error";

// Định nghĩa các tùy chọn import
type ImportOption = {
  id: string;
  title: string;
  description: string;
};

const importOptions: ImportOption[] = [
  {
    id: "create",
    title: "Tạo mới dữ liệu",
    description: "Chỉ thêm các bản ghi mới, bỏ qua nếu đã tồn tại"
  },
  {
    id: "override",
    title: "Ghi đè dữ liệu (Đang phát triển)",
    description: "Cập nhật dữ liệu nếu đã tồn tại, tạo mới nếu chưa có"
  },
  {
    id: "replace",
    title: "Thay thế toàn bộ (Đang phát triển)", 
    description: "Xóa dữ liệu cũ và thay thế bằng dữ liệu mới"
  }
];

// Thêm type cho preview data
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

function ImportSectionContentModal() {
  const { isOpen, onClose, type } = useModal();
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [importOption, setImportOption] = React.useState<string>("create");
  const [previewData, setPreviewData] = React.useState<PreviewData | null>(null);
  const [showFullData, setShowFullData] = React.useState(false);
  const [fullData, setFullData] = React.useState<FullDataView | null>(null);
  const [rawJsonData, setRawJsonData] = React.useState<any[][]>([]);
  const [totalRows, setTotalRows] = React.useState<number>(0);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [duplicateRows, setDuplicateRows] = React.useState<number[]>([]);
  
  const { activeLesson } = useLessonStore();

  const { mutate: createSectionContent, isPending: isCreating } = useCreateSectionContent();
  
  // Hook validation để kiểm tra trùng lặp
  const {
    validateField,
    validateSectionContent,
    isLoading: isValidationLoading
  } = useSectionContentValidation(Number(activeLesson.sectionId));

  const [validationErrors, setValidationErrors] = React.useState<{ rowIndex: number; field: string; message: string }[]>([]);

  const validateData = React.useCallback(async (rows: any[][], headers: string[]): Promise<{ rowIndex: number; field: string; message: string }[]> => {
    const errors: { rowIndex: number; field: string; message: string }[] = [];
    const titleIndex = headers.indexOf('Tiêu đề');
    const descriptionIndex = headers.indexOf('Mô tả');
    const iframeUrlIndex = headers.indexOf('Iframe Url');
    const iconUrlIndex = headers.indexOf('Hình ảnh');
    const orderIndex = headers.indexOf('Thứ tự');

    const seenTitles = new Set<string>();
    const seenOrders = new Set<number>();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowData = {
        title: String(row[titleIndex] || ''),
        description: String(row[descriptionIndex] || ''),
        iframe_url: String(row[iframeUrlIndex] || ''),
        icon_url: String(row[iconUrlIndex] || ''),
        order: row[orderIndex] !== null && row[orderIndex] !== '' ? Number(row[orderIndex]) : undefined,
      };

      const validationResult = sectionContentFormSchema.safeParse(rowData);

      if (!validationResult.success) {
        validationResult.error.errors.forEach(err => {
          errors.push({
            rowIndex: i,
            field: err.path[0] as string,
            message: err.message,
          });
        });
      }

      const title = rowData.title.trim();
      if (title) {
        if (seenTitles.has(title.toLowerCase())) {
          errors.push({ rowIndex: i, field: 'title', message: 'Tiêu đề bị trùng trong file' });
        } else {
          seenTitles.add(title.toLowerCase());
          const dbError = validateField("title", title);
          if (dbError) {
            errors.push({ rowIndex: i, field: 'title', message: dbError });
          }
        }
      }

      const order = rowData.order;
      if (order) {
        if (seenOrders.has(order)) {
          errors.push({ rowIndex: i, field: 'order', message: 'Thứ tự bị trùng trong file' });
        } else {
          seenOrders.add(order);
          const dbError = validateField("order", order);
          if (dbError) {
            errors.push({ rowIndex: i, field: 'order', message: dbError });
          }
        }
      }
    }

    return errors;
  }, [validateField]);

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
        setValidationErrors([]);
        return;
      }

      setPreviewData(null);
      setFullData(null);
      setRawJsonData([]);
      setTotalRows(0);
      setValidationError(null);
      setDuplicateRows([]);
      setValidationErrors([]);

      const fileClone = new File([selectedFile], selectedFile.name, {
        type: selectedFile.type
      });

      setFile(fileClone);
      await new Promise((resolve) => setTimeout(resolve, 50));
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
      setValidationError(null);
      setDuplicateRows([]);
      setValidationErrors([]);
    }
  };


  const handleUpload = async () => {
    if (!file) {
      showToast.error("Vui lòng chọn file để import");
      return;
    }

    // Chặn import nếu có lỗi/duplicates
    if (duplicateRows.length > 0) {
      showToast.error(
        <div className="flex flex-col gap-1">
          <p className="font-medium">Phát hiện dữ liệu trùng lặp</p>
          <p className="text-sm text-gray-600">
            Có {duplicateRows.length} dòng dữ liệu đã tồn tại trong hệ thống. Vui lòng loại bỏ trước khi import.
          </p>
        </div>,
        {
          autoClose: 7000,
          style: { backgroundColor: "#FEF2F2", color: "#991B1B" }
        }
      );
      return;
    }

    if (validationErrors.length > 0) {
      showToast.error(
        <div className="flex flex-col gap-1">
          <p className="font-medium">Dữ liệu không hợp lệ</p>
          <p className="text-sm text-gray-600">
            Có {validationErrors.length} lỗi trong dữ liệu. Vui lòng kiểm tra lại.
          </p>
        </div>,
        {
          autoClose: 7000,
          style: { backgroundColor: "#FEF2F2", color: "#991B1B" }
        }
      );
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
      const requiredColumns = ['Tiêu đề', 'Mô tả', 'Iframe Url', 'Hình ảnh', "Thứ tự"];
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

      if (validationErrors.length > 0) {
        throw new Error("Vui lòng sửa các lỗi trong file trước khi import.");
      }

      // Nếu validation thành công, tạo dữ liệu
      const sectionListData = formattedData.map((item) => ({
        title: String(item["Tiêu đề"] || '').trim(),
        description: String(item["Mô tả"] || '').trim(),
        iframe_url: String(item["Iframe Url"] || '').trim(),
        order: Number(item["Thứ tự"]) || 0,
        icon_url: String(item["Hình ảnh"] || '').trim(),
        sc_id: 0,
      }));

      const importData = {
        sectionContentData: sectionListData,
        sectionIds: Number(activeLesson.sectionId),
        sectionContentIds: [], // Thêm field bắt buộc cho create
      }

      if (importOption === "create") {
        createSectionContent(importData, {
          onSuccess: (data) => {
            showToast.success(
              <div className="flex flex-col gap-1">
                <p className="font-medium">Import dữ liệu thành công!</p>
                <p className="text-sm text-gray-600">
                  Đã thêm {sectionListData.length} section content mới.
                </p>
              </div>
            );
            if (data.success) {
              handleClose();
            }
          },
          onError: (error: Error) => {
            console.error("Import error:", error);
            showToast.error(<div className="flex flex-col gap-1">
              <p className="font-medium">Có lỗi xảy ra khi import dữ liệu</p>
              <p className="text-sm text-gray-600">
                {error.message}
              </p>
            </div>);
          }
        });
      }
      // toast.success("Import dữ liệu thành công!");
      // handleClose();
    } catch (error) {
      console.error("Import error:", error);
      showToast.error(
        <div className="flex flex-col gap-1">
          <p className="font-medium">Lỗi khi import dữ liệu</p>
          <p className="text-sm text-gray-600">
            {error instanceof Error 
              ? error.message 
              : "Vui lòng đóng file Excel và thử lại"}
          </p>
        </div>,
        {
          autoClose: 5000, // Hiển thị lâu hơn để user đọc được
          style: {
            backgroundColor: '#FEF2F2',
            color: '#991B1B',
          },
        }
      );
      
      // Reset file để user có thể chọn lại file
      setFile(null);
      setPreviewData(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setImportOption("create");
    setValidationErrors([]);
    setPreviewData(null);
    setRawJsonData([]);
    setTotalRows(0);
    setShowFullData(false);
    setFullData(null);
    setIsProcessing(false);
    setValidationError(null);
    setDuplicateRows([]);
    onClose();
  };

  // Kiểm tra xem option có available không
  const isOptionAvailable = (optionId: string) => {
    return optionId === "create";
  };

  const generateFullDataView = async (page: number = 1, pageSize: number = 50) => {
    if (!rawJsonData.length) return;

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

  const handleDownloadTemplate = () => {
    const templateUrl = "/template_file/section-content-template.xlsx";
    const a = document.createElement("a");
    a.href = templateUrl;
    a.download = "section-content-template.xlsx";
    a.click();
  };

  // Thêm hàm generatePreview
  const generatePreview = async (file: File) => {
    try {
      setIsProcessing(true);

      const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
        reader.onerror = (e) => reject(e);
        reader.readAsArrayBuffer(file);
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

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

      const requiredColumns = ['Tiêu đề', 'Mô tả', 'Iframe Url', 'Hình ảnh', 'Thứ tự'];
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
        const validChunk = chunk.filter((row) =>
          row.some((cell) => cell !== null && cell !== undefined && cell !== "")
        );
        validRows.push(...validChunk);
        if (i % 1000 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 1));
        }
      }

      setTotalRows(validRows.length);

      if (validRows.length > 100) {
        setValidationError(
          `Số lượng dữ liệu vượt quá giới hạn cho phép. Tối đa 100 dòng, hiện tại có ${validRows.length} dòng.`
        );
        setPreviewData(null);
        setRawJsonData([]);
        setFullData(null);
        return;
      }

      const errors = await validateData(validRows, headers);
      setValidationErrors(errors);

      const previewRows = validRows.slice(0, 5);
      const normalizedPreviewRows = await normalizeRowsInChunks(previewRows, headers, 5);

      setPreviewData({
        headers,
        rows: normalizedPreviewRows
      });
    } catch (error) {
      console.error("Lỗi khi đọc file Excel:", error);
      showToast.error("Không thể đọc file Excel");
      setPreviewData(null);
      setTotalRows(0);
      setRawJsonData([]);
      setFullData(null);
      setValidationError(
        "Không thể đọc file Excel. Vui lòng kiểm tra lại file và thử lại."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || type !== "importSectionContent") return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[75vw] max-w-[85vw] h-[80vh] max-h-[90vh] !rounded-xl p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-4 sm:p-6 pb-4">
          <DialogTitle>
            <motion.div
              className="flex items-center gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Upload className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-medium">Import Dữ Liệu Section Content</span>
            </motion.div>
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cột trái: Upload và Options */}
            <div className="space-y-6">
              <FileUploadZone
                file={file}
                onFileChange={handleFileChange}
                isLoading={isProcessing}
                disabled={isUploading}
              />

              <ImportOptionsSelector
                options={importOptions.map(opt => ({
                  ...opt,
                  available: isOptionAvailable(opt.id),
                  comingSoon: !isOptionAvailable(opt.id)
                }))}
                value={importOption}
                onChange={setImportOption}
              />
            </div>

            {/* Cột phải: Hướng dẫn và Preview */}
            <div className="space-y-6">
              {/* Hướng dẫn */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                  <i className="fas fa-info-circle"></i>
                  Hướng dẫn import dữ liệu
                </h4>
                <ul className="text-sm text-blue-600 space-y-2 list-disc list-inside mb-4">
                  <li>Sử dụng template mẫu để đảm bảo dữ liệu được import chính xác</li>
                  <li>Các cột bắt buộc: Tiêu đề, Mô tả, Iframe Url, Hình ảnh, Thứ tự</li>
                  <li>Không thay đổi tên và thứ tự các cột trong template</li>
                  <li>Dữ liệu trong file Excel phải đúng định dạng quy định</li>
                  <li><strong>Tiêu đề:</strong> Tối đa 100 ký tự, không được trùng lặp</li>
                  <li><strong>Mô tả:</strong> Tối đa 1000 ký tự, không được để trống</li>
                  <li><strong>Iframe URL & Icon URL:</strong> Phải là URL hợp lệ</li>
                  <li><strong>Thứ tự:</strong> Số nguyên dương, không được trùng lặp</li>
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

              {/* Preview Data */}
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
                        validationError.includes("thiếu các cột")
                          ? [
                              "Tải template mẫu và sử dụng đúng tên cột",
                              'Đảm bảo file có đầy đủ cột: "Tiêu đề", "Mô tả", "Iframe Url", "Hình ảnh", "Thứ tự"',
                              "Không thay đổi tên header trong template",
                              "Kiểm tra lại định dạng file Excel (.xlsx, .xls)"
                            ]
                          : validationError.includes("vượt quá giới hạn")
                          ? [
                              "Chia nhỏ dữ liệu thành nhiều file, mỗi file tối đa 100 dòng",
                              "Xóa bớt các dòng không cần thiết",
                              "Import từng phần một cách có hệ thống"
                            ]
                          : [
                              "Kiểm tra lại format file Excel",
                              "Đảm bảo file không bị lỗi hoặc corrupt",
                              "Thử mở file bằng Excel để kiểm tra"
                            ]
                      }
                    />
                  ) : (
                    <ExcelPreviewTable
                      headers={previewData?.headers || []}
                      rows={previewData?.rows || []}
                      requiredColumns={['Tiêu đề', 'Mô tả', 'Iframe Url', 'Hình ảnh', 'Thứ tự']}
                      totalRows={totalRows}
                      onViewAll={handleShowFullData}
                      isLoading={isProcessing}
                      errors={validationErrors.filter(e => e.rowIndex < 5)}
                      duplicateRows={duplicateRows.filter(idx => idx < 5)}
                    />
                  )}

                  {validationErrors.length > 0 && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg max-h-40 overflow-auto">
                      <p className="text-xs text-red-700 font-medium mb-2">
                        Danh sách lỗi chi tiết ({validationErrors.length}):
                      </p>
                      <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                        {validationErrors.map((err, idx) => (
                          <li key={`${err.rowIndex}-${err.field}-${idx}`}>
                            Dòng {err.rowIndex + 2}: {err.field} - {err.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {duplicateRows.length > 0 && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                      Phát hiện {duplicateRows.length} dòng trùng lặp với hệ thống hiện tại.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          </motion.div>
        </div>

        {/* Fixed footer */}
        <div className="border-t bg-white p-4 sm:p-6 pt-4">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
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
              disabled={
                !file ||
                isUploading ||
                !isOptionAvailable(importOption) ||
                isCreating ||
                !!validationError ||
                duplicateRows.length > 0 ||
                validationErrors.length > 0
              }
              className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto order-1 sm:order-2"
            >
              {isUploading ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                "Nhập dữ liệu"
              )}
            </Button>
          </div>
        </div>
        {showFullData && fullData && (
          <FullDataViewModal
            isOpen={showFullData}
            onClose={() => setShowFullData(false)}
            headers={fullData?.headers || []}
            rows={fullData?.rows || []}
            totalRows={fullData?.totalRows || 0}
            currentPage={fullData?.currentPage || 1}
            pageSize={fullData?.pageSize || 50}
            onPageChange={handlePageChange}
            title="Dữ liệu Section Content"
            requiredColumns={['Tiêu đề', 'Mô tả', 'Iframe Url', 'Hình ảnh', 'Thứ tự']}
            duplicateRows={duplicateRows}
            errors={validationErrors}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ImportSectionContentModal;
