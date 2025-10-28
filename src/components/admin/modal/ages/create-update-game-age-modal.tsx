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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit } from "lucide-react";
import { GameAgeFormData } from "@/types/admin-game";
import { useModal } from "@/hooks/useModalStore";
import { createAge, updateAge } from "@/app/api/actions/age";
import { toast } from "react-toastify";

export function CreateUpdateGameAgeModal() {
  const { isOpen, onClose, type, data } = useModal();
  const selectedAge = data?.gameAge;
  const formType = selectedAge ? "update" : "create";

  const [formData, setFormData] = React.useState<GameAgeFormData>({
    age_name: "",
    age_name_en: "",
    description: "",
    min_age: 3,
    max_age: 4,
    order: 0
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (selectedAge) {
      setFormData({
        age_name: selectedAge.age_name,
        age_name_en: selectedAge.age_name_en,
        description: selectedAge.description || "",
        min_age: selectedAge.min_age,
        max_age: selectedAge.max_age,
        order: selectedAge.order
      });
    } else {
      setFormData({
        age_name: "",
        age_name_en: "",
        description: "",
        min_age: 3,
        max_age: 4,
        order: 0
      });
    }
  }, [selectedAge, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.min_age >= formData.max_age) {
      toast.error("Tuổi tối thiểu phải nhỏ hơn tuổi tối đa");
      return;
    }

    setIsSubmitting(true);

    try {
      if (selectedAge) {
        await updateAge(selectedAge.age_id, formData);
        toast.success("Cập nhật nhóm tuổi thành công");
      } else {
        await createAge(formData);
        toast.success("Tạo nhóm tuổi thành công");
      }

      if (data?.onSuccess) {
        data.onSuccess();
      }

      onClose();
    } catch (error: any) {
      console.error("❌ Error saving age:", error);
      console.log("📊 Error object:", {
        message: error?.message,
        statusCode: error?.statusCode,
        errors: error?.errors,
        errorType: typeof error,
      });
      
      // Display detailed error message with statusCode
      const errorMessage = error?.message || "Có lỗi xảy ra khi lưu nhóm tuổi";
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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || type !== "createUpdateGameAge") return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] !rounded-2xl overflow-y-auto bg-gradient-to-br from-white via-white to-purple-50/30 p-0 max-h-[90vh]">
        <div className="p-6">
          <DialogHeader className="border-b pb-4 mb-6 space-y-2">
            <DialogTitle>
              <div className="flex items-center gap-3">
                {formType === "update" ? (
                  <Edit className="w-6 h-6 text-amber-500" />
                ) : (
                  <Plus className="w-6 h-6 text-purple-500" />
                )}
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
                  {formType === "update" ? "Cập nhật nhóm tuổi" : "Tạo nhóm tuổi mới"}
                </h2>
              </div>
            </DialogTitle>
            <DialogDescription className="px-9 text-sm">
              {formType === "update" 
                ? "Chỉnh sửa thông tin nhóm tuổi theo mong muốn của bạn" 
                : "Vui lòng điền đầy đủ thông tin để tạo nhóm tuổi mới"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age_name" className="text-sm font-medium text-gray-700">
                  Tên nhóm tuổi (Tiếng Việt) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="age_name"
                  value={formData.age_name}
                  onChange={(e) => setFormData({ ...formData, age_name: e.target.value })}
                  placeholder="3-4 tuổi"
                  className="border-gray-300 focus:border-purple-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age_name_en" className="text-sm font-medium text-gray-700">
                  Tên nhóm tuổi (English) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="age_name_en"
                  value={formData.age_name_en}
                  onChange={(e) => setFormData({ ...formData, age_name_en: e.target.value })}
                  placeholder="3-4 years old"
                  className="border-gray-300 focus:border-purple-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_age" className="text-sm font-medium text-gray-700">
                    Tuổi tối thiểu <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="min_age"
                    type="number"
                    min="0"
                    max="12"
                    value={formData.min_age}
                    onChange={(e) => setFormData({ ...formData, min_age: parseInt(e.target.value) })}
                    className="border-gray-300 focus:border-purple-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_age" className="text-sm font-medium text-gray-700">
                    Tuổi tối đa <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="max_age"
                    type="number"
                    min="0"
                    max="12"
                    value={formData.max_age}
                    onChange={(e) => setFormData({ ...formData, max_age: parseInt(e.target.value) })}
                    className="border-gray-300 focus:border-purple-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              {formData.min_age >= formData.max_age && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>Tuổi tối thiểu phải nhỏ hơn tuổi tối đa</span>
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Mô tả
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Nhập mô tả ngắn gọn về nhóm tuổi..."
                  className="border-gray-300 focus:border-purple-500 resize-none"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order" className="text-sm font-medium text-gray-700">
                  Thứ tự hiển thị <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="order"
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="border-gray-300 focus:border-purple-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter className="gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="min-w-[100px]"
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={formData.min_age >= formData.max_age || isSubmitting}
                className="min-w-[100px] bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  formType === "update" ? "Cập nhật" : "Tạo mới"
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateUpdateGameAgeModal;

