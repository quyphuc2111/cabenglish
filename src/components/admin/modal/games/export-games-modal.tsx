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
import { AdminGame } from "@/types/admin-game";

const exportOptions = [
  {
    id: "all",
    title: "Xuất tất cả dữ liệu",
    description: "Xuất toàn bộ danh sách games"
  },
  {
    id: "selected",
    title: "Xuất dữ liệu đã chọn (Đang phát triển)",
    description: "Chỉ xuất những games được chọn"
  },
  {
    id: "filtered",
    title: "Xuất dữ liệu đã lọc (Đang phát triển)",
    description: "Xuất dữ liệu theo bộ lọc hiện tại"
  }
];

function ExportGamesModal() {
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportOption, setExportOption] = React.useState<string>("all");

  const { isOpen, onClose, type } = useModal();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      if (exportOption === "all") {
        const response = await AdminGameService.getGames({
          page: 1,
          pageSize: 1000
        });

        if (response.success && response.data.games) {
          const exportData = response.data.games.map((game: AdminGame) => ({
            'Tên game (EN)': game.gameName,
            'Tên game (VI)': game.gameNameVi,
            'URL Game': game.urlGame,
            'URL Hình ảnh': game.imageUrl || '',
            'Mô tả (EN)': game.description || '',
            'Mô tả (VI)': game.descriptionVi || '',
            'Độ khó': game.difficultyLevel === 'easy' ? 'Dễ' : game.difficultyLevel === 'medium' ? 'Trung bình' : 'Khó',
            'Thời lượng (phút)': game.estimatedDuration,
            'Lượt thích': game.numLiked,
            'Chủ đề': game.topics.map(t => t.topicNameVi).join(', '),
            'Nhóm tuổi': game.ages.map(a => a.ageName).join(', '),
            'Trạng thái': game.isActive ? 'Hoạt động' : 'Không hoạt động'
          }));

          const worksheet = XLSX.utils.json_to_sheet(exportData);
          
          const columnWidths = [
            { wch: 30 }, // Tên game (EN)
            { wch: 30 }, // Tên game (VI)
            { wch: 40 }, // URL Game
            { wch: 40 }, // URL Hình ảnh
            { wch: 50 }, // Mô tả (EN)
            { wch: 50 }, // Mô tả (VI)
            { wch: 15 }, // Độ khó
            { wch: 15 }, // Thời lượng
            { wch: 12 }, // Lượt thích
            { wch: 40 }, // Chủ đề
            { wch: 30 }, // Nhóm tuổi
            { wch: 15 }  // Trạng thái
          ];
          worksheet['!cols'] = columnWidths;

          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách games');

          const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          
          const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'danh-sach-games.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);

          showToast.success("Xuất dữ liệu thành công!");
          handleClose();
        } else {
          showToast.error("Không thể lấy dữ liệu games");
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

  const isOptionAvailable = (optionId: string) => {
    return optionId === "all";
  };

  if (!isOpen || type !== "exportGames") return null;

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
              <span className="text-xl font-medium">Xuất Dữ Liệu Games</span>
            </motion.div>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-4"
        >
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

export default ExportGamesModal;

