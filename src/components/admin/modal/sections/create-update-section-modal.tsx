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
  sectionFormSchema,
  type SectionFormValues
} from "@/lib/validations/section";
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
import { ImageUploader } from "@/components/ui/image-upload";
import { BadgePlus, Pencil } from "lucide-react";
import { useCreateSection, useUpdateSection } from "@/hooks/use-sections";
import { useSectionsValidation } from "@/hooks/use-sections-validation";
import { showToast } from "@/utils/toast-config";
import { SectionAdminType } from "@/types/section";

const formAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      ease: "easeOut" as const
    }
  })
};

const buttonAnimation = {
  tap: { scale: 0.95 },
  hover: { scale: 1.05 }
};

function CreateUpdateSectionModal() {
  const { isOpen, onClose, type, data } = useModal();
  const formType = data?.formType;
  const sectionId = formType === "update" ? data?.sections?.[0]?.sectionId : null;
  const lessonId = data?.lessonIds;

  console.log("🔧 CreateUpdateSectionModal data:", {
    formType,
    sectionId,
    lessonId,
    sections: data?.sections,
    fullData: data
  });
  
  // Hook validation để kiểm tra trùng lặp
  const {
    validateField,
    validateSection,
    suggestNextOrder,
    isLoading: isValidationLoading
  } = useSectionsValidation(
    Array.isArray(lessonId) ? lessonId[0] : lessonId as number,
    formType === "update" ? sectionId?.toString() : null
  );

  // Lấy dữ liệu section trực tiếp từ modal data thay vì gọi API
  const sectionData = formType === "update" ? data?.sections?.[0] : null;
  
  const { mutate: createSection, isPending: isCreating } = useCreateSection();
  const { mutate: updateSection, isPending: isUpdating } = useUpdateSection();

  const isPending = isCreating || isUpdating || isValidationLoading;

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      sectionName: "",
      iconUrl: "",
      estimateTime: "",
      order: 0
    }
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Cập nhật order mặc định khi tạo mới (chỉ khi modal đã mở và có suggestNextOrder)
  React.useEffect(() => {
    if (isOpen && type === "createUpdateSection" && formType === "create" && !isValidationLoading && suggestNextOrder > 0) {
      // Chỉ set nếu order hiện tại là 0 hoặc khác với suggestNextOrder
      const currentOrder = form.getValues("order");
      if (currentOrder === 0 || currentOrder !== suggestNextOrder) {
        form.setValue("order", suggestNextOrder);
      }
    }
  }, [isOpen, type, formType, suggestNextOrder, isValidationLoading, form]);

  // Cập nhật form khi có dữ liệu từ API
  React.useEffect(() => {
    if (!isOpen) {
      form.reset({
        sectionName: "",
        iconUrl: "",
        estimateTime: "",
        order: 0
      });
    } else if (isOpen && type === "createUpdateSection" && formType === "create") {
      // Reset form về trạng thái ban đầu cho tạo mới
      form.reset({
        sectionName: "",
        iconUrl: "",
        estimateTime: "",
        order: !isValidationLoading && suggestNextOrder > 0 ? suggestNextOrder : 0
      });
      form.clearErrors();
    }
  }, [isOpen, type, formType, form, suggestNextOrder, isValidationLoading]);

  // Cập nhật form khi có dữ liệu từ modal data
  React.useEffect(() => {
    if (formType === "update" && sectionData) {
      
      form.reset({
        sectionName: sectionData.sectionName || "",
        iconUrl: sectionData.iconUrl || "",
        estimateTime: sectionData.estimateTime || "",
        order: sectionData.order || 0
      });
    }
  }, [sectionData, formType, form]);

  // Sửa lại hàm submit
  const onSubmit = React.useCallback(async (values: SectionFormValues) => {
    
    // Validation dữ liệu trước khi submit
    const validationResult = sectionFormSchema.safeParse(values);
    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      errors.forEach((error) => {
        const fieldName = error.path[0] as keyof SectionFormValues;
        form.setError(fieldName, {
          type: "manual",
          message: error.message
        });
      });
      showToast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    // Kiểm tra validation trước khi submit
    const customValidationResult = validateSection({
      sectionName: values.sectionName,
      order: values.order
    });
    if (!customValidationResult.isValid) {
      if (customValidationResult.errors.sectionName) {
        form.setError("sectionName", {
          type: "manual",
          message: customValidationResult.errors.sectionName
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
    if (!values.sectionName?.trim()) {
      form.setError("sectionName", {
        type: "manual",
        message: "Tên section không được để trống"
      });
      showToast.error("Vui lòng nhập tên section!");
      return;
    }

    if (!values.iconUrl?.trim()) {
      form.setError("iconUrl", {
        type: "manual",
        message: "Icon không được để trống"
      });
      showToast.error("Vui lòng chọn icon!");
      return;
    }

    if (!values.estimateTime?.trim()) {
      form.setError("estimateTime", {
        type: "manual",
        message: "Thời gian ước tính không được để trống"
      });
      showToast.error("Vui lòng nhập thời gian ước tính!");
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

    // Kiểm tra lessonId trước khi submit
    const currentLessonId = Array.isArray(data?.lessonIds) ? data.lessonIds[0] : data?.lessonIds;
    if (!currentLessonId) {
      showToast.error("Không tìm thấy thông tin lesson!");
      return;
    }

    try {
      if (formType === "create") {
        const formattedValues = {
            sectionData: [values],
            lessonId: currentLessonId
        };

        await createSection(formattedValues, {
          onSuccess: () => {
            showToast.success("Tạo section thành công!");
            handleClose();
          },
          onError: (error: Error) => {
            console.error("Create error:", error);
            showToast.error(error.message || "Đã có lỗi xảy ra khi tạo section!");
          }
        });
      } else if (sectionId) {
        // Đảm bảo có đầy đủ dữ liệu từ sectionData
        const updateData = {
          sectionId: sectionId,
          lessonId: currentLessonId,
          sectionData: {
            sectionId: sectionId,
            sectionName: values.sectionName,
            iconUrl: values.iconUrl,
            estimateTime: values.estimateTime,
            order: values.order, 
            progress: 0 
          }
        } as any;

        console.log("🔧 Update section data:", updateData);

        await updateSection(updateData, {
          onSuccess: () => {
            showToast.success("Cập nhật section thành công!");
            handleClose();
          },
          onError: (error: Error) => {
            console.error("Update error:", error);
            showToast.error(
              error instanceof Error 
                ? `Lỗi: ${error.message}`
                : "Đã có lỗi xảy ra khi cập nhật section!"
            );
          }
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      showToast.error("Đã có lỗi xảy ra!");
    }
  }, [formType, sectionId, createSection, updateSection, sectionData, handleClose, validateSection, form]);

  return (
    <AnimatePresence>
      {isOpen && type === "createUpdateSection" && (
        <Dialog open={true} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-[900px] !rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl">
            <DialogHeader className="border-b pb-4 mb-6">
              <DialogTitle>
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {formType === "create" ? (
                    <BadgePlus className="w-6 h-6 text-blue-500" />
                  ) : (
                    <Pencil className="w-6 h-6 text-blue-500" />
                  )}
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formType === "create" ? "Thêm mới section" : "Cập nhật section"}
                  </p>
                </motion.div>
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <motion.div variants={formAnimation} initial="hidden" animate="visible" custom={1}>
                      <FormField
                        control={form.control}
                        name="sectionName"
                        render={({ field }) => {
                          const currentLength = field.value?.length || 0;
                          const maxLength = 100;
                          const isNearLimit = currentLength > maxLength * 0.8;
                          
                          return (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Tên section <span className="text-red-500">*</span>
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
                                        const error = validateField("sectionName", value);
                                        if (error) {
                                          form.setError("sectionName", {
                                            type: "manual",
                                            message: error
                                          });
                                        } else {
                                          form.clearErrors("sectionName");
                                        }
                                      }
                                      
                                      // Validation cho độ dài ký tự
                                      if (value.length > maxLength) {
                                        form.setError("sectionName", {
                                          type: "manual",
                                          message: `Tên section không được vượt quá ${maxLength} ký tự`
                                        });
                                      } else if (value.length <= maxLength && form.formState.errors.sectionName?.message?.includes("không được vượt quá")) {
                                        form.clearErrors("sectionName");
                                      }
                                    }}
                                    disabled={isPending}
                                    placeholder="Nhập tên section..."
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
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
                              <FormMessage className="text-sm text-red-500" />
                            </FormItem>
                          );
                        }}
                      />
                    </motion.div>

                    <motion.div variants={formAnimation} initial="hidden" animate="visible" custom={2}>
                      <FormField
                        control={form.control}
                        name="estimateTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              Thời gian ước tính <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="Nhập thời gian ước tính... (10 mins, 1 hour, ...)"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                              />
                            </FormControl>
                            <FormMessage className="text-sm text-red-500" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={formAnimation} initial="hidden" animate="visible" custom={3}>
                      <FormField
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              Thứ tự <span className="text-red-500">*</span>
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
                                  disabled={isPending}
                                  placeholder="Nhập thứ tự..."
                                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
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
                            <FormMessage className="text-sm text-red-500" />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={formAnimation} initial="hidden" animate="visible" custom={4}>
                    <FormField
                      control={form.control}
                      name="iconUrl"
                      render={({ field }) => (
                        <FormItem className="h-full">
                          <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            Icon <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="mt-2 ">
                              <ImageUploader
                                value={field.value}
                                disabled={isPending}
                                onChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>

                <motion.div className="flex justify-end gap-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isPending}
                    className="px-6 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Hủy
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        {formType === "create" ? "Đang tạo..." : "Đang cập nhật..."}
                      </span>
                    ) : (
                      formType === "create" ? "Tạo section" : "Cập nhật section"
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

export default CreateUpdateSectionModal;
