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
import { showToast } from "@/utils/toast-config";
import { UnitsFormValues } from "@/lib/validations/units";
import { useCreateManyUnitsByClassId } from "@/hooks/use-units";

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

function ImportUnitsModal() {
  const { isOpen, onClose, type, data } = useModal();
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [importOption, setImportOption] = React.useState<string>("create");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [previewData, setPreviewData] = React.useState<PreviewData | null>(null);
  
  const selectedClassId = data?.selectedClassId || data?.classroomId;
  
  const { mutate: createManyUnits, isPending: isCreating } = useCreateManyUnitsByClassId(
    selectedClassId ? Number(selectedClassId) : null
  );

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
    const selectedFile = event.target.files?.[0];
      if (!selectedFile) return;

      // Kiểm tra định dạng file
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        showToast.error("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
        return;
      }

      // Kiểm tra kích thước
      if (selectedFile.size > 5 * 1024 * 1024) {
        showToast.error("Kích thước file không được vượt quá 5MB");
        return;
      }

      // Tạo bản sao của file để tránh vấn đề permission
      const fileClone = new File([selectedFile], selectedFile.name, {
        type: selectedFile.type,
      });
      
      setFile(fileClone);
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
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      if (!droppedFile.name.endsWith('.xlsx') && !droppedFile.name.endsWith('.xls')) {
        showToast.error("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
        return;
      }
      if (droppedFile.size > 5 * 1024 * 1024) {
        showToast.error("Kích thước file không được vượt quá 5MB");
        return;
      }
      setFile(droppedFile);
      generatePreview(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showToast.error("Vui lòng chọn file để import");
      return;
    }

    if (!selectedClassId) {
      showToast.error("Không tìm thấy thông tin lớp học!");
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

      // Kiểm tra các cột bắt buộc cho units
      const requiredColumns = ['Tên Unit', 'Thứ tự', 'Tiến độ'];
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

      // Chuyển đổi sang định dạng UnitsFormValues
      const unitsListData: UnitsFormValues[] = formattedData.map((item) => ({
        unitId: 0, // API sẽ tự sinh
        unitName: item["Tên Unit"],
        order: Number(item["Thứ tự"]) || 0,
        progress: Number(item["Tiến độ"]) || 0,
      }));

      // Validate dữ liệu
      const invalidRows = unitsListData.filter(unit => 
        !unit.unitName || unit.order <= 0 || unit.progress < 0 || unit.progress > 1
      );

      if (invalidRows.length > 0) {
        throw new Error(`Có ${invalidRows.length} dòng dữ liệu không hợp lệ. Vui lòng kiểm tra lại.`);
      }

      console.log("Số hàng dữ liệu:", filteredRows.length);
      console.log("Dữ liệu đã format:", unitsListData);

      if (importOption === "create") {
        createManyUnits(unitsListData, {
          onSuccess: (response) => {
            if (response?.success) {
              showToast.success(`Import dữ liệu thành công! ${response.message}`);
              handleClose();
            } else {
              showToast.error(response?.error || "Có lỗi xảy ra khi import dữ liệu");
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
    setPreviewData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  // Kiểm tra xem option có available không
  const isOptionAvailable = (optionId: string) => {
    return optionId === "create";
  };

  const handleDownloadTemplate = () => {
    const templateUrl = "/template_file/units-template.xlsx";
    const a = document.createElement("a");
    a.href = templateUrl;
    a.download = "units-template.xlsx";
    a.click();
  };

  // Thêm hàm generatePreview
  const generatePreview = async (file: File) => {
    try {
      // Đọc file dưới dạng ArrayBuffer
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

      setPreviewData({
        headers: jsonData[0] as string[],
        rows: jsonData.slice(1, 6) as any[][] // Chỉ lấy 5 dòng đầu để preview
      });
    } catch (error) {
      console.error("Lỗi khi đọc file Excel:", error);
      showToast.error("Không thể đọc file Excel");
    }
  };

  if (!isOpen || type !== "importUnits") return null;

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
              <span className="text-xl font-medium">Import Dữ Liệu Units</span>
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
            {/* Cột trái: Upload và Options */}
            <div className="space-y-6">
              {/* Drop zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center
                  ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400'}
                  transition-colors duration-200 cursor-pointer`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx,.xls"
                  className="hidden"
                />
                
                <div className="flex flex-col items-center gap-3">
                  <Upload className={`w-10 h-10 ${file ? 'text-green-500' : 'text-gray-400'}`} />
                  {file ? (
                    <>
                      <p className="text-green-600 font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium">Kéo thả file hoặc click để chọn</p>
                      <p className="text-sm text-gray-500">
                        Hỗ trợ file Excel (.xlsx, .xls) - Tối đa 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Import Options */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Tùy chọn import
                </h3>
                <RadioGroup
                  value={importOption}
                  onValueChange={setImportOption}
                  className="space-y-2"
                >
                  {importOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center space-x-3 rounded-lg border p-3 
                        ${!isOptionAvailable(option.id) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                        ${importOption === option.id && isOptionAvailable(option.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                        transition-colors duration-200`}
                    >
                      <RadioGroupItem
                        value={option.id}
                        id={option.id}
                        className="text-blue-500"
                        disabled={!isOptionAvailable(option.id)}
                      />
                      <Label
                        htmlFor={option.id}
                        className={`flex-1 ${!isOptionAvailable(option.id) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="font-medium flex items-center gap-2">
                          {option.title}
                          {!isOptionAvailable(option.id) && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                              Sắp ra mắt
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {option.description}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
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
                  <li>Các cột bắt buộc: Tên Unit, Thứ tự, Tiến độ</li>
                  <li>Tiến độ phải là số từ 0 đến 1 (0 = 0%, 1 = 100%)</li>
                  <li>Không thay đổi tên và thứ tự các cột trong template</li>
                  <li>Dữ liệu trong file Excel phải đúng định dạng quy định</li>
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
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Xem trước dữ liệu
                  </h4>
                  {previewData ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {previewData.headers.map((header, index) => (
                              <th
                                key={index}
                                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {previewData.rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="px-3 py-2 text-xs text-gray-500 truncate max-w-[200px]"
                                >
                                  {cell?.toString() || ''}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="text-xs text-gray-500 mt-2">
                        * Chỉ hiển thị 5 dòng đầu tiên
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 flex items-center justify-center py-4">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
                      Đang tải dữ liệu...
                    </div>
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
              disabled={!file || isUploading || !isOptionAvailable(importOption) || isCreating || !selectedClassId}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isUploading || isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                "Import"
              )}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export default ImportUnitsModal;
