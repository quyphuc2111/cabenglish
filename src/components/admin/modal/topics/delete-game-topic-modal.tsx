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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useModal } from "@/hooks/useModalStore";
import { deleteTopic } from "@/app/api/actions/topics";
import { toast } from "react-toastify";

export function DeleteGameTopicModal() {
  const { isOpen, onClose, type, data } = useModal();
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  const selectedTopic = data?.gameTopic;

  const handleConfirm = async () => {
    if (!selectedTopic) return;
    
    setIsDeleting(true);
    try {
      await deleteTopic(selectedTopic.topic_id);
      toast.success("Xóa chủ đề thành công");
      
      if (data?.onSuccess) {
        data.onSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Error deleting topic:", error);
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa chủ đề";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || type !== "deleteGameTopic") return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] !rounded-2xl bg-white">
        <div className="p-2">
          <DialogHeader className="pb-4 space-y-3">
            <DialogTitle>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-full">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Xác nhận xóa
                </h2>
              </div>
            </DialogTitle>
            <DialogDescription className="space-y-3">
              <p className="text-base text-gray-700">
                Bạn có chắc chắn muốn xóa chủ đề{" "}
                <span className="font-bold text-blue-600">
                  {selectedTopic?.topic_name_vi}
                </span>
                ?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700 flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>
                    Hành động này không thể hoàn tác và sẽ ảnh hưởng đến các
                    games liên kết với chủ đề này.
                  </span>
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="min-w-[100px]"
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              className="min-w-[100px] bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

