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
import { GameFormData } from "@/types/admin-game";
import { useModal } from "@/hooks/useModalStore";
import { useCreateGame, useUpdateGame } from "@/hooks/use-game";
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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { validateImageUrl } from "@/lib/utils";
import { ImageUploader } from "@/components/ui/image-upload";

// Zod validation schema
const gameFormSchema = z.object({
  game_name: z.string().min(1, "Tên game (EN) là bắt buộc"),
  game_name_vi: z.string().min(1, "Tên game (VI) là bắt buộc"),
  description: z.string().optional(),
  image_url: z.string().refine(
    (val) => {
      if (!val || val === "") return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "URL hình ảnh không hợp lệ" }
  ).optional(),
  url_game: z.string().refine(
    (val) => {
      if (!val) return false;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "URL game không hợp lệ" }
  ),
  difficulty_level: z.enum(["easy", "medium", "hard"], {
    errorMap: () => ({ message: "Độ khó phải là: easy, medium hoặc hard" })
  }),
  estimated_duration: z.number().min(1, "Thời lượng phải lớn hơn 0 giây"),
  is_active: z.boolean().optional(), // Optional - only for update
  order: z.number().min(1, "Thứ tự phải lớn hơn 0"),
  topic_ids: z.array(z.number().min(1, "Topic ID phải lớn hơn 0"))
    .min(1, "Vui lòng chọn ít nhất 1 chủ đề"),
  age_ids: z.array(z.number().min(1, "Age ID phải lớn hơn 0"))
    .min(1, "Vui lòng chọn ít nhất 1 nhóm tuổi"),
});

export function CreateUpdateGameModal() {
  const { isOpen, onClose, type, data } = useModal();
  const selectedGame = data?.game;
  const formType = selectedGame ? "update" : "create";
  const topicsData = data?.topicsData || [];
  const agesData = data?.agesData || [];
  const setLoadingRows = data?.setLoadingRows as ((fn: (prev: Set<number>) => Set<number>) => void) | undefined;

  const createGameMutation = useCreateGame();
  const updateGameMutation = useUpdateGame();

  const defaultValues: GameFormData = {
    game_name: "",
    game_name_vi: "",
    description: "",
    image_url: "",
    url_game: "",
    difficulty_level: "easy",
    estimated_duration: 5,
    order: 1,
    topic_ids: [],
    age_ids: []
  };

  const { 
    register, 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset,
    watch,
    setValue
  } = useForm<GameFormData>({
    resolver: zodResolver(gameFormSchema),
    defaultValues
  });

  // Watch topic_ids và age_ids để hiển thị count
  const watchedTopicIds = watch("topic_ids") || [];
  const watchedAgeIds = watch("age_ids") || [];

  React.useEffect(() => {
    if (isOpen) {
      if (selectedGame) {
        reset({
          game_name: selectedGame.game_name,
          game_name_vi: selectedGame.game_name_vi,
          description: selectedGame.description || "",
          image_url: selectedGame.image_url || "",
          url_game: selectedGame.url_game,
          difficulty_level: selectedGame.difficulty_level,
          estimated_duration: selectedGame.estimated_duration,
          is_active: selectedGame.is_active,
          order: 1, // Default order nếu không có
          topic_ids: selectedGame.topics.map(t => t.topic_id),
          age_ids: selectedGame.ages.map(a => a.age_id)
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [selectedGame, isOpen, reset]);

  const onSubmit = async (formData: GameFormData) => {
    console.log("📝 Form Data:", formData);
    
    // Set loading state for this row if updating
    if (selectedGame && setLoadingRows) {
      setLoadingRows((prev) => new Set(prev).add(selectedGame.game_id));
    }
    
    try {
      if (selectedGame) {
        // Update mode - send all data including is_active
        console.log("🔄 Update mode - gameId:", selectedGame.game_id);
        await updateGameMutation.mutateAsync({ 
          gameId: selectedGame.game_id, 
          data: formData 
        });
        toast.success("Cập nhật game thành công");
      } else {
        const { is_active, ...restData } = formData;
        const createData = {
          ...restData,
          description: restData.description || "",
          image_url: restData.image_url || "",
        };
        
        console.log("✨ Create mode - Data to send:", JSON.stringify(createData, null, 2));
        await createGameMutation.mutateAsync(createData as any);
        toast.success("Tạo game thành công");
      }

      if (data?.onSuccess) {
        data.onSuccess();
      }

      onClose();
    } catch (error: any) {
      console.error("❌ Error saving game:", error);
      console.log("📊 Error object:", {
        message: error?.message,
        statusCode: error?.statusCode,
        errors: error?.errors,
        errorType: typeof error,
      });
      
      // Display detailed error message with statusCode
      const errorMessage = error?.message || "Có lỗi xảy ra khi lưu game";
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
      // Clear loading state for this row if updating
      if (selectedGame && setLoadingRows) {
        setLoadingRows((prev) => {
          const newSet = new Set(prev);
          newSet.delete(selectedGame.game_id);
          return newSet;
        });
      }
    }
  };

  const toggleTopic = (topicId: number) => {
    const currentTopicIds = watch("topic_ids") || [];
    setValue(
      "topic_ids",
      currentTopicIds.includes(topicId)
        ? currentTopicIds.filter(id => id !== topicId)
        : [...currentTopicIds, topicId],
      { shouldValidate: true }
    );
  };

  const toggleAge = (ageId: number) => {
    const currentAgeIds = watch("age_ids") || [];
    setValue(
      "age_ids",
      currentAgeIds.includes(ageId)
        ? currentAgeIds.filter(id => id !== ageId)
        : [...currentAgeIds, ageId],
      { shouldValidate: true }
    );
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 px-2 pb-6 h-[600px] overflow-y-auto">
            {/* Game Names */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="game_name">
                  Tên game (English) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="game_name"
                  {...register("game_name")}
                  placeholder="Animal Match"
                  disabled={isSubmitting}
                  className={errors.game_name ? "border-red-500" : ""}
                />
                {errors.game_name && (
                  <p className="text-sm text-red-500">{errors.game_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="game_name_vi">
                  Tên game (Tiếng Việt) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="game_name_vi"
                  {...register("game_name_vi")}
                  placeholder="Ghép đôi động vật"
                  disabled={isSubmitting}
                  className={errors.game_name_vi ? "border-red-500" : ""}
                />
                {errors.game_name_vi && (
                  <p className="text-sm text-red-500">{errors.game_name_vi.message}</p>
                )}
              </div>
            </div>

            {/* URLs */}
            <div className="space-y-2">
              <Label htmlFor="url_game">
                URL Game <span className="text-red-500">*</span>
              </Label>
              <Input
                id="url_game"
                type="url"
                {...register("url_game")}
                placeholder="https://example.com/game"
                disabled={isSubmitting}
                className={errors.url_game ? "border-red-500" : ""}
              />
              {errors.url_game && (
                <p className="text-sm text-red-500">{errors.url_game.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Hình ảnh game</Label>
              <Controller
                name="image_url"
                control={control}
                render={({ field }) => (
                  <div>
                    <ImageUploader
                      value={field.value || ""}
                      disabled={isSubmitting}
                      onChange={field.onChange}
                    />
                    {errors.image_url && (
                      <p className="text-sm text-red-500 mt-2">{errors.image_url.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Difficulty & Duration & Order */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty_level">
                  Độ khó <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="difficulty_level"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
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
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated_duration">
                  Thời lượng (phút) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="estimated_duration"
                  type="number"
                  min="1"
                  {...register("estimated_duration", { valueAsNumber: true })}
                  disabled={isSubmitting}
                  className={errors.estimated_duration ? "border-red-500" : ""}
                />
                {errors.estimated_duration && (
                  <p className="text-sm text-red-500">{errors.estimated_duration.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">
                  Thứ tự <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="order"
                  type="number"
                  min="1"
                  {...register("order", { valueAsNumber: true })}
                  disabled={isSubmitting}
                  className={errors.order ? "border-red-500" : ""}
                />
                {errors.order && (
                  <p className="text-sm text-red-500">{errors.order.message}</p>
                )}
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả (English)</Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={2}
                placeholder="Match animal pairs to learn..."
                disabled={isSubmitting}
                className="resize-none"
              />
            </div>

            {/* Topics Selection */}
            <div className="space-y-2">
              <Label>
                Chủ đề <span className="text-red-500">*</span>
              </Label>
              <div className={`border rounded-md p-3 ${errors.topic_ids ? 'border-red-500' : ''}`}>
                {topicsData.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {topicsData.map(topic => (
                      <label key={topic.topic_id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <Checkbox
                          checked={watchedTopicIds.includes(topic.topic_id)}
                          onCheckedChange={() => toggleTopic(topic.topic_id)}
                          disabled={isSubmitting}
                        />

                        <div className="flex items-center gap-2">
                          {
                            validateImageUrl(topic.icon_url) ? (
                          
                            <Image
                              src={validateImageUrl(topic.icon_url)}
                              alt={topic.topic_name_vi}
                              width={48}
                              height={48}
                              className="rounded-sm"
                              unoptimized
                            />  
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-sm" />
                          )}
                          <span className="text-sm">{topic.topic_name_vi}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Không có chủ đề nào</p>
                )}
              </div>
              {errors.topic_ids && (
                <p className="text-sm text-red-500">{errors.topic_ids.message}</p>
              )}
              {watchedTopicIds.length > 0 && (
                <p className="text-xs text-gray-500">Đã chọn {watchedTopicIds.length} chủ đề</p>
              )}
            </div>

            {/* Ages Selection */}
            <div className="space-y-2">
              <Label>
                Nhóm tuổi <span className="text-red-500">*</span>
              </Label>
              <div className={`border rounded-md p-3 ${errors.age_ids ? 'border-red-500' : ''}`}>
                {agesData.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {agesData.map(age => (
                      <label key={age.age_id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded border">
                        <Checkbox
                          checked={watchedAgeIds.includes(age.age_id)}
                          onCheckedChange={() => toggleAge(age.age_id)}
                          disabled={isSubmitting}
                        />
                        <span className="text-sm">👶 {age.age_name}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Không có nhóm tuổi nào</p>
                )}
              </div>
              {errors.age_ids && (
                <p className="text-sm text-red-500">{errors.age_ids.message}</p>
              )}
              {watchedAgeIds.length > 0 && (
                <p className="text-xs text-gray-500">Đã chọn {watchedAgeIds.length} nhóm tuổi</p>
              )}
            </div>

            {/* Active Status - Only show for Update */}
            {formType === "update" && (
              <div className="flex items-center space-x-2 py-2">
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="is_active"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  )}
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  Kích hoạt game
                </Label>
              </div>
            )}
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
            type="submit"
            onClick={handleSubmit(onSubmit)}
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

