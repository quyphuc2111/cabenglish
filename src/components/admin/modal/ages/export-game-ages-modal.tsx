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
import { AdminGameService } from "@/services/admin-game.service";
import { GameAge } from "@/types/admin-game";

// Định nghĩa các tùy chọn export
const exportOptions = [
  {
    id: "all",
    title: "Xuất tất cả dữ liệu",
    description: "Xuất toàn bộ danh sách nhóm tuổi"
  },
  {
    id: "selected",
    title: "Xuất dữ liệu đã chọn (Đang phát triển)",
    description: "Chỉ xuất những nhóm tuổi được chọn"
  },
  {
    id: "filtered",
    title: "Xuất dữ liệu đã lọc (Đang phát triển)",
    description: "Xuất dữ liệu theo bộ lọc hiện tại"
  }
];

function ExportGameAgesModal() {
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportOption, setExportOption] = React.useState<string>("all");

  const { isOpen, onClose, type } = useModal();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      if (exportOption === "all") {
        // Lấy dữ liệu ages
        const response = await AdminGameService.getAges({
          page: 1,
          pageSize: 1000 // Lấy tất cả
        });

        if (response.success && response.data.ages) {
          // Chuẩn bị dữ liệu cho xuất Excel
          const exportData = response.data.ages.map((age: GameAge) => ({
            'Tên nhóm tuổi (VI)': age.ageName,
            'Tên nhóm tuổi (EN)': age.ageNameEn,
            'Tuổi tối thiểu': age.minAge,
            'Tuổi tối đa': age.maxAge,
            'Mô tả': age.description || '',
            'Thứ tự': age.order
          }));

          // Tạo worksheet từ dữ liệu
          const worksheet = XLSX.utils.json_to_sheet(exportData);

          // Thiết lập độ rộng cột
          const columnWidths = [
            { wch: 30 }, // Tên nhóm tuổi (VI)
            { wch: 30 }, // Tên nhóm tuổi (EN)
            { wch: 15 }, // Tuổi tối thiểu
            { wch: 15 }, // Tuổi tối đa
            { wch: 40 }, // Mô tả
            { wch: 15 }  // Thứ tự
          ];
          worksheet['!cols'] = columnWidths;

          // Tạo workbook mới
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách nhóm tuổi');

          // Xuất ra buffer
          const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          
          // Tạo và tải xuống file
          const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'danh-sach-nhom-tuoi.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);

          showToast.success("Xuất dữ liệu thành công!");
          handleClose();
        } else {
          showToast.error("Không thể lấy dữ liệu nhóm tuổi");
        }
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

  if (!isOpen || type !== "exportGameAges") return null;

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
              <Download className="w-6 h-6 text-purple-500" />
              <span className="text-xl font-medium">Xuất Dữ Liệu Nhóm Tuổi</span>
            </motion.div>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-4"
        >
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
                    ${exportOption === option.id && isOptionAvailable(option.id) ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}
                    transition-colors duration-200`}
                >
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    className="text-purple-500"
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
              disabled={isExporting || !isOptionAvailable(exportOption)}
              className="bg-purple-500 hover:bg-purple-600"
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

export default ExportGameAgesModal;

