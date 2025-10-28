"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit } from "lucide-react";
import { GameTopicFormData } from "@/types/admin-game";
import { useModal } from "@/hooks/useModalStore";
import { createTopic, updateTopic } from "@/app/api/actions/topics";
import { toast } from "react-toastify";
import { ImageUploader } from "@/components/ui/image-upload";

export function CreateUpdateGameTopicModal() {
  const { isOpen, onClose, type, data } = useModal();
  const selectedTopic = data?.gameTopic;
  const formType = selectedTopic ? "update" : "create";

  const [formData, setFormData] = React.useState<GameTopicFormData>({
    topic_name: "",
    topic_name_vi: "",
    description: "",
    icon_url: "",
    order: 0,
    is_active: true // Will be used for update only, not sent on create
  });

  // Update form when modal opens with data
  React.useEffect(() => {
    if (isOpen && type === "createUpdateGameTopic") {
      if (selectedTopic) {
        setFormData({
          topic_name: selectedTopic.topic_name,
          topic_name_vi: selectedTopic.topic_name_vi,
          description: selectedTopic.description || "",
          icon_url: selectedTopic.icon_url || "",
          order: selectedTopic.order,
          is_active: selectedTopic.is_active
        });
      } else {
        // Reset form for create
        setFormData({
          topic_name: "",
          topic_name_vi: "",
          description: "",
          icon_url: "",
          order: 0,
          is_active: true
        });
      }
    }
  }, [isOpen, type, selectedTopic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedTopic) {
        await updateTopic(selectedTopic.topic_id, formData);
        toast.success("Cập nhật chủ đề thành công");
      } else {
        await createTopic(formData);
        toast.success("Tạo chủ đề thành công");
      }
      
      if (data?.onSuccess) {
        data.onSuccess();
      }
      onClose();
    } catch (error: any) {
      console.error("❌ Error saving topic:", error);
      console.log("📊 Error object:", {
        message: error?.message,
        statusCode: error?.statusCode,
        errors: error?.errors,
        errorType: typeof error,
      });
      
      // Display detailed error message with statusCode
      const errorMessage = error?.message || "Có lỗi xảy ra khi lưu chủ đề";
      const statusCode = error?.statusCode;
      const errors = error?.errors || [];
      
      console.log("📝 Processing error display:");
      console.log("  - errorMessage:", errorMessage);
      console.log("  - statusCode:", statusCode);
      console.log("  - errors array:", errors);
      
      // Split by newline to get main message and error details
      const errorLines = errorMessage.split('\n').filter((line: string) => line.trim() !== '');
      
      console.log("  - errorLines:", errorLines);
      console.log("  - errorLines.length:", errorLines.length);
      
      if (errorLines.length > 1) {
        // Multiple errors - show in a list
        console.log("✅ Showing multiple errors in list format");
        toast.error(
          <div className="space-y-2">
            <p className="font-semibold text-base">{errorLines[0]}</p>
            <ul className="list-disc pl-4 space-y-1">
              {errorLines.slice(1).map((line: string, idx: number) => (
                <li key={idx} className="text-sm">{line}</li>
              ))}
            </ul>
          </div>,
          { autoClose: 7000 }
        );
      } else {
        // Single error message
        console.log("ℹ️ Showing single error message");
        toast.error(errorMessage, { autoClose: 5000 });
      }
    }
  };

  if (!isOpen || type !== "createUpdateGameTopic") return null;
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] !rounded-2xl overflow-y-auto bg-gradient-to-br from-white via-white to-blue-50/30 p-0 max-h-[90vh]">
        <div className="p-6">
          <DialogHeader className="border-b pb-4 mb-6 space-y-2">
            <DialogTitle>
              <div className="flex items-center gap-3">
                {selectedTopic ? (
                  <Edit className="w-6 h-6 text-amber-500" />
                ) : (
                  <Plus className="w-6 h-6 text-blue-500" />
                )}
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                  {selectedTopic ? "Cập nhật chủ đề" : "Tạo chủ đề mới"}
                </h2>
              </div>
            </DialogTitle>
            <DialogDescription className="px-9 text-sm">
              {selectedTopic
                ? "Chỉnh sửa thông tin chủ đề theo mong muốn của bạn"
                : "Vui lòng điền đầy đủ thông tin để tạo chủ đề mới"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
          <div className="space-y-2">
                <Label
                  htmlFor="topic_name"
                  className="text-sm font-medium text-gray-700"
                >
                  Tên chủ đề (English) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="topic_name"
                  value={formData.topic_name}
                  onChange={(e) =>
                    setFormData({ ...formData, topic_name: e.target.value })
                  }
                  placeholder="Animals, Numbers..."
                  className="border-gray-300 focus:border-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="topic_name_vi"
                  className="text-sm font-medium text-gray-700"
                >
                  Tên chủ đề (Tiếng Việt) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="topic_name_vi"
                  value={formData.topic_name_vi}
                  onChange={(e) =>
                    setFormData({ ...formData, topic_name_vi: e.target.value })
                  }
                  placeholder="Động vật, Số học..."
                  className="border-gray-300 focus:border-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Mô tả
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Nhập mô tả ngắn gọn về chủ đề..."
                  className="border-gray-300 focus:border-blue-500 resize-none"
                />
              </div>
          </div>
            <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Icon
                </Label>
                <ImageUploader
                  value={formData.icon_url}
                  onChange={(url) =>
                    setFormData({ ...formData, icon_url: url })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="order"
                  className="text-sm font-medium text-gray-700"
                >
                  Thứ tự <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="order"
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value)
                    })
                  }
                  className="border-gray-300 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label
                  htmlFor="is_active"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Kích hoạt chủ đề này
                </Label>
              </div>
            </div>
            </div>
            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="min-w-[100px]"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="min-w-[100px] bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                {selectedTopic ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

