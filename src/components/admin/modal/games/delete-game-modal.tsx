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
import { AdminGameService } from "@/services/admin-game.service";
import { toast } from "react-toastify";

export function DeleteGameModal() {
  const { isOpen, onClose, type, data } = useModal();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const selectedGame = data?.game;

  const handleConfirm = async () => {
    if (!selectedGame) return;

    setIsDeleting(true);
    try {
      await AdminGameService.deleteGame(selectedGame.gameId);
      toast.success("Xóa game thành công");

      if (data?.onSuccess) {
        data.onSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Error deleting game:", error);
      toast.error("Có lỗi xảy ra khi xóa game");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || type !== "deleteGame") return null;

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
                Bạn có chắc chắn muốn xóa game{" "}
                <span className="font-bold text-blue-600">{selectedGame?.gameNameVi}</span>?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700 flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>
                    Hành động này không thể hoàn tác và sẽ xóa toàn bộ dữ liệu liên quan đến game này.
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
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang xóa...</span>
                </div>
              ) : (
                "Xóa"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteGameModal;

