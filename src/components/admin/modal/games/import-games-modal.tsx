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
import { Upload, AlertCircle, CheckCircle, XCircle, FileDown } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useImportGames, ImportMode } from "@/hooks/use-import-games";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

const import_modes = [
  {
    id: "create" as ImportMode,
    title: "Tạo mới (Create)",
    description: "Chỉ tạo mới games, bỏ qua nếu order đã tồn tại"
  },
  {
    id: "overwrite" as ImportMode,
    title: "Ghi đè (Overwrite)",
    description: "Chỉ ghi đè nếu order đã tồn tại, bỏ qua nếu chưa có"
  },
  {
    id: "merge" as ImportMode,
    title: "Hợp nhất (Merge)",
    description: "Tạo mới hoặc ghi đè (update nếu order tồn tại, create nếu chưa có)"
  }
];

function ImportGamesModal() {
  const [selected_file, set_selected_file] = React.useState<File | null>(null);
  const [import_mode, set_import_mode] = React.useState<ImportMode>("merge");
  const file_input_ref = React.useRef<HTMLInputElement>(null);

  const { isOpen, onClose, type, data } = useModal();
  const { 
    is_importing, 
    upload_progress, 
    processing_progress,
    total_progress,
    import_result, 
    import_games, 
    reset_import_result 
  } = useImportGames();

  const handle_file_change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        alert('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
        return;
      }
      set_selected_file(file);
      reset_import_result();
    }
  };

  const handle_import = async () => {
    if (!selected_file) {
      alert('Vui lòng chọn file Excel');
      return;
    }

    const result = await import_games({
      file: selected_file,
      mode: import_mode
    });
    
    // Refetch data if successful
    if (result.success && result.data?.success_count && result.data.success_count > 0) {
      data?.onSuccess?.();
    }
  };

  const handle_close = () => {
    set_selected_file(null);
    set_import_mode("merge");
    reset_import_result();
    onClose();
  };

  const handle_choose_file = () => {
    file_input_ref.current?.click();
  };

  const handle_download_template = () => {
    const template_url = '/template_file/game-import-template.xlsx';
    const link = document.createElement('a');
    link.href = template_url;
    link.download = 'game-import-template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen || type !== "importGames") return null;

  return (
    <Dialog open={isOpen} onOpenChange={handle_close}>
      <DialogContent className="sm:max-w-[1200px] !rounded-xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
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
          className="flex-1 overflow-y-auto overflow-x-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-4">
          {/* File Upload Section */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">
                Chọn file Excel
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handle_download_template}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-7"
              >
                <FileDown className="w-3 h-3 mr-1" />
                <span className="text-xs">Tải template mẫu</span>
              </Button>
            </div>
            
            <input
              ref={file_input_ref}
              type="file"
              accept=".xlsx,.xls"
              onChange={handle_file_change}
              className="hidden"
            />
            
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handle_choose_file}
                disabled={is_importing}
                className="flex-shrink-0"
              >
                <Upload className="w-4 h-4 mr-2" />
                Chọn file
              </Button>
              
              {selected_file ? (
                <div className="flex-1 flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-2 rounded border">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="truncate">{selected_file.name}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    ({(selected_file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              ) : (
                <span className="text-sm text-gray-400">
                  Chưa chọn file nào
                </span>
              )}
            </div>
          </div>

          {/* Mode Selection */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Chế độ import
            </h3>
            <RadioGroup
              value={import_mode}
              onValueChange={(value) => set_import_mode(value as ImportMode)}
              className="space-y-2"
            >
              {import_modes.map((mode) => (
                <div
                  key={mode.id}
                  className={`flex items-center space-x-3 rounded-lg border p-3 cursor-pointer
                    ${import_mode === mode.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                    transition-colors duration-200`}
                >
                  <RadioGroupItem
                    value={mode.id}
                    id={mode.id}
                    className="text-blue-500"
                    disabled={is_importing}
                  />
                  <Label
                    htmlFor={mode.id}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium">{mode.title}</div>
                    <div className="text-xs text-gray-500">{mode.description}</div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Import Button in Form */}
          <div className="space-y-3">
            <Button
              onClick={handle_import}
              disabled={is_importing || !selected_file}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              {is_importing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang import...</span>
                </div>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Import dữ liệu
                </>
              )}
            </Button>

            {/* Upload Progress */}
            {is_importing && (
              <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
                {/* Total Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-medium text-blue-900">
                    <span>Tiến trình tổng</span>
                    <span>{total_progress}%</span>
                  </div>
                  <Progress value={total_progress} className="h-3 bg-blue-100" />
                </div>

                {/* Phase Details */}
                <div className="space-y-2 text-xs">
                  {/* Upload Phase */}
                  <div className="flex items-center justify-between text-gray-600">
                    <div className="flex items-center gap-2">
                      {upload_progress === 100 ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      )}
                      <span>1. Upload file</span>
                    </div>
                    <span className="font-medium">{upload_progress}%</span>
                  </div>

                  {/* Processing Phase */}
                  <div className="flex items-center justify-between text-gray-600">
                    <div className="flex items-center gap-2">
                      {processing_progress === 100 ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : upload_progress === 100 ? (
                        <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <div className="w-3 h-3 border border-gray-300 rounded-full" />
                      )}
                      <span>2. Xử lý dữ liệu</span>
                    </div>
                    <span className="font-medium">{processing_progress}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Result */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg h-full">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Kết quả import
            </h3>

            {!import_result ? (
              <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Kết quả import sẽ hiển thị ở đây</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Summary */}
                <Alert className={`${
                  import_result.data?.error_count === 0 
                    ? 'border-green-500 bg-green-50' 
                    : import_result.data?.success_count === 0
                    ? 'border-red-500 bg-red-50'
                    : 'border-yellow-500 bg-yellow-50'
                }`}>
                  <AlertDescription className="text-sm">
                    <div className="font-medium mb-2">{import_result.message}</div>
                    {import_result.data && (
                      <div className="space-y-1 text-xs">
                        <div>Tổng số dòng: <strong>{import_result.data.total_rows}</strong></div>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-green-600">✓ Thành công: <strong>{import_result.data.success_count}</strong></span>
                          <span className="text-blue-600">+ Tạo mới: <strong>{import_result.data.created_count}</strong></span>
                          <span className="text-orange-600">↻ Cập nhật: <strong>{import_result.data.updated_count}</strong></span>
                          <span className="text-red-600">✗ Lỗi: <strong>{import_result.data.error_count}</strong></span>
                        </div>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>

                {/* Error Details */}
                {import_result.data?.errors && import_result.data.errors.length > 0 && (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-700">
                        Chi tiết lỗi ({import_result.data.errors.length})
                      </span>
                    </div>
                    <ScrollArea className="h-[300px] border rounded-lg bg-white p-3">
                      <div className="space-y-1 pr-4">
                        {import_result.data.errors.map((error, index) => (
                          <div 
                            key={index}
                            className="text-xs text-gray-700 py-1 px-2 hover:bg-gray-50 rounded"
                          >
                            {error}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t flex-shrink-0">
          <Button
            variant="outline"
            onClick={handle_close}
            disabled={is_importing}
            className="border-2"
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ImportGamesModal;
