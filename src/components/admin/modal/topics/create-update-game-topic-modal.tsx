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
import { AdminGameService } from "@/services/admin-game.service";
import { toast } from "react-toastify";

export function CreateUpdateGameTopicModal() {
  const { isOpen, onClose, type, data } = useModal();
  const selectedTopic = data?.gameTopic;
  const formType = selectedTopic ? "update" : "create";

  const [formData, setFormData] = React.useState<GameTopicFormData>({
    topicName: "",
    topicNameVi: "",
    description: "",
    iconUrl: "",
    order: 0,
    isActive: true
  });

  // Update form when modal opens with data
  React.useEffect(() => {
    if (isOpen && type === "createUpdateGameTopic") {
      if (selectedTopic) {
        setFormData({
          topicName: selectedTopic.topicName,
          topicNameVi: selectedTopic.topicNameVi,
          description: selectedTopic.description || "",
          iconUrl: selectedTopic.iconUrl || "",
          order: selectedTopic.order,
          isActive: selectedTopic.isActive
        });
      } else {
        // Reset form for create
        setFormData({
          topicName: "",
          topicNameVi: "",
          description: "",
          iconUrl: "",
          order: 0,
          isActive: true
        });
      }
    }
  }, [isOpen, type, selectedTopic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedTopic) {
        await AdminGameService.updateTopic(selectedTopic.topicId, formData);
        toast.success("Cập nhật chủ đề thành công");
      } else {
        await AdminGameService.createTopic(formData);
        toast.success("Tạo chủ đề thành công");
      }
      
      if (data?.onSuccess) {
        data.onSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Error saving topic:", error);
      toast.error("Có lỗi xảy ra khi lưu chủ đề");
    }
  };

  if (!isOpen || type !== "createUpdateGameTopic") return null;
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] !rounded-2xl overflow-y-auto bg-gradient-to-br from-white via-white to-blue-50/30 p-0 max-h-[90vh]">
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="topicName"
                  className="text-sm font-medium text-gray-700"
                >
                  Tên chủ đề (English) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="topicName"
                  value={formData.topicName}
                  onChange={(e) =>
                    setFormData({ ...formData, topicName: e.target.value })
                  }
                  placeholder="Animals, Numbers..."
                  className="border-gray-300 focus:border-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="topicNameVi"
                  className="text-sm font-medium text-gray-700"
                >
                  Tên chủ đề (Tiếng Việt) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="topicNameVi"
                  value={formData.topicNameVi}
                  onChange={(e) =>
                    setFormData({ ...formData, topicNameVi: e.target.value })
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="iconUrl"
                    className="text-sm font-medium text-gray-700"
                  >
                    Icon
                  </Label>
                  <Input
                    id="iconUrl"
                    value={formData.iconUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, iconUrl: e.target.value })
                    }
                    placeholder="🎮"
                    className="border-gray-300 focus:border-blue-500 text-2xl text-center"
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
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Kích hoạt chủ đề này
                </Label>
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

