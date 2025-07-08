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
import ExcelJS from 'exceljs';
import { useSchoolWeek } from "@/hooks/use-schoolweek";
import { SchoolWeekType } from "@/types/schoolweek";
import { showToast } from "@/utils/toast-config";
import { useLessonsByClassIdUnitId } from "@/hooks/use-lessons";
import { LessonAdminType, LessonType } from "@/types/lesson";
import { useLessonStore } from "@/store/use-lesson-store";
import { useGetSectionByLessonId } from "@/hooks/use-sections";
import { SectionAdminType } from "@/types/section";
import { useGetSectionContentBySectionId } from "@/hooks/useSectionContent";

// Định nghĩa các tùy chọn export
const exportOptions = [
  {
    id: "all",
    title: "Xuất tất cả dữ liệu",
    description: "Xuất toàn bộ danh sách lớp học"
  },
  {
    id: "selected",
    title: "Xuất dữ liệu đã chọn (Đang phát triển)",
    description: "Chỉ xuất những lớp học được chọn"
  },
  {
    id: "filtered",
    title: "Xuất dữ liệu đã lọc (Đang phát triển)",
    description: "Xuất dữ liệu theo bộ lọc hiện tại"
  }
];

function ExportSectionContentModal() {
    const [isExporting, setIsExporting] = React.useState(false);
    const [exportOption, setExportOption] = React.useState<string>("all");

    const { isOpen, onClose, type } = useModal();
    const { activeLesson } = useLessonStore();

    // const { data: lessons, isLoading: isLoadingLessons } = useLessonsByClassIdUnitId(activeLesson.classId, activeLesson.unitId);
    const { data: sectionContentData, isLoading: sectionContentLoading, error: sectionContentError } =
    useGetSectionContentBySectionId(Number(activeLesson.sectionId));
  const handleExport = async () => {
    try {
      setIsExporting(true);
      if (exportOption === "all" && sectionContentData) {
        // Tạo workbook mới
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Danh sách bài học');

        // Định nghĩa columns
        worksheet.columns = [
            { header: 'Tiêu đề', key: 'title', width: 50 },
            { header: 'Mô tả', key: 'description', width: 20 },
            { header: 'Iframe Url', key: 'iframe_url', width: 20 },
          { header: 'Hình ảnh', key: 'icon_url', width: 50 },
          { header: 'Thứ tự', key: 'order', width: 20 },
        ];

        // Thêm dữ liệu
        sectionContentData.forEach((sectionContent: any) => {
          worksheet.addRow({
            iconUrl: sectionContent.icon_url,
            title: sectionContent.title,
            description: sectionContent.description,
            iframe_url: sectionContent.iframe_url,
            icon_url: sectionContent.icon_url,
            order: sectionContent.order
          });
        });

        // Style cho header
        worksheet.getRow(1).eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '4472C4' }
          };
          cell.font = {
            bold: true,
            color: { argb: 'FFFFFF' },
            size: 12
          };
          cell.alignment = {
            horizontal: 'center',
            vertical: 'middle'
          };
        });

        // Tạo và tải xuống file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'danh-sach-section-content.xlsx';
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

  if (!isOpen || type !== "exportSectionContent") return null;

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
              <span className="text-xl font-medium">Xuất Dữ Liệu Section Content</span>
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

export default ExportSectionContentModal;
