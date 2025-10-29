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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import * as XLSX from 'xlsx';
import { useCreateClassroom } from "@/hooks/use-classrooms";
import { showToast } from "@/utils/toast-config";
import { ClassroomFormValues } from "@/lib/validations/classroom";
import { useCreateSection, useGetSectionByLessonId } from "@/hooks/use-sections";
import { SectionFormValues } from "@/lib/validations/section";
import { useLessonStore } from "@/store/use-lesson-store";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ExcelPreviewTable } from "@/components/common/excel-preview-table";
import { FullDataViewModal } from "@/components/common/full-data-view-modal";
import { FileUploadZone } from "@/components/common/file-upload-zone";
import { ImportOptionsSelector } from "@/components/common/import-options-selector";
import { ValidationError } from "@/components/common/validation-error";
import { useSectionsValidation } from "@/hooks/use-sections-validation";

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

function ImportSectionModal() {
  const { isOpen, onClose, type } = useModal();
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [importOption, setImportOption] = React.useState<string>("create");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [previewData, setPreviewData] = React.useState<PreviewData | null>(null);
  const [totalRows, setTotalRows] = React.useState<number>(0);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showFullData, setShowFullData] = React.useState(false);
  const [fullData, setFullData] = React.useState<{
    headers: string[];
    rows: any[][];
    totalRows: number;
    currentPage: number;
    pageSize: number;
  } | null>(null);
  const [rawJsonData, setRawJsonData] = React.useState<any[][]>([]);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [duplicateRows, setDuplicateRows] = React.useState<number[]>([]);
  const [validationErrors, setValidationErrors] = React.useState<
    Array<{ rowIndex: number; field: string; message: string }>
  >([]);
  
  const { activeLesson } = useLessonStore();
  const { mutate: createSection, isPending: isCreating } = useCreateSection();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: existingSections } = useGetSectionByLessonId(
    Number(activeLesson.lessonId)
  );

  // Hook validation để kiểm tra trùng lặp
  const {
    validateField,
    validateSection,
    isLoading: isValidationLoading
  } = useSectionsValidation(
    Number(activeLesson.lessonId),
    null // Không có sectionId khi import
  );

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

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const droppedFile = event.dataTransfer.files?.[0] || null;
    if (droppedFile) {
      void handleFileChange(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showToast.error("Vui lòng chọn file để import");
      return;
    }

    // Chặn import nếu có lỗi/duplicates giống modal lessons
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
      
      // Lọc bỏ các hàng trống
      const filteredRows = (jsonData.slice(1) as any[][]).filter(row => 
        row.some(cell => cell !== null && cell !== undefined && cell !== '')
      );

      // Kiểm tra các cột bắt buộc
      const requiredColumns = ['Tên phần', 'Thời gian ước tính', 'Hình ảnh', "Thứ tự"];
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

      // Validation từng dòng dữ liệu
      const validationErrors: string[] = [];
      const validatedSectionData: any[] = [];

      for (let i = 0; i < filteredRows.length; i++) {
        const row = filteredRows[i];
        const rowNumber = i + 2; // +2 vì index 0 là header, +1 để hiển thị số dòng Excel
        
        // Lấy dữ liệu từ row theo index của headers
        const sectionNameIndex = headers.indexOf("Tên phần");
        const estimateTimeIndex = headers.indexOf("Thời gian ước tính");
        const iconUrlIndex = headers.indexOf("Hình ảnh");
        const orderIndex = headers.indexOf("Thứ tự");

        // Kiểm tra xem có tìm thấy tất cả các cột không
        if (sectionNameIndex === -1 || estimateTimeIndex === -1 || iconUrlIndex === -1 || orderIndex === -1) {
          validationErrors.push(`Dòng ${rowNumber}: Cấu trúc file không đúng, thiếu cột bắt buộc`);
          continue;
        }

        const sectionName = row[sectionNameIndex];
        const estimateTime = row[estimateTimeIndex];
        const iconUrl = row[iconUrlIndex];
        const order = row[orderIndex];

        // Validation sectionName - chuyển đổi về string nếu cần
        const sectionNameStr = String(sectionName || '').trim();
        if (!sectionNameStr) {
          validationErrors.push(`Dòng ${rowNumber}: Tên phần không được để trống`);
          continue;
        }

        if (sectionNameStr.length > 100) {
          validationErrors.push(`Dòng ${rowNumber}: Tên phần không được vượt quá 100 ký tự`);
          continue;
        }

        // Validation order
        if (!order || isNaN(Number(order)) || Number(order) <= 0 || !Number.isInteger(Number(order))) {
          validationErrors.push(`Dòng ${rowNumber}: Thứ tự phải là số nguyên lớn hơn 0`);
          continue;
        }

        // Validation iconUrl - chuyển đổi về string nếu cần
        const iconUrlStr = String(iconUrl || '').trim();
        if (!iconUrlStr) {
          validationErrors.push(`Dòng ${rowNumber}: Hình ảnh không được để trống`);
          continue;
        }

        // Validation estimateTime - chuyển đổi về string nếu cần
        const estimateTimeStr = String(estimateTime || '').trim();
        if (!estimateTimeStr) {
          validationErrors.push(`Dòng ${rowNumber}: Thời gian ước tính không được để trống`);
          continue;
        }

        // Kiểm tra trùng lặp sectionName
        const nameError = validateField("sectionName", sectionNameStr);
        if (nameError) {
          validationErrors.push(`Dòng ${rowNumber}: ${nameError}`);
          continue;
        }

        // Kiểm tra trùng lặp order
        const orderError = validateField("order", Number(order));
        if (orderError) {
          validationErrors.push(`Dòng ${rowNumber}: ${orderError}`);
          continue;
        }

        // Nếu tất cả validation đều pass, thêm vào danh sách
        validatedSectionData.push({
          sectionName: sectionNameStr,
          estimateTime: estimateTimeStr,
          iconUrl: iconUrlStr,
          order: Number(order)
        });
      }

      // Nếu có lỗi validation, hiển thị tất cả lỗi
      if (validationErrors.length > 0) {
        throw new Error(`Dữ liệu không hợp lệ:\n${validationErrors.join('\n')}`);
      }

      if (validatedSectionData.length === 0) {
        throw new Error("Không có dữ liệu hợp lệ để import");
      }

      const importData = {
        sectionData: validatedSectionData,
        lessonId: Number(activeLesson.lessonId),
      }

      if (importOption === "create") {
        createSection(importData, {
          onSuccess: (data) => {
            showToast.success(`Import dữ liệu thành công! ${data.message}`);
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
      
      // Reset file input để user có thể chọn lại file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFile(null);
      setPreviewData(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setImportOption("create"); 
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setPreviewData(null);
    setTotalRows(0);
    setIsProcessing(false);
    setShowFullData(false);
    setFullData(null);
    setRawJsonData([]);
    setValidationError(null);
    setDuplicateRows([]);
    setValidationErrors([]);
    onClose();
  };

  // Kiểm tra xem option có available không
  const isOptionAvailable = (optionId: string) => {
    return optionId === "create";
  };

  const handleDownloadTemplate = () => {
    const templateUrl = "/template_file/section-template.xlsx";
    const a = document.createElement("a");
    a.href = templateUrl;
    a.download = "section-content";
    a.click();
  };

  // Preview, validation và duplicate checking giống modal lessons
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

      const requiredColumns = ['Tên phần', 'Thời gian ước tính', 'Hình ảnh', 'Thứ tự'];
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

      // Validate và duplicate check
      const sectionNameIndex = headers.indexOf('Tên phần');
      const estimateTimeIndex = headers.indexOf('Thời gian ước tính');
      const iconUrlIndex = headers.indexOf('Hình ảnh');
      const orderIndex = headers.indexOf('Thứ tự');
      const duplicates: number[] = [];
      const errors: Array<{ rowIndex: number; field: string; message: string }> = [];

      const existingSectionNames: string[] =
        existingSections?.data?.map((s: any) => String(s.sectionName || '').toLowerCase().trim()) || [];
      const existingOrders: number[] =
        existingSections?.data?.map((s: any) => Number(s.order)) || [];

      for (let i = 0; i < validRows.length; i++) {
        const sectionName = validRows[i][sectionNameIndex];
        const estimateTime = validRows[i][estimateTimeIndex];
        const iconUrl = validRows[i][iconUrlIndex];
        const order = validRows[i][orderIndex];

        if (!sectionName || sectionName.toString().trim() === '') {
          errors.push({ rowIndex: i, field: 'Tên phần', message: 'Thiếu tên phần' });
          continue;
        }

        if (!order || order.toString().trim() === '') {
          errors.push({ rowIndex: i, field: 'Thứ tự', message: 'Thiếu thứ tự' });
          continue;
        }

        const orderNumber = Number(order);
        if (isNaN(orderNumber) || !Number.isFinite(orderNumber) || !Number.isInteger(orderNumber) || orderNumber <= 0) {
          errors.push({ rowIndex: i, field: 'Thứ tự', message: 'Thứ tự phải là số nguyên > 0' });
          continue;
        }

        if (!iconUrl || iconUrl.toString().trim() === '') {
          errors.push({ rowIndex: i, field: 'Hình ảnh', message: 'Thiếu hình ảnh' });
          continue;
        }

        if (!estimateTime || estimateTime.toString().trim() === '') {
          errors.push({ rowIndex: i, field: 'Thời gian ước tính', message: 'Thiếu thời gian ước tính' });
          continue;
        }

        const normalizedName = sectionName.toString().toLowerCase().trim();
        if (existingSectionNames.includes(normalizedName) || existingOrders.includes(orderNumber)) {
          duplicates.push(i);
        }
      }

      setDuplicateRows(duplicates);
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
            normalizedRow.push("");
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

  const generateFullDataView = async (
    page: number = 1,
    pageSize: number = 50
  ) => {
    if (!rawJsonData.length) return;
    try {
      setIsProcessing(true);
      const headers = rawJsonData[0] as string[];
      const allRows = rawJsonData.slice(1) as any[][];
      const validRows = allRows.filter((row) =>
        row.some((cell) => cell !== null && cell !== undefined && cell !== "")
      );
      const total = validRows.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, total);
      const pageRows = validRows.slice(startIndex, endIndex);
      const normalizedRows = await normalizeRowsInChunks(pageRows, headers, pageRows.length);
      setFullData({ headers, rows: normalizedRows, totalRows: total, currentPage: page, pageSize });
    } catch (err) {
      console.error("Lỗi khi tạo full data view:", err);
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

  if (!isOpen || type !== "importSection") return null;

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
              <span className="text-xl font-medium">Import Dữ Liệu Section</span>
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
                  <li>Các cột bắt buộc: Tên phần, Thời gian ước tính, Hình ảnh, Thứ tự</li>
                  <li>Không thay đổi tên và thứ tự các cột trong template</li>
                  <li>Dữ liệu trong file Excel phải đúng định dạng quy định</li>
                  <li><strong>Validation:</strong> Tên phần không được trùng lặp, thứ tự phải là số nguyên lớn hơn 0</li>
                  <li><strong>Giới hạn:</strong> Tên phần tối đa 100 ký tự</li>
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
                              'Đảm bảo file có đầy đủ cột: "Tên phần", "Thời gian ước tính", "Hình ảnh", "Thứ tự"',
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
                      requiredColumns={["Tên phần", "Thời gian ước tính", "Hình ảnh", "Thứ tự"]}
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
            title="Dữ liệu Section"
            requiredColumns={["Tên phần", "Thời gian ước tính", "Hình ảnh", "Thứ tự"]}
            duplicateRows={duplicateRows}
            errors={validationErrors}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ImportSectionModal;
