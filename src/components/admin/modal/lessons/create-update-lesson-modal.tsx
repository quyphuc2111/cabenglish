"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { BadgePlus, Pencil } from "lucide-react";
import {
  useCreateNotiType,
  useGetSingleNotiType,
  useUpdateNotiType
} from "@/hooks/use-notitype";
import {
  notiTypeFormSchema,
  NotiTypeFormValues
} from "@/lib/validations/notitype";
import { unitsFormSchema, UnitsFormValues } from "@/lib/validations/units";
import {
  useCreateUnitByClassId,
  useUpdateUnitByClassId
} from "@/hooks/use-units";
import {
  lessonsFormSchema,
  LessonsFormValues
} from "@/lib/validations/lessons";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/ui/image-upload";
import { useSchoolWeek } from "@/hooks/use-schoolweek";

// Thêm animation configs mới
const ANIMATIONS = {
  form: {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.5, ease: "easeOut" }
    })
  },
  title: {
    initial: { x: -50, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  },
  button: {
    tap: { scale: 0.98 },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  }
};

function CreateUpdateLessonModal() {
  const { isOpen, onClose, type, data } = useModal();
  const formType = data?.formType;
  const classId = formType === "update" ? data?.classroomId : null;
  const unitId = data?.unitId;

  const classroomId = React.useMemo(() => {
    if (!data?.classroomId) {
      console.error("Missing classroomId:", data);
      return null;
    }
    const id = Number(data.classroomId);
    return isNaN(id) ? null : id;
  }, [data?.classroomId]);

  const { data: schoolWeekData, isLoading: isLoadingSchoolWeek } = useSchoolWeek();

  const { data: unitData, isLoading } = useGetSingleNotiType(classId);
  const { mutate: createUnits, isPending: isCreating } =
    useCreateUnitByClassId(classroomId);
  const { mutate: updateUnits, isPending: isUpdating } =
    useUpdateUnitByClassId(classId);

  const isPending = isCreating || isUpdating || isLoading;

  const form = useForm<LessonsFormValues>({
    resolver: zodResolver(lessonsFormSchema),
    defaultValues: {
      schoolweek: 0,
      lessonId: 0,
      lessonName: "",
      imageUrl: "",
      numLiked: 0,
      order: 0,
      isActive: true // Mặc định là active
    },
    mode: "onChange"
  });

  // Reset form và đóng modal
  const handleClose = React.useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  // Kiểm tra form hợp lệ
  const isFormValid = React.useMemo(() => {
    const lessonName = form.watch("lessonName");
    const schoolweek = form.watch("schoolweek");
    const order = form.watch("order");
    return (
      lessonName !== "" &&
      schoolweek > 0 &&
      order > 0 &&
      classroomId !== null &&
      unitId !== null
    );
  }, [
    form.watch("lessonName"),
    form.watch("schoolweek"),
    form.watch("order"),
    classroomId,
    unitId
  ]);

  // Xử lý submit form
  const onSubmit = React.useCallback(
    async (values: UnitsFormValues) => {
      if (!classroomId) {
        toast.error("Không tìm thấy thông tin lớp học!");
        return;
      }

      try {
        if (formType === "create") {
          createUnits(values, {
            onSuccess: (response) => {
              if (response?.success) {
                toast.success("Tạo unit thành công!");
                handleClose();
              } else {
                toast.error(response?.error || "Có lỗi xảy ra khi tạo unit!");
              }
            },
            onError: (error) => {
              console.error("Create unit error:", error);
              toast.error(
                error instanceof Error
                  ? `Lỗi: ${error.message}`
                  : "Đã có lỗi xảy ra khi tạo unit!"
              );
            }
          });
        } else {
          updateUnits(values, {
            onSuccess: (response) => {
              if (response?.success) {
                toast.success("Cập nhật unit thành công!");
                handleClose();
              } else {
                toast.error(
                  response?.error || "Có lỗi xảy ra khi cập nhật unit!"
                );
              }
            },
            onError: (error) => {
              console.error("Update unit error:", error);
              toast.error(
                error instanceof Error
                  ? `Lỗi: ${error.message}`
                  : "Đã có lỗi xảy ra khi cập nhật unit!"
              );
            }
          });
        }
      } catch (error) {
        console.error("Operation error:", error);
        toast.error(
          error instanceof Error
            ? `Lỗi: ${error.message}`
            : `Đã có lỗi xảy ra khi ${
                formType === "create" ? "tạo" : "cập nhật"
              } unit!`
        );
      }
    },
    [formType, createUnits, updateUnits, handleClose, classroomId]
  );

  // Không render nếu không phải modal schoolweek
  if (!isOpen || type !== "createUpdateLessons") return null;
  // Disable form nếu không có classroomId hợp lệ
  if (!classroomId) {
    return (
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent>
          <div className="p-6 text-center">
            <p className="text-red-500 font-medium">
              Không tìm thấy thông tin lớp học! Vui lòng thử lại.
            </p>
            <Button onClick={handleClose} className="mt-4" variant="outline">
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <AnimatePresence>
      <Dialog
        open={isOpen && type === "createUpdateLessons"}
        onOpenChange={handleClose}
      >
        <DialogContent className="sm:max-w-[1100px] !rounded-3xl overflow-hidden bg-gradient-to-b from-white to-gray-50">
          <DialogHeader className="border-b pb-4">
            <DialogTitle>
              <motion.div
                className="flex items-center gap-5 w-full"
                {...ANIMATIONS.title}
              >
                {formType === "create" ? (
                  <BadgePlus className="w-7 h-7 text-blue-500" />
                ) : (
                  <Pencil className="w-7 h-7 text-amber-500" />
                )}
                <p className="text-2xl font-medium bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  {formType === "create"
                    ? "Thêm mới bài học"
                    : "Cập nhật bài học"}
                </p>
              </motion.div>
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-8">
                <motion.div
                  variants={ANIMATIONS.form}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                  className="hover:shadow-lg transition-shadow duration-300 rounded-lg p-4"
                >
                  <FormField
                    control={form.control}
                    name="lessonName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium text-blue-600">
                          Tên bài học
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Nhập tên bài học..."
                            className="text-base p-6 border-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-blue-400 transition-colors duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-base" />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-3 gap-8">
                {/* Tuần học */}
                <motion.div
                  variants={ANIMATIONS.form}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                  className="hover:shadow-lg transition-shadow duration-300 rounded-lg p-4"
                >
                  <FormField
                    control={form.control}
                    name="schoolweek"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium text-emerald-600">
                          Tuần học
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              field.onChange(isNaN(value) ? 0 : value);
                            }}
                            type="number"
                            min={1}
                            disabled={isPending}
                            placeholder="Nhập tuần học..."
                            className="text-base p-6 border-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-emerald-400 transition-colors duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-base" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Thứ tự */}
                <motion.div
                  variants={ANIMATIONS.form}
                  initial="hidden"
                  animate="visible"
                  custom={3}
                  className="hover:shadow-lg transition-shadow duration-300 rounded-lg p-4"
                >
                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium text-purple-600">
                          Thứ tự
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              field.onChange(isNaN(value) ? 0 : value);
                            }}
                            type="number"
                            min={1}
                            disabled={isPending}
                            placeholder="Nhập thứ tự..."
                            className="text-base p-6 border-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-purple-400 transition-colors duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-base" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Trạng thái */}
                <motion.div
                  variants={ANIMATIONS.form}
                  initial="hidden"
                  animate="visible"
                  custom={4}
                  className="hover:shadow-lg transition-shadow duration-300 rounded-lg p-4"
                >
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium text-orange-600">
                          Trạng thái
                        </FormLabel>
                        <FormControl>
                          <div className="h-[50px] flex items-center justify-between rounded-lg border-2 px-4 bg-white focus-within:border-orange-400 hover:border-orange-400 transition-colors duration-200 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <span
                              className={`text-sm font-medium ${
                                field.value ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {field.value
                                ? "Đang hoạt động"
                                : "Không hoạt động"}
                            </span>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isPending}
                              className={`${
                                field.value ? "bg-green-500" : "bg-gray-200"
                              } transition-colors duration-200`}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-base" />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>

              {/* Image Uploader */}
              <motion.div
                variants={ANIMATIONS.form}
                initial="hidden"
                animate="visible"
                custom={5}
                className="w-full hover:shadow-lg transition-shadow duration-300 rounded-lg p-4"
              >
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-medium text-indigo-600">
                        Hình ảnh bài học
                      </FormLabel>
                      <FormControl>
                        <ImageUploader
                          value={field.value}
                          disabled={isPending}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="text-base" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Buttons */}
              <motion.div className="flex justify-end gap-4 pt-4 border-t">
                <motion.div
                  whileHover={ANIMATIONS.button.hover}
                  whileTap={ANIMATIONS.button.tap}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isPending}
                    className="border-2 hover:border-gray-400 transition-colors duration-200"
                  >
                    Hủy
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={ANIMATIONS.button.hover}
                  whileTap={ANIMATIONS.button.tap}
                >
                  <Button
                    type="submit"
                    disabled={isPending || !isFormValid}
                    className={`${
                      isPending
                        ? "bg-gray-400"
                        : "bg-gradient-to-r from-blue-600 to-blue-400"
                    } text-white shadow-lg hover:shadow-blue-200 transition-shadow duration-200`}
                  >
                    {isPending
                      ? `Đang ${formType === "create" ? "tạo" : "cập nhật"}...`
                      : `${formType === "create" ? "Tạo" : "Cập nhật"} bài học`}
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
}

export default CreateUpdateLessonModal;
