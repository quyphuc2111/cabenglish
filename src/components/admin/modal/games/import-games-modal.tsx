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
import { AdminGameService } from "@/services/admin-game.service";
import { AdminGameFormData } from "@/types/admin-game";
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
  duplicateRows?: number[];
};

function ImportGamesModal() {
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

  const topicsData = data?.topicsData || [];
  const agesData = data?.agesData || [];

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

  const validateURL = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
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

      const requiredColumns = ['Tên game (EN)', 'Tên game (VI)', 'URL Game', 'Độ khó', 'Thời lượng (phút)', 'Chủ đề IDs', 'Nhóm tuổi IDs'];
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

      // Parse and validate data
      const gamesData: AdminGameFormData[] = [];
      const invalidRowIndices: number[] = [];

      for (let i = 0; i < formattedData.length; i++) {
        const item = formattedData[i];
        
        // Parse topic IDs and age IDs
        const topicIdsStr = item["Chủ đề IDs"]?.toString() || "";
        const ageIdsStr = item["Nhóm tuổi IDs"]?.toString() || "";
        
        const topicIds = topicIdsStr
          .split(',')
          .map((id: string) => parseInt(id.trim()))
          .filter((id: number) => !isNaN(id));
        
        const ageIds = ageIdsStr
          .split(',')
          .map((id: string) => parseInt(id.trim()))
          .filter((id: number) => !isNaN(id));

        // Validate topics exist
        const validTopicIds = topicIds.filter((id: number) => 
          topicsData.some(t => t.topicId === id)
        );

        // Validate ages exist
        const validAgeIds = ageIds.filter((id: number) => 
          agesData.some(a => a.ageId === id)
        );

        const gameData: AdminGameFormData = {
          gameName: item["Tên game (EN)"] || "",
          gameNameVi: item["Tên game (VI)"] || "",
          urlGame: item["URL Game"] || "",
          imageUrl: item["URL Hình ảnh"] || "",
          description: item["Mô tả (EN)"] || "",
          descriptionVi: item["Mô tả (VI)"] || "",
          difficultyLevel: item["Độ khó"] === "Dễ" ? "easy" : 
                          item["Độ khó"] === "Trung bình" ? "medium" : "hard",
          estimatedDuration: parseInt(item["Thời lượng (phút)"]) || 5,
          isActive: item["Trạng thái"] === "Hoạt động" || item["Trạng thái"] === true,
          topicIds: validTopicIds,
          ageIds: validAgeIds
        };

        // Validate required fields
        if (!gameData.gameName || !gameData.gameNameVi || !gameData.urlGame || 
            validTopicIds.length === 0 || validAgeIds.length === 0 ||
            !validateURL(gameData.urlGame)) {
          invalidRowIndices.push(i);
        }

        gamesData.push(gameData);
      }

      if (invalidRowIndices.length > 0) {
        throw new Error(
          `Có ${invalidRowIndices.length} dòng dữ liệu không hợp lệ. ` +
          `Vui lòng kiểm tra: tên game, URL game, chủ đề và nhóm tuổi phải hợp lệ.`
        );
      }

      if (importOption === "create") {
        let successCount = 0;
        let errorCount = 0;

        for (const gameData of gamesData) {
          try {
            await AdminGameService.createGame(gameData);
            successCount++;
          } catch (error) {
            console.error("Error creating game:", error);
            errorCount++;
          }
        }

        if (successCount > 0) {
          showToast.success(`Import thành công ${successCount} game!`);
          
          if (data?.onSuccess) {
            data.onSuccess();
          }
          
          handleClose();
        }

        if (errorCount > 0) {
          showToast.error(`Có ${errorCount} game không thể import`);
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
    // Create template with sample data
    const templateData = [
      {
        'Tên game (EN)': 'Animal Match',
        'Tên game (VI)': 'Ghép đôi động vật',
        'URL Game': 'https://example.com/animal-match',
        'URL Hình ảnh': 'https://example.com/image.jpg',
        'Mô tả (EN)': 'Match animal pairs',
        'Mô tả (VI)': 'Ghép đôi các con vật',
        'Độ khó': 'Dễ',
        'Thời lượng (phút)': 10,
        'Chủ đề IDs': '1,2',
        'Nhóm tuổi IDs': '1,2',
        'Trạng thái': 'Hoạt động'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    
    const columnWidths = [
      { wch: 30 }, { wch: 30 }, { wch: 40 }, { wch: 40 }, 
      { wch: 50 }, { wch: 50 }, { wch: 15 }, { wch: 15 },
      { wch: 20 }, { wch: 20 }, { wch: 15 }
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

    // Add instructions sheet
    const instructions = [
      ['Hướng dẫn sử dụng template'],
      [''],
      ['1. Các cột bắt buộc:'],
      ['   - Tên game (EN), Tên game (VI)'],
      ['   - URL Game (phải là URL hợp lệ)'],
      ['   - Độ khó (Dễ/Trung bình/Khó)'],
      ['   - Thời lượng (phút)'],
      ['   - Chủ đề IDs (danh sách ID cách nhau bằng dấu phẩy, ví dụ: 1,2,3)'],
      ['   - Nhóm tuổi IDs (danh sách ID cách nhau bằng dấu phẩy)'],
      [''],
      ['2. Chủ đề IDs và Nhóm tuổi IDs:'],
      ['   - Lấy danh sách ID từ trang quản lý Topics và Ages'],
      ['   - Phân cách bằng dấu phẩy, không có khoảng trắng'],
      [''],
      ['3. URL Game phải:'],
      ['   - Bắt đầu bằng http:// hoặc https://'],
      ['   - Là URL hợp lệ'],
    ];
    const instructionsSheet = XLSX.utils.aoa_to_sheet(instructions);
    XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Hướng dẫn');

    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games-template.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const checkDuplicateData = async (validRows: any[][], headers: string[]) => {
    try {
      setIsCheckingDuplicates(true);
      
      const response = await AdminGameService.getGames({
        page: 1,
        pageSize: 1000
      });
      
      if (!response.success || !response.data.games) {
        setDuplicateRows([]);
        return;
      }
      
      const existingGames = response.data.games;
      const duplicates: number[] = [];
      
      const gameNameEnIndex = headers.indexOf('Tên game (EN)');
      const gameNameViIndex = headers.indexOf('Tên game (VI)');
      const urlGameIndex = headers.indexOf('URL Game');
      
      if (gameNameEnIndex === -1 || gameNameViIndex === -1 || urlGameIndex === -1) {
        setDuplicateRows([]);
        return;
      }
      
      validRows.forEach((row, index) => {
        const gameName = row[gameNameEnIndex]?.toString().trim();
        const gameNameVi = row[gameNameViIndex]?.toString().trim();
        const urlGame = row[urlGameIndex]?.toString().trim();
        
        const isDuplicate = existingGames.some(existingGame => 
          existingGame.gameName?.toLowerCase() === gameName?.toLowerCase() ||
          existingGame.gameNameVi?.toLowerCase() === gameNameVi?.toLowerCase() ||
          existingGame.urlGame?.toLowerCase() === urlGame?.toLowerCase()
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
      
      const requiredColumns = ['Tên game (EN)', 'Tên game (VI)', 'URL Game', 'Độ khó', 'Thời lượng (phút)', 'Chủ đề IDs', 'Nhóm tuổi IDs'];
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

  if (!isOpen || type !== "importGames") return null;

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
              <Upload className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-medium">Nhập Dữ Liệu Games</span>
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

            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                  <i className="fas fa-info-circle"></i>
                  Hướng dẫn import dữ liệu
                </h4>
                <ul className="text-sm text-blue-600 space-y-2 list-disc list-inside mb-4">
                  <li>Sử dụng template mẫu để đảm bảo dữ liệu được import chính xác</li>
                  <li>Các cột bắt buộc: Tên game (EN/VI), URL Game, Độ khó, Thời lượng, Chủ đề IDs, Nhóm tuổi IDs</li>
                  <li>URL Game phải hợp lệ (bắt đầu với http:// hoặc https://)</li>
                  <li>Chủ đề IDs và Nhóm tuổi IDs phải là ID hợp lệ (phân cách bằng dấu phẩy)</li>
                  <li>Độ khó: Dễ, Trung bình, hoặc Khó</li>
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
                      suggestions={[
                        'Tải template mẫu và sử dụng đúng tên cột',
                        'Đảm bảo file có đầy đủ cột bắt buộc',
                        'Kiểm tra URL Game phải hợp lệ',
                        'Chủ đề IDs và Nhóm tuổi IDs phải là số, phân cách bằng dấu phẩy'
                      ]}
                    />
                  ) : (
                    <>
                      {totalRows > 0 && (
                        <div className="mb-4">
                          {isCheckingDuplicates ? (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-center gap-2 text-blue-700">
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
                          requiredColumns={['Tên game (EN)', 'Tên game (VI)', 'URL Game', 'Độ khó', 'Thời lượng (phút)', 'Chủ đề IDs', 'Nhóm tuổi IDs']}
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
              className="bg-blue-500 hover:bg-blue-600"
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
          title="Toàn bộ dữ liệu Games"
          headers={fullData.headers}
          rows={fullData.rows}
          totalRows={fullData.totalRows}
          currentPage={fullData.currentPage}
          pageSize={fullData.pageSize}
          onPageChange={handlePageChange}
          requiredColumns={['Tên game (EN)', 'Tên game (VI)', 'URL Game', 'Độ khó', 'Thời lượng (phút)', 'Chủ đề IDs', 'Nhóm tuổi IDs']}
          duplicateRows={fullData.duplicateRows || []}
        />
      )}
    </Dialog>
  );
}

export default ImportGamesModal;

