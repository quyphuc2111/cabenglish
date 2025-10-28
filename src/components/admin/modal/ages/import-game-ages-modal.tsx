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
import { getAllAges, createAge } from "@/app/api/actions/age";
import { GameAgeFormData } from "@/types/admin-game";
import { ExcelPreviewTable } from "@/components/common/excel-preview-table";
import { FullDataViewModal } from "@/components/common/full-data-view-modal";
import { FileUploadZone } from "@/components/common/file-upload-zone";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ImportOptionsSelector } from "@/components/common/import-options-selector";
import { ValidationError } from "@/components/common/validation-error";

// Định nghĩa các tùy chọn import
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
  duplicateRows?: number[];
};

function ImportGameAgesModal() {
  const { isOpen, onClose, type, data } = useModal();
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
  const [isCheckingDuplicates, setIsCheckingDuplicates] = React.useState(false);

  const handleFileChange = async (selectedFile: File | null) => {
    try {
      if (!selectedFile) {
        setFile(null);
        setPreviewData(null);
        setFullData(null);
        setRawJsonData([]);
        setTotalRows(0);
        setValidationError(null);
        setIsProcessing(false);
        setDuplicateRows([]);
        setIsCheckingDuplicates(false);
        return;
      }

      setPreviewData(null);
      setFullData(null);
      setRawJsonData([]);
      setTotalRows(0);
      setValidationError(null);
      setIsProcessing(false);
      setDuplicateRows([]);
      setIsCheckingDuplicates(false);

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
      setIsCheckingDuplicates(false);
    }
  };

  const isOptionAvailable = (optionId: string) => {
    const option = importOptions.find(opt => opt.id === optionId);
    return option?.available === true;
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

      const fileData = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
        reader.onerror = (error) => {
          reject(new Error("Không thể đọc file. Vui lòng chọn lại file Excel và thử lại"));
        };
        reader.readAsArrayBuffer(fileClone);
      });

      const workbook = XLSX.read(fileData, { type: 'array' });
      
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

      const requiredColumns = ['Tên nhóm tuổi (VI)', 'Tên nhóm tuổi (EN)', 'Tuổi tối thiểu', 'Tuổi tối đa', 'Thứ tự'];
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));
      
      if (missingColumns.length > 0) {
        throw new Error(`Thiếu các cột bắt buộc: ${missingColumns.join(', ')}`);
      }

      const formattedData = filteredRows.map(row => {
        const rowData: Record<string, any> = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index] || null;
        });
        return rowData;
      });

      const agesData: GameAgeFormData[] = formattedData.map((item) => ({
        age_name: item["Tên nhóm tuổi (VI)"],
        age_name_en: item["Tên nhóm tuổi (EN)"],
        description: item["Mô tả"] || "",
        min_age: Number(item["Tuổi tối thiểu"]) || 0,
        max_age: Number(item["Tuổi tối đa"]) || 0,
        order: Number(item["Thứ tự"]) || 0
      }));

      const invalidRows = agesData.filter(age => 
        !age.age_name || !age.age_name_en || age.min_age >= age.max_age || age.order <= 0
      );

      if (invalidRows.length > 0) {
        throw new Error(`Có ${invalidRows.length} dòng dữ liệu không hợp lệ. Vui lòng kiểm tra lại.`);
      }

      if (importOption === "create") {
        let successCount = 0;
        let errorCount = 0;

        for (const ageData of agesData) {
          try {
            await createAge(ageData);
            successCount++;
          } catch (error) {
            console.error("Error creating age:", error);
            errorCount++;
          }
        }

        if (successCount > 0) {
          showToast.success(`Import thành công ${successCount} nhóm tuổi!`);
          
          if (data?.onSuccess) {
            data.onSuccess();
          }
          
          handleClose();
        }

        if (errorCount > 0) {
          showToast.error(`Có ${errorCount} nhóm tuổi không thể import`);
        }
      }
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
          autoClose: 5000,
          style: {
            backgroundColor: '#FEF2F2',
            color: '#991B1B',
          },
        }
      );
      
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
    setPreviewData(null);
    setTotalRows(0);
    setIsProcessing(false);
    setShowFullData(false);
    setFullData(null);
    setRawJsonData([]);
    setValidationError(null);
    setDuplicateRows([]);
    setIsCheckingDuplicates(false);
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
      
      setFullData({
        headers,
        rows: pageRows,
        totalRows,
        currentPage: page,
        pageSize,
        duplicateRows
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

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Tên nhóm tuổi (VI)': '3-4 tuổi',
        'Tên nhóm tuổi (EN)': '3-4 years old',
        'Tuổi tối thiểu': 3,
        'Tuổi tối đa': 4,
        'Mô tả': 'Nhóm tuổi từ 3 đến 4 tuổi',
        'Thứ tự': 1
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    
    const columnWidths = [
      { wch: 30 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 40 },
      { wch: 15 }
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game-ages-template.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const checkDuplicateData = async (validRows: any[][], headers: string[]) => {
    try {
      setIsCheckingDuplicates(true);
      
      const response = await getAllAges({
        page: 1,
        pageSize: 100 // Max allowed by backend
      });
      
      if (!response.data || response.data.length === 0) {
        setDuplicateRows([]);
        return;
      }
      
      const existingAges = response.data;
      const duplicates: number[] = [];
      
      const ageNameViIndex = headers.indexOf('Tên nhóm tuổi (VI)');
      const ageNameEnIndex = headers.indexOf('Tên nhóm tuổi (EN)');
      const orderIndex = headers.indexOf('Thứ tự');
      
      if (ageNameViIndex === -1 || ageNameEnIndex === -1 || orderIndex === -1) {
        setDuplicateRows([]);
        return;
      }
      
      validRows.forEach((row, index) => {
        const ageName = row[ageNameViIndex]?.toString().trim();
        const ageNameEn = row[ageNameEnIndex]?.toString().trim();
        const order = Number(row[orderIndex]);
        
        const isDuplicate = existingAges.some(existingAge => 
          existingAge.age_name?.toLowerCase() === ageName?.toLowerCase() ||
          existingAge.age_name_en?.toLowerCase() === ageNameEn?.toLowerCase() ||
          existingAge.order === order
        );
        
        if (isDuplicate) {
          duplicates.push(index);
        }
      });
      
      setDuplicateRows(duplicates);
      
    } catch (error) {
      console.error('Lỗi khi kiểm tra dữ liệu trùng lặp:', error);
      setDuplicateRows([]);
    } finally {
      setIsCheckingDuplicates(false);
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

      const workbook = XLSX.read(buffer, { type: 'array' });
      
      if (!workbook.SheetNames.length) {
        throw new Error("File Excel không có sheet nào");
      }

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (!Array.isArray(jsonData) || jsonData.length < 1) {
        throw new Error("Không thể đọc dữ liệu từ file Excel");
      }

      setRawJsonData(jsonData as any[][]);
      
      const headers = jsonData[0] as string[];
      const allRows = jsonData.slice(1) as any[][];
      
      const requiredColumns = ['Tên nhóm tuổi (VI)', 'Tên nhóm tuổi (EN)', 'Tuổi tối thiểu', 'Tuổi tối đa', 'Thứ tự'];
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));
      
      if (missingColumns.length > 0) {
        throw new Error(`File Excel thiếu các cột bắt buộc: ${missingColumns.join(', ')}. Vui lòng sử dụng template mẫu.`);
      }
      
      const validRows = allRows.filter(row => 
        row.some(cell => cell !== null && cell !== undefined && cell !== '')
      );
      
      setTotalRows(validRows.length);
      
      setPreviewData({
        headers,
        rows: validRows.slice(0, 5)
      });
      
      await checkDuplicateData(validRows, headers);
      
    } catch (error) {
      console.error("Lỗi khi đọc file Excel:", error);
      showToast.error("Không thể đọc file Excel");
      setValidationError(error instanceof Error ? error.message : "Không thể đọc file Excel");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || type !== "importGameAges") return null;

  return (
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
              <Upload className="w-6 h-6 text-purple-500" />
              <span className="text-xl font-medium">Nhập Dữ Liệu Nhóm Tuổi</span>
            </motion.div>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-4"
        >
          <div className="grid grid-cols-2 gap-6">
            {/* Cột trái */}
            <div className="space-y-6">
              <FileUploadZone
                file={file}
                onFileChange={handleFileChange}
                acceptedTypes={['.xlsx', '.xls']}
                maxSize={5}
                title="Kéo thả file hoặc click để chọn"
                subtitle="Hỗ trợ file Excel (.xlsx, .xls) - Tối đa 5MB"
                isLoading={isProcessing}
              />

              <ImportOptionsSelector
                options={importOptions}
                value={importOption}
                onChange={setImportOption}
                title="Chọn phương thức import"
              />
            </div>

            {/* Cột phải */}
            <div className="space-y-6">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h4 className="text-sm font-medium text-purple-700 mb-2 flex items-center gap-2">
                  <i className="fas fa-info-circle"></i>
                  Hướng dẫn import dữ liệu
                </h4>
                <ul className="text-sm text-purple-600 space-y-2 list-disc list-inside mb-4">
                  <li>Sử dụng template mẫu để đảm bảo dữ liệu được import chính xác</li>
                  <li>Các cột bắt buộc: Tên nhóm tuổi (VI), Tên nhóm tuổi (EN), Tuổi tối thiểu, Tuổi tối đa, Thứ tự</li>
                  <li>Tuổi tối thiểu phải nhỏ hơn tuổi tối đa</li>
                  <li>Không thay đổi tên và thứ tự các cột trong template</li>
                </ul>
                <Button 
                  variant="link" 
                  className="text-purple-600 hover:text-purple-700 p-0 h-auto"
                  onClick={handleDownloadTemplate}
                >
                  <i className="fas fa-download mr-2"></i>
                  Tải template mẫu
                </Button>
              </div>

              {file && (
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <i className="fas fa-eye text-purple-500"></i>
                    Xem trước dữ liệu
                  </h4>
                  
                  {validationError ? (
                    <ValidationError
                      error={validationError}
                      title="File Excel không hợp lệ"
                      suggestions={
                        validationError.includes('thiếu các cột') ? [
                          'Tải template mẫu và sử dụng đúng tên cột',
                          'Đảm bảo file có đầy đủ cột bắt buộc',
                          'Không thay đổi tên header trong template'
                        ] : [
                          'Kiểm tra lại format file Excel',
                          'Đảm bảo file không bị lỗi'
                        ]
                      }
                    />
                  ) : (
                    <>
                      {totalRows > 0 && (
                        <div className="mb-4">
                          {isCheckingDuplicates ? (
                            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                              <div className="flex items-center gap-2 text-purple-700">
                                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm font-medium">Đang kiểm tra dữ liệu trùng lặp...</span>
                              </div>
                            </div>
                          ) : duplicateRows.length > 0 ? (
                            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                              <div className="flex items-center gap-2 text-orange-700">
                                <i className="fas fa-exclamation-triangle text-orange-500"></i>
                                <span className="text-sm font-medium">
                                  Phát hiện {duplicateRows.length} dòng dữ liệu trùng lặp
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center gap-2 text-green-700">
                                <i className="fas fa-check-circle text-green-500"></i>
                                <span className="text-sm font-medium">Không có dữ liệu trùng lặp - Sẵn sàng import</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {isProcessing ? (
                        <LoadingSpinner 
                          text="Đang xử lý dữ liệu..." 
                          className="py-8"
                        />
                      ) : previewData ? (
                        <ExcelPreviewTable
                          headers={previewData.headers}
                          rows={previewData.rows}
                          requiredColumns={['Tên nhóm tuổi (VI)', 'Tên nhóm tuổi (EN)', 'Tuổi tối thiểu', 'Tuổi tối đa', 'Thứ tự']}
                          maxRows={5}
                          totalRows={totalRows}
                          onViewAll={totalRows > 5 ? handleShowFullData : undefined}
                          showRowNumbers={true}
                          duplicateRows={duplicateRows.slice(0, 5)}
                        />
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          Không có dữ liệu để hiển thị
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 mt-6 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
              className="border-2"
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading || !isOptionAvailable(importOption) || !!validationError || duplicateRows.length > 0 || isCheckingDuplicates}
              className="bg-purple-500 hover:bg-purple-600"
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" className="mr-2" />
                  <span>Đang import...</span>
                </div>
              ) : (
                "Nhập dữ liệu"
              )}
            </Button>
          </div>
        </motion.div>
      </DialogContent>

      {showFullData && fullData && (
        <FullDataViewModal
          isOpen={showFullData}
          onClose={() => setShowFullData(false)}
          title="Toàn bộ dữ liệu nhóm tuổi"
          headers={fullData.headers}
          rows={fullData.rows}
          totalRows={fullData.totalRows}
          currentPage={fullData.currentPage}
          pageSize={fullData.pageSize}
          onPageChange={handlePageChange}
          requiredColumns={['Tên nhóm tuổi (VI)', 'Tên nhóm tuổi (EN)', 'Tuổi tối thiểu', 'Tuổi tối đa', 'Thứ tự']}
          duplicateRows={fullData.duplicateRows || []}
        />
      )}
    </Dialog>
  );
}

export default ImportGameAgesModal;

