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
import { useExportGames, ExportOption } from "@/hooks/use-export-games";

const export_options = [
  {
    id: "all" as ExportOption,
    title: "Xuất tất cả dữ liệu",
    description: "Xuất toàn bộ danh sách games"
  },
  {
    id: "selected" as ExportOption,
    title: "Xuất dữ liệu đã chọn",
    description: "Chỉ xuất những games được chọn"
  },
  {
    id: "filtered" as ExportOption,
    title: "Xuất dữ liệu đã lọc",
    description: "Xuất dữ liệu theo bộ lọc hiện tại"
  }
];

function ExportGamesModal() {
  const [export_option, set_export_option] = React.useState<ExportOption>("all");

  const { isOpen, onClose, type, data } = useModal();
  const { is_exporting, export_games, is_option_available, get_option_info } = useExportGames();
  
  // Data từ games container
  const selected_games = data?.selectedGames || [];
  const filter_params = data?.filterParams || {};
  const has_filters = data?.hasFilters || false;

  const handle_export = async () => {
    const result = await export_games(export_option, {
      selected_games,
      filter_params,
      has_filters
    });

    if (result.success) {
      handle_close();
    }
  };

  const handle_close = () => {
    set_export_option("all");
    onClose();
  };

  if (!isOpen || type !== "exportGames") return null;

  return (
    <Dialog open={isOpen} onOpenChange={handle_close}>
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
              value={export_option}
              onValueChange={(value) => set_export_option(value as ExportOption)}
              className="space-y-2"
            >
              {export_options.map((option) => {
                const is_available = is_option_available(option.id, {
                  selected_games,
                  filter_params,
                  has_filters
                });

                return (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-3 rounded-lg border p-3 
                      ${!is_available ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                      ${export_option === option.id && is_available ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                      transition-colors duration-200`}
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={option.id}
                      className="text-blue-500"
                      disabled={!is_available}
                    />
                    <Label
                      htmlFor={option.id}
                      className={`flex-1 ${!is_available ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="font-medium flex items-center gap-2">
                        {option.title}
                        {!is_available && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                            {option.id === 'selected' ? `Chưa chọn (0)` : 'Chưa lọc'}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {get_option_info(option.id, {
                          selected_games,
                          filter_params,
                          has_filters
                        })}
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-6 border-t">
            <Button
              variant="outline"
              onClick={handle_close}
              disabled={is_exporting}
              className="border-2"
            >
              Hủy
            </Button>
            <Button
              onClick={handle_export}
              disabled={is_exporting || !is_option_available(export_option, {
                selected_games,
                filter_params,
                has_filters
              })}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {is_exporting ? (
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

