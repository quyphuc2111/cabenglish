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
import { AdminGameFormData } from "@/types/admin-game";
import { useModal } from "@/hooks/useModalStore";
import { AdminGameService } from "@/services/admin-game.service";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CreateUpdateGameModal() {
  const { isOpen, onClose, type, data } = useModal();
  const selectedGame = data?.game;
  const formType = selectedGame ? "update" : "create";
  const topicsData = data?.topicsData || [];
  const agesData = data?.agesData || [];

  const [formData, setFormData] = React.useState<AdminGameFormData>({
    gameName: "",
    gameNameVi: "",
    description: "",
    descriptionVi: "",
    imageUrl: "",
    urlGame: "",
    difficultyLevel: "easy",
    estimatedDuration: 5,
    isActive: true,
    topicIds: [],
    ageIds: []
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (selectedGame) {
      setFormData({
        gameName: selectedGame.gameName,
        gameNameVi: selectedGame.gameNameVi,
        description: selectedGame.description || "",
        descriptionVi: selectedGame.descriptionVi || "",
        imageUrl: selectedGame.imageUrl || "",
        urlGame: selectedGame.urlGame,
        difficultyLevel: selectedGame.difficultyLevel,
        estimatedDuration: selectedGame.estimatedDuration,
        isActive: selectedGame.isActive,
        topicIds: selectedGame.topics.map(t => t.topicId),
        ageIds: selectedGame.ages.map(a => a.ageId)
      });
    } else {
      setFormData({
        gameName: "",
        gameNameVi: "",
        description: "",
        descriptionVi: "",
        imageUrl: "",
        urlGame: "",
        difficultyLevel: "easy",
        estimatedDuration: 5,
        isActive: true,
        topicIds: [],
        ageIds: []
      });
    }
    setErrors({});
  }, [selectedGame, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.gameName.trim()) {
      newErrors.gameName = "Tên game (EN) là bắt buộc";
    }

    if (!formData.gameNameVi.trim()) {
      newErrors.gameNameVi = "Tên game (VI) là bắt buộc";
    }

    if (!formData.urlGame.trim()) {
      newErrors.urlGame = "URL game là bắt buộc";
    } else {
      // Validate URL format
      try {
        new URL(formData.urlGame);
      } catch {
        newErrors.urlGame = "URL không hợp lệ";
      }
    }

    if (formData.imageUrl && formData.imageUrl.trim()) {
      try {
        new URL(formData.imageUrl);
      } catch {
        newErrors.imageUrl = "URL hình ảnh không hợp lệ";
      }
    }

    if (formData.estimatedDuration < 1) {
      newErrors.estimatedDuration = "Thời lượng phải lớn hơn 0";
    }

    if (formData.topicIds.length === 0) {
      newErrors.topicIds = "Vui lòng chọn ít nhất 1 chủ đề";
    }

    if (formData.ageIds.length === 0) {
      newErrors.ageIds = "Vui lòng chọn ít nhất 1 nhóm tuổi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại các trường thông tin");
      return;
    }

    setIsSubmitting(true);

    try {
      if (selectedGame) {
        await AdminGameService.updateGame(selectedGame.gameId, formData);
        toast.success("Cập nhật game thành công");
      } else {
        await AdminGameService.createGame(formData);
        toast.success("Tạo game thành công");
      }

      if (data?.onSuccess) {
        data.onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Error saving game:", error);
      toast.error("Có lỗi xảy ra khi lưu game");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTopic = (topicId: number) => {
    setFormData(prev => ({
      ...prev,
      topicIds: prev.topicIds.includes(topicId)
        ? prev.topicIds.filter(id => id !== topicId)
        : [...prev.topicIds, topicId]
    }));
  };

  const toggleAge = (ageId: number) => {
    setFormData(prev => ({
      ...prev,
      ageIds: prev.ageIds.includes(ageId)
        ? prev.ageIds.filter(id => id !== ageId)
        : [...prev.ageIds, ageId]
    }));
  };

  if (!isOpen || type !== "createUpdateGame") return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            <div className="flex items-center gap-3">
              {formType === "update" ? (
                <Edit className="w-6 h-6 text-amber-500" />
              ) : (
                <Plus className="w-6 h-6 text-blue-500" />
              )}
              <h2 className="text-2xl font-semibold">
                {formType === "update" ? "Cập nhật game" : "Tạo game mới"}
              </h2>
            </div>
          </DialogTitle>
          <DialogDescription>
            {formType === "update" 
              ? "Chỉnh sửa thông tin game theo mong muốn của bạn" 
              : "Vui lòng điền đầy đủ thông tin để tạo game mới"}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4 ">
          <form onSubmit={handleSubmit} className="space-y-4 py-4 px-2 pb-6 h-[600px] overflow-y-auto">
            {/* Game Names */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gameName">
                  Tên game (English) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="gameName"
                  value={formData.gameName}
                  onChange={(e) => setFormData({ ...formData, gameName: e.target.value })}
                  placeholder="Animal Match"
                  disabled={isSubmitting}
                  className={errors.gameName ? "border-red-500" : ""}
                />
                {errors.gameName && (
                  <p className="text-sm text-red-500">{errors.gameName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gameNameVi">
                  Tên game (Tiếng Việt) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="gameNameVi"
                  value={formData.gameNameVi}
                  onChange={(e) => setFormData({ ...formData, gameNameVi: e.target.value })}
                  placeholder="Ghép đôi động vật"
                  disabled={isSubmitting}
                  className={errors.gameNameVi ? "border-red-500" : ""}
                />
                {errors.gameNameVi && (
                  <p className="text-sm text-red-500">{errors.gameNameVi}</p>
                )}
              </div>
            </div>

            {/* URLs */}
            <div className="space-y-2">
              <Label htmlFor="urlGame">
                URL Game <span className="text-red-500">*</span>
              </Label>
              <Input
                id="urlGame"
                type="url"
                value={formData.urlGame}
                onChange={(e) => setFormData({ ...formData, urlGame: e.target.value })}
                placeholder="https://example.com/game"
                disabled={isSubmitting}
                className={errors.urlGame ? "border-red-500" : ""}
              />
              {errors.urlGame && (
                <p className="text-sm text-red-500">{errors.urlGame}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL hình ảnh</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                disabled={isSubmitting}
                className={errors.imageUrl ? "border-red-500" : ""}
              />
              {errors.imageUrl && (
                <p className="text-sm text-red-500">{errors.imageUrl}</p>
              )}
            </div>

            {/* Difficulty & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficultyLevel">
                  Độ khó <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.difficultyLevel}
                  onValueChange={(value: any) => setFormData({ ...formData, difficultyLevel: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Dễ</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="hard">Khó</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedDuration">
                  Thời lượng (phút) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="estimatedDuration"
                  type="number"
                  min="1"
                  value={formData.estimatedDuration}
                  onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 0 })}
                  disabled={isSubmitting}
                  className={errors.estimatedDuration ? "border-red-500" : ""}
                />
                {errors.estimatedDuration && (
                  <p className="text-sm text-red-500">{errors.estimatedDuration}</p>
                )}
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả (English)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                placeholder="Match animal pairs to learn..."
                disabled={isSubmitting}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descriptionVi">Mô tả (Tiếng Việt)</Label>
              <Textarea
                id="descriptionVi"
                value={formData.descriptionVi}
                onChange={(e) => setFormData({ ...formData, descriptionVi: e.target.value })}
                rows={2}
                placeholder="Ghép đôi các con vật để học..."
                disabled={isSubmitting}
                className="resize-none"
              />
            </div>

            {/* Topics Selection */}
            <div className="space-y-2">
              <Label>
                Chủ đề <span className="text-red-500">*</span>
              </Label>
              <div className={`border rounded-md p-3 ${errors.topicIds ? 'border-red-500' : ''}`}>
                {topicsData.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {topicsData.map(topic => (
                      <label key={topic.topicId} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <Checkbox
                          checked={formData.topicIds.includes(topic.topicId)}
                          onCheckedChange={() => toggleTopic(topic.topicId)}
                          disabled={isSubmitting}
                        />
                        <span className="text-sm">{topic.iconUrl} {topic.topicNameVi}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Không có chủ đề nào</p>
                )}
              </div>
              {errors.topicIds && (
                <p className="text-sm text-red-500">{errors.topicIds}</p>
              )}
              {formData.topicIds.length > 0 && (
                <p className="text-xs text-gray-500">Đã chọn {formData.topicIds.length} chủ đề</p>
              )}
            </div>

            {/* Ages Selection */}
            <div className="space-y-2">
              <Label>
                Nhóm tuổi <span className="text-red-500">*</span>
              </Label>
              <div className={`border rounded-md p-3 ${errors.ageIds ? 'border-red-500' : ''}`}>
                {agesData.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {agesData.map(age => (
                      <label key={age.ageId} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded border">
                        <Checkbox
                          checked={formData.ageIds.includes(age.ageId)}
                          onCheckedChange={() => toggleAge(age.ageId)}
                          disabled={isSubmitting}
                        />
                        <span className="text-sm">👶 {age.ageName}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Không có nhóm tuổi nào</p>
                )}
              </div>
              {errors.ageIds && (
                <p className="text-sm text-red-500">{errors.ageIds}</p>
              )}
              {formData.ageIds.length > 0 && (
                <p className="text-xs text-gray-500">Đã chọn {formData.ageIds.length} nhóm tuổi</p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2 py-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                disabled={isSubmitting}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Kích hoạt game
              </Label>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[100px] bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
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
      </DialogContent>
    </Dialog>
  );
}

export default CreateUpdateGameModal;

