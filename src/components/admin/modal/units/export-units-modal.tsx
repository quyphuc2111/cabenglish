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
import { Download } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import * as XLSX from 'xlsx';
import { showToast } from "@/utils/toast-config";
import { useUnitByClassId } from "@/hooks/use-units";
import { Units } from "@/types/unit";

// Định nghĩa các tùy chọn export
const exportOptions = [
  {
    id: "all",
    title: "Xuất tất cả dữ liệu",
    description: "Xuất toàn bộ danh sách units theo lớp học đã chọn"
  },
  {
    id: "selected",
    title: "Xuất dữ liệu đã chọn (Đang phát triển)",
    description: "Chỉ xuất những units được chọn"
  },
  {
    id: "filtered",
    title: "Xuất dữ liệu đã lọc (Đang phát triển)",
    description: "Xuất dữ liệu theo bộ lọc hiện tại"
  }
];

function ExportUnitsModal() {
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportOption, setExportOption] = React.useState<string>("all");

  const { isOpen, onClose, type, data } = useModal();
  
  // Lấy selectedClassId từ meta của table hoặc data của modal
  const selectedClassId = data?.selectedClassId || data?.classroomId;
  
  const { data: unitsData, isLoading: unitsLoading, error: unitsError } =
    useUnitByClassId(selectedClassId || "");

  const handleExport = async () => {
    try {
      setIsExporting(true);
      if (exportOption === "all" && unitsData?.data) {
        // Chuẩn bị dữ liệu cho xuất Excel
        const exportData = unitsData?.data.map((unit: Units) => ({
          'Tên Unit': unit.unitName,
          'Thứ tự': unit.order
        }));

        // Tạo worksheet từ dữ liệu
        const worksheet = XLSX.utils.json_to_sheet(exportData);

        // Thiết lập độ rộng cột
        const columnWidths = [
          { wch: 50 }, // Tên Unit
          { wch: 15 }  // Thứ tự
        ];
        worksheet['!cols'] = columnWidths;

        // Tạo workbook mới
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách Units');

        // Xuất ra buffer
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        
        // Tạo và tải xuống file
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'danh-sach-units.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);

        showToast.success("Xuất dữ liệu thành công!");
        handleClose();
      }
    } catch (error) {
      console.error("Export error:", error);
      showToast.error("Có lỗi xảy ra khi xuất dữ liệu");
    } finally {
      setIsExporting(false);
    }
  };

  const handleClose = () => {
    setExportOption("all");
    onClose();
  };

  // Kiểm tra xem option có available không
  const isOptionAvailable = (optionId: string) => {
    return optionId === "all";
  };

  if (!isOpen || type !== "exportUnits") return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] !rounded-xl">
        <DialogHeader>
          <DialogTitle>
            <motion.div
              className="flex items-center gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Download className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-medium">Xuất Dữ Liệu Units</span>
            </motion.div>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-4"
        >
          {/* Thông tin lớp học */}
          {/* <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
            <h4 className="text-sm font-medium text-blue-700 mb-2">
              Thông tin xuất dữ liệu
            </h4>
            <div className="text-sm text-blue-600">
              {selectedClassId ? (
                <>
                  <p>Lớp học ID: {selectedClassId}</p>
                  <p>Số lượng units: {unitsData?.data?.length || 0}</p>
                  {unitsLoading && <p>Đang tải dữ liệu...</p>}
                  {unitsError && <p className="text-red-600">Lỗi tải dữ liệu</p>}
                </>
              ) : (
                <p className="text-amber-600">Vui lòng chọn lớp học trước khi xuất dữ liệu</p>
              )}
            </div>
          </div> */}

          {/* Export Options */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Tùy chọn xuất dữ liệu
            </h3>
            <RadioGroup
              value={exportOption}
              onValueChange={setExportOption}
              className="space-y-2"
            >
              {exportOptions.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center space-x-3 rounded-lg border p-3 
                    ${!isOptionAvailable(option.id) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                    ${exportOption === option.id && isOptionAvailable(option.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
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

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 mt-6 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isExporting}
              className="border-2"
            >
              Hủy
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting || !isOptionAvailable(exportOption) || !selectedClassId || !unitsData?.data?.length}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isExporting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                "Xuất dữ liệu"
              )}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export default ExportUnitsModal;
