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
import { BadgePlus, Pencil } from "lucide-react";
import {
  lessonsFormSchema,
  LessonsFormValues
} from "@/lib/validations/lessons";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/ui/image-upload";
import { useSchoolWeek } from "@/hooks/use-schoolweek";
import { formatSelect, getSwValueById } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { LessonAdminType } from "@/types/lesson";
import {
  useCreateLessonByClassIdUnitId,
  useGetSingleLesson,
  useUpdateLessonByClassIdUnitId
} from "@/hooks/use-lessons";
import { useLessonStore } from "@/store/use-lesson-store";
import { showToast } from "@/utils/toast-config";
import { useLessonsValidation } from "@/hooks/use-lessons-validation";

// Cập nhật ANIMATIONS config
const ANIMATIONS = {
  form: {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.5, ease: "easeOut" }
    })
  },
  modal: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  },
  title: {
    initial: { x: -30, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12
      }
    }
  },
  button: {
    tap: { scale: 0.97 },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  }
};

function CreateUpdateLessonModal() {
  const { isOpen, onClose, type, data } = useModal();
  const formType = data?.formType;
  const lessonId = formType === "update" ? data?.lessonId : null;

  const {
    activeLesson,
  } = useLessonStore();

  // Hook validation để kiểm tra trùng lặp
  const {
    validateField,
    validateLesson,
    suggestNextOrder,
    isLoading: isValidationLoading
  } = useLessonsValidation(
    activeLesson.classId,
    activeLesson.unitId,
    formType === "update" ? lessonId : null
  );

  const classroomId = React.useMemo(() => {
    if (!data?.classroomId) {
      return null;
    }
    const id = Number(data.classroomId);
    return isNaN(id) ? null : id;
  }, [data?.classroomId]);

  const { data: schoolWeekData, isLoading: isLoadingSchoolWeek } =
    useSchoolWeek();

  const selectSchoolWeek = formatSelect(schoolWeekData?.data, "swId", "value");

  const { data: lessonData, isLoading } = useGetSingleLesson(
    lessonId,
    activeLesson.classId,
    activeLesson.unitId
  );

  const { mutate: createLesson, isPending: isCreating } =
    useCreateLessonByClassIdUnitId();

  const { mutate: updateLesson, isPending: isUpdatingLesson } =
    useUpdateLessonByClassIdUnitId(lessonId, activeLesson.classId, activeLesson.unitId);

  const isPending = isCreating || isUpdatingLesson || isLoading;

  const form = useForm<LessonsFormValues>({
    resolver: zodResolver(lessonsFormSchema),
    defaultValues: {
      schoolweek: 0,
      schoolWeekID: 0,
      lessonId: 0,
      lessonName: "",
      imageUrl: "",
      numLiked: 0,
      order: 0,
      isActive: true
    },
    mode: "onChange"
  });

  // Reset form và đóng modal
  const handleClose = React.useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  // Cập nhật order mặc định khi tạo mới (chỉ khi modal đã mở và có suggestNextOrder)
  React.useEffect(() => {
    if (isOpen && type === "createUpdateLessons" && formType === "create" && !isValidationLoading && suggestNextOrder > 0) {
      // Chỉ set nếu order hiện tại là 0 hoặc khác với suggestNextOrder
      const currentOrder = form.getValues("order");
      if (currentOrder === 0 || currentOrder !== suggestNextOrder) {
        form.setValue("order", suggestNextOrder);
      }
    }
  }, [isOpen, type, formType, suggestNextOrder, isValidationLoading, form]);

  React.useEffect(() => {
    if (!isOpen) {
      form.reset({
        schoolweek: 0,
        lessonId: 0,
        lessonName: "",
        imageUrl: "",
        numLiked: 0,
        order: 0,
        isActive: true
      });
    } else if (isOpen && type === "createUpdateLessons" && formType === "create") {
      // Reset form về trạng thái ban đầu cho tạo mới
      form.reset({
        schoolweek: 0,
        lessonId: 0,
        lessonName: "",
        imageUrl: "",
        numLiked: 0,
        order: !isValidationLoading && suggestNextOrder > 0 ? suggestNextOrder : 0,
        isActive: true
      });
      form.clearErrors();
    }
  }, [isOpen, type, formType, form, suggestNextOrder, isValidationLoading]);

  // Cập nhật form khi có dữ liệu
  React.useEffect(() => {
    if (formType === "update" && lessonData) {
      // Đảm bảo chuyển đổi schoolweek thành number
      const schoolweekId = Number(lessonData.schoolWeekID);

      const schoolWeekValue = getSwValueById(selectSchoolWeek, 'label', 'value', schoolweekId);

      // Đặt giá trị form
      form.reset({
        lessonName: lessonData.lessonName || "",
        order: lessonData.order || 0,
        schoolweek: schoolWeekValue || 0,
        schoolWeekID: lessonData.schoolWeekID || 0,
        imageUrl: lessonData.imageUrl || "",
        numLiked: lessonData.numLiked || 0,
        isActive: lessonData.isActive ?? true,
        lessonId: lessonData.lessonId || 0
      });

      form.trigger();
    }
  }, [lessonData, formType, form]);

  // Kiểm tra form hợp lệ
  const isFormValid = React.useMemo(() => {
    const lessonName = form.watch("lessonName");
    const schoolweek = form.watch("schoolweek");
    const order = form.watch("order");
    return (
      lessonName !== "" && schoolweek > 0 && order > 0 && classroomId !== null
    );
  }, [
    form.watch("lessonName"),
    form.watch("schoolweek"),
    form.watch("order"),
    classroomId
  ]);

  // Xử lý submit form
  const onSubmit = React.useCallback(
    async (values: LessonAdminType) => {
      if (!activeLesson.classId) {
        showToast.error("Không tìm thấy thông tin lớp học!");
        return;
      }

      if (!activeLesson.unitId) {
        showToast.error("Không tìm thấy thông tin unit!");
        return;
      }

      // Validation dữ liệu trước khi submit
      const validationResult = lessonsFormSchema.safeParse(values);
      if (!validationResult.success) {
        const errors = validationResult.error.errors;
        errors.forEach((error) => {
          const fieldName = error.path[0] as keyof LessonAdminType;
          form.setError(fieldName, {
            type: "manual",
            message: error.message
          });
        });
        showToast.error("Vui lòng kiểm tra lại thông tin!");
        return;
      }

      // Kiểm tra validation trước khi submit
      const customValidationResult = validateLesson(values);
      if (!customValidationResult.isValid) {
        if (customValidationResult.errors.lessonName) {
          form.setError("lessonName", {
            type: "manual",
            message: customValidationResult.errors.lessonName
          });
        }
        if (customValidationResult.errors.order) {
          form.setError("order", {
            type: "manual",
            message: customValidationResult.errors.order
          });
        }
        showToast.error("Vui lòng kiểm tra lại thông tin!");
        return;
      }

      // Validation bổ sung cho các trường bắt buộc
      if (!values.lessonName?.trim()) {
        form.setError("lessonName", {
          type: "manual",
          message: "Tên bài học không được để trống"
        });
        showToast.error("Vui lòng nhập tên bài học!");
        return;
      }

      if (!values.schoolweek || values.schoolweek <= 0) {
        form.setError("schoolweek", {
          type: "manual",
          message: "Vui lòng chọn tuần học"
        });
        showToast.error("Vui lòng chọn tuần học!");
        return;
      }

      if (!values.order || values.order <= 0) {
        form.setError("order", {
          type: "manual",
          message: "Thứ tự phải lớn hơn 0"
        });
        showToast.error("Vui lòng nhập thứ tự hợp lệ!");
        return;
      }

      if (!values.imageUrl?.trim()) {
        form.setError("imageUrl", {
          type: "manual",
          message: "Hình ảnh không được để trống"
        });
        showToast.error("Vui lòng chọn hình ảnh!");
        return;
      }

      console.log("Dữ liệu admin", values)

      try {
        if (formType === "create") {
          const formattedValues = {
            lessonData: [values],
            unitId: activeLesson.unitId,
            classId: activeLesson.classId
          };
          createLesson(formattedValues, {
            onSuccess: (response) => {
              if (response?.success) {
                showToast.success("Tạo bài học thành công!");
                handleClose();
              } else {
                showToast.error(
                  response?.error || "Có lỗi xảy ra khi tạo bài học!"
                );
              }
            },
            onError: (error) => {
              console.error("Create unit error:", error);
              showToast.error(
                error instanceof Error
                  ? `Lỗi: ${error.message}`
                  : "Đã có lỗi xảy ra khi tạo unit!"
              );
            }
          });
        } else {
          updateLesson(values, {
            onSuccess: (response) => {
              showToast.success("Cập nhật bài học thành công!");
              handleClose();
            },
            onError: (error) => {
              console.error("Update unit error:", error);
              showToast.error(
                error instanceof Error
                  ? `Lỗi: ${error.message}`
                  : "Đã có lỗi xảy ra khi cập nhật bài học!"
              );
            }
          });
        }
      } catch (error) {
        console.error("Operation error:", error);
        showToast.error(
          error instanceof Error
            ? `Lỗi: ${error.message}`
            : `Đã có lỗi xảy ra khi ${
                formType === "create" ? "tạo" : "cập nhật"
              } unit!`
        );
      }
    },
    [formType, createLesson, updateLesson, handleClose, activeLesson.classId, activeLesson.unitId, validateLesson, form]
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
    <AnimatePresence mode="wait">
      <Dialog
        open={isOpen && type === "createUpdateLessons"}
        onOpenChange={handleClose}
      >
        <DialogContent className="sm:max-w-[900px] !rounded-2xl overflow-y-auto bg-gradient-to-br from-white via-white to-blue-50/30 p-0 max-h-[90vh]">
          <motion.div
            variants={ANIMATIONS.modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="p-6 overflow-y-auto custom-scrollbar"
          >
            <DialogHeader className="border-b pb-4 mb-4 space-y-2">
              <DialogTitle>
                <motion.div
                  className="flex items-center gap-4"
                  {...ANIMATIONS.title}
                >
                  {formType === "create" ? (
                    <BadgePlus className="w-8 h-8 text-blue-500 animate-pulse" />
                  ) : (
                    <Pencil className="w-8 h-8 text-amber-500 animate-pulse" />
                  )}
                  <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                    {formType === "create"
                      ? "Thêm mới bài học"
                      : "Cập nhật bài học"}
                  </h2>
                </motion.div>
              </DialogTitle>
              <p className="text-muted-foreground text-sm px-12">
                {formType === "create"
                  ? "Vui lòng điền đầy đủ thông tin để tạo bài học mới"
                  : "Chỉnh sửa thông tin bài học theo mong muốn của bạn"}
              </p>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    variants={ANIMATIONS.form}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                    className="col-span-2 lg:col-span-1 space-y-1"
                  >
                    <FormField
                      control={form.control}
                      name="lessonName"
                      render={({ field }) => {
                        const currentLength = field.value?.length || 0;
                        const maxLength = 100;
                        const isNearLimit = currentLength > maxLength * 0.8;
                        
                        return (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-blue-700">
                              Tên bài học
                            </FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <Input
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value);
                                    
                                    // Validation real-time
                                    if (value.trim()) {
                                      const error = validateField("lessonName", value);
                                      if (error) {
                                        form.setError("lessonName", {
                                          type: "manual",
                                          message: error
                                        });
                                      } else {
                                        form.clearErrors("lessonName");
                                      }
                                    }
                                    
                                    // Validation cho độ dài ký tự
                                    if (value.length > maxLength) {
                                      form.setError("lessonName", {
                                        type: "manual",
                                        message: `Tên bài học không được vượt quá ${maxLength} ký tự`
                                      });
                                    } else if (value.length <= maxLength && form.formState.errors.lessonName?.message?.includes("không được vượt quá")) {
                                      form.clearErrors("lessonName");
                                    }
                                  }}
                                  disabled={isPending || isValidationLoading}
                                  placeholder="Nhập tên bài học..."
                                  className="h-11 text-base border-2 focus-visible:ring-1 focus-visible:ring-blue-400 focus:border-blue-400"
                                />
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-gray-500">
                                    Tối đa {maxLength} ký tự
                                  </span>
                                  <span className={`font-medium ${
                                    isNearLimit 
                                      ? currentLength >= maxLength 
                                        ? "text-red-500" 
                                        : "text-orange-500"
                                      : "text-gray-400"
                                  }`}>
                                    {currentLength}/{maxLength}
                                  </span>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </motion.div>
                  <motion.div
                    variants={ANIMATIONS.form}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                    className="col-span-2 lg:col-span-1 space-y-1"
                  >
                    <FormField
                      control={form.control}
                      name="schoolweek"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium text-emerald-700">
                            Tuần học
                          </FormLabel>
                          <FormControl>
                            <Select
                              disabled={isPending}
                              onValueChange={(value) => {
                                const numValue = Number(value);
                                field.onChange(numValue);
                                
                                if (formType === "create") {
                                  form.setValue("schoolweek", numValue, {
                                    shouldValidate: true,
                                    shouldDirty: true
                                  });
                                } else if (formType === "update") {
                                  // Tìm item tương ứng để lấy label
                                  const selectedItem = selectSchoolWeek?.find(item => item.value === numValue);
                                  if (selectedItem) {
                                    form.setValue("schoolWeekID", selectedItem.label, {
                                      shouldValidate: true,
                                      shouldDirty: true
                                    });
                                  }
                                }

                              }}
                              value={field.value?.toString()}
                              defaultValue={field.value?.toString()}
                            >
                              <SelectTrigger className="h-11 text-base border-2 focus-visible:ring-1 focus-visible:ring-emerald-400 focus:border-emerald-400">
                                <SelectValue placeholder="Chọn tuần học">
                                  {field.value
                                    ? `Tuần ${field.value}`
                                    : "Chọn tuần học"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="bg-white overflow-y-auto max-h-[300px]">
                                {selectSchoolWeek?.map((item) => (
                                  <SelectItem
                                    key={item.value}
                                    value={item.value.toString()}
                                    className="cursor-pointer"
                                  >
                                    Tuần {item.value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    variants={ANIMATIONS.form}
                    initial="hidden"
                    animate="visible"
                    custom={3}
                    className="col-span-2 lg:col-span-1 space-y-1"
                  >
                    <FormField
                      control={form.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium text-purple-700">
                            Thứ tự
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-3">
                              <Input
                                {...field}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  const finalValue = isNaN(value) ? 0 : value;
                                  field.onChange(finalValue);
                                  
                                  // Validation real-time
                                  if (finalValue > 0) {
                                    const error = validateField("order", finalValue);
                                    if (error) {
                                      form.setError("order", {
                                        type: "manual",
                                        message: error
                                      });
                                    } else {
                                      form.clearErrors("order");
                                    }
                                  }
                                }}
                                type="number"
                                min={1}
                                disabled={isPending || isValidationLoading}
                                placeholder="Nhập thứ tự..."
                                className="h-11 text-base border-2 focus-visible:ring-1 focus-visible:ring-purple-400 focus:border-purple-400"
                              />
                              {formType === "create" && suggestNextOrder > 0 && (
                                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                  <p className="text-sm text-blue-700 font-medium">
                                    💡 Hệ thống gợi ý thứ tự tiếp theo: <span className="font-bold text-blue-800">{suggestNextOrder}</span>
                                  </p>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    variants={ANIMATIONS.form}
                    initial="hidden"
                    animate="visible"
                    custom={4}
                    className="col-span-2 lg:col-span-1 space-y-1"
                  >
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium text-orange-700">
                            Trạng thái
                          </FormLabel>
                          <FormControl>
                            <div className="h-[50px] flex items-center justify-between rounded-lg border-2 px-4 bg-white focus-within:border-orange-400 hover:border-orange-400 transition-colors duration-200 focus-visible:ring-0 focus-visible:ring-offset-0">
                              <span
                                className={`text-sm font-medium ${
                                  field.value
                                    ? "text-green-600"
                                    : "text-red-600"
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>

                <motion.div
                  variants={ANIMATIONS.form}
                  initial="hidden"
                  animate="visible"
                  custom={5}
                  className="col-span-2 space-y-1"
                >
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium text-indigo-700">
                          Hình ảnh bài học
                        </FormLabel>
                        <FormControl>
                          <div className="">
                            <ImageUploader
                              value={field.value}
                              disabled={isPending}
                              onChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div className="flex justify-end gap-3 pt-4 border-t mt-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isPending}
                      className="border-2 hover:bg-gray-50 transition-all duration-200 min-w-[120px]"
                    >
                      Hủy
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isPending }
                      className={`
                        min-w-[120px]
                        ${
                          isPending
                            ? "bg-gray-400"
                            : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                        } 
                        text-white font-medium
                        shadow-lg hover:shadow-blue-200/50
                        transition-all duration-300
                      `}
                    >
                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang xử lý...</span>
                        </div>
                      ) : (
                        `${formType === "create" ? "Tạo" : "Cập nhật"} bài học`
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </Form>
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
}

export default CreateUpdateLessonModal;
