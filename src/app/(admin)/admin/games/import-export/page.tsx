"use client";

import { useState } from "react";
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { AdminContentLayout } from "@/components/admin-panel/admin-content-layout";
import { AdminGameService } from "@/services/admin-game.service";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const breadcrumbItems = [
  {
    title: "Quản lý trò chơi",
    link: "/admin/games"
  },
  {
    title: "Import/Export",
    link: "/admin/games/import-export"
  }
];

export default function ImportExportPage() {
  const [importMode, setImportMode] = useState<"create" | "overwrite" | "merge">("create");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    importedCount: number;
    errors: string[];
  } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        toast.error("Vui lòng chọn file Excel (.xlsx, .xls)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File không được lớn hơn 5MB");
        return;
      }

      setSelectedFile(file);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn file để import");
      return;
    }

    setImporting(true);
    setImportProgress(0);
    setImportResult(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await AdminGameService.importGames(selectedFile, importMode);
      
      clearInterval(progressInterval);
      setImportProgress(100);
      setImportResult(result);

      if (result.success) {
        toast.success(`Import thành công ${result.importedCount} games`);
      } else {
        toast.error("Import thất bại");
      }
    } catch (error) {
      console.error("Error importing games:", error);
      toast.error("Có lỗi xảy ra khi import");
      setImportResult({
        success: false,
        importedCount: 0,
        errors: ["Lỗi hệ thống, vui lòng thử lại"]
      });
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await AdminGameService.exportGames();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `games_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Export thành công");
    } catch (error) {
      console.error("Error exporting games:", error);
      toast.error("Có lỗi xảy ra khi export");
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await AdminGameService.downloadTemplate();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'games_import_template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Tải template thành công");
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Có lỗi xảy ra khi tải template");
    }
  };

  return (
    <AdminContentLayout breadcrumb={breadcrumbItems}>
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Import/Export Games</h2>
          <p className="text-gray-600 text-sm mt-1">
            Quản lý hàng loạt games thông qua file Excel
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Import Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Import Games
            </CardTitle>
            <CardDescription>
              Tải lên file Excel để thêm/cập nhật games hàng loạt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Download Template */}
            <Alert>
              <FileSpreadsheet className="h-4 w-4" />
              <AlertTitle>Tải template Excel</AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  Tải file mẫu để biết định dạng cần thiết cho import
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownloadTemplate}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Tải template
                </Button>
              </AlertDescription>
            </Alert>

            {/* Import Mode Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Chế độ import</label>
              <Select value={importMode} onValueChange={(value: any) => setImportMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="create">
                    <div>
                      <p className="font-medium">Tạo mới</p>
                      <p className="text-xs text-gray-500">Chỉ tạo games mới, bỏ qua ID trùng</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="overwrite">
                    <div>
                      <p className="font-medium">Ghi đè</p>
                      <p className="text-xs text-gray-500">Cập nhật games có ID tồn tại</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="merge">
                    <div>
                      <p className="font-medium">Kết hợp</p>
                      <p className="text-xs text-gray-500">Tạo mới + Ghi đè</p>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Chọn file Excel</label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  disabled={importing}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  {selectedFile ? (
                    <div>
                      <p className="font-medium text-blue-600">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">Click để chọn file</p>
                      <p className="text-sm text-gray-500">hoặc kéo thả file vào đây</p>
                      <p className="text-xs text-gray-400 mt-1">Hỗ trợ: .xlsx, .xls (tối đa 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Import Progress */}
            {importing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Đang import...</span>
                  <span>{importProgress}%</span>
                </div>
                <Progress value={importProgress} />
              </div>
            )}

            {/* Import Result */}
            {importResult && (
              <Alert variant={importResult.success ? "default" : "destructive"}>
                {importResult.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {importResult.success ? "Import thành công!" : "Import thất bại"}
                </AlertTitle>
                <AlertDescription>
                  <p className="mb-2">
                    Đã import: <strong>{importResult.importedCount}</strong> games
                  </p>
                  {importResult.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium text-sm mb-1">Lỗi ({importResult.errors.length}):</p>
                      <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                        {importResult.errors.map((error, index) => (
                          <li key={index} className="text-red-600">• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Import Button */}
            <Button
              onClick={handleImport}
              disabled={!selectedFile || importing}
              className="w-full gap-2"
            >
              <Upload className="w-4 h-4" />
              {importing ? "Đang import..." : "Bắt đầu import"}
            </Button>
          </CardContent>
        </Card>

        {/* Export Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Games
            </CardTitle>
            <CardDescription>
              Xuất danh sách games hiện tại ra file Excel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Thông tin xuất file</AlertTitle>
              <AlertDescription>
                <ul className="text-sm space-y-1 mt-2">
                  <li>✓ Xuất toàn bộ games trong hệ thống</li>
                  <li>✓ Bao gồm thông tin topics và ages</li>
                  <li>✓ Định dạng tương thích để import lại</li>
                  <li>✓ File có tên: games_export_[ngày].xlsx</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
              <div className="text-center">
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Xuất dữ liệu</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Tải xuống toàn bộ danh sách games dưới dạng file Excel
                </p>
                <Button
                  onClick={handleExport}
                  disabled={exporting}
                  size="lg"
                  className="gap-2"
                >
                  <Download className="w-5 h-5" />
                  {exporting ? "Đang xuất..." : "Xuất file Excel"}
                </Button>
              </div>
            </div>

            {/* Export Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-medium text-yellow-900 mb-2">
                💡 Mẹo sử dụng
              </p>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Export trước khi import để backup dữ liệu</li>
                <li>• Sử dụng file export để chỉnh sửa và import lại</li>
                <li>• File export có thể mở bằng Excel, Google Sheets</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Instructions */}
        <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn Import/Export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-500" />
                Hướng dẫn Import
              </h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li>1. Tải template Excel để biết định dạng</li>
                <li>2. Điền thông tin games theo các cột trong template</li>
                <li>3. Chọn chế độ import phù hợp:
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>- <strong>Tạo mới:</strong> Chỉ thêm games mới</li>
                    <li>- <strong>Ghi đè:</strong> Cập nhật games có sẵn</li>
                    <li>- <strong>Kết hợp:</strong> Thêm mới + Cập nhật</li>
                  </ul>
                </li>
                <li>4. Upload file và nhấn &quot;Bắt đầu import&quot;</li>
                <li>5. Kiểm tra kết quả và xử lý lỗi nếu có</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Download className="w-5 h-5 text-green-500" />
                Hướng dẫn Export
              </h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li>1. Nhấn nút &quot;Xuất file Excel&quot;</li>
                <li>2. File sẽ được tải về máy tự động</li>
                <li>3. Mở file bằng Excel hoặc Google Sheets</li>
                <li>4. Chỉnh sửa dữ liệu nếu cần</li>
                <li>5. Sử dụng file đã chỉnh sửa để import lại</li>
              </ol>
              
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-sm">Lưu ý quan trọng</AlertTitle>
                <AlertDescription className="text-xs">
                  <ul className="space-y-1 mt-1">
                    <li>• Không xóa hoặc đổi tên các cột trong template</li>
                    <li>• Topics và Ages phải tách nhau bằng dấu phẩy</li>
                    <li>• URL phải hợp lệ (bắt đầu bằng http/https)</li>
                    <li>• File size tối đa: 5MB</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>
    </AdminContentLayout>
  );
}

