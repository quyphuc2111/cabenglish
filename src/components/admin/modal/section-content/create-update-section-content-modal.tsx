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

import { showToast } from "@/utils/toast-config";
import { useCreateSectionContent, useUpdateSectionContent } from "@/hooks/useSectionContent";
import { sectionContentFormSchema, SectionContentFormValues } from "@/lib/validations/sectionContent";
import { Textarea } from "@/components/ui/textarea";
import { useLessonStore } from "@/store/use-lesson-store";
import { useSectionContentValidation } from "@/hooks/use-section-content-validation";

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

function CreateUpdateSectionContentModal() {
  const { isOpen, onClose, type, data } = useModal();
  const formType = data?.formType;
  const sectionIds = formType === "update" ? data?.sectionIds : null;
  const sectionContent = formType === "update" ? data?.sectionContents?.[0] : null;

  const {activeLesson} = useLessonStore();

  // Hook validation để kiểm tra trùng lặp
  const {
    validateField,
    validateSectionContent,
    suggestNextOrder,
    isLoading: isValidationLoading
  } = useSectionContentValidation(
    Number(activeLesson.sectionId),
    formType === "update" ? sectionContent?.sc_id?.toString() : null
  );

  console.log("🔧 CreateUpdateSectionContentModal data:", {
    formType,
    sectionIds,
    sectionContent,
    sectionContents: data?.sectionContents,
    fullData: data
  });



  const { mutate: createSectionContent, isPending: isCreating } = useCreateSectionContent();
  const { mutate: updateSectionContent, isPending: isUpdating } = useUpdateSectionContent();

  const isPending = isCreating || isUpdating || isValidationLoading;
  // const isPending = isCreating  || isLoading;

  const form = useForm<SectionContentFormValues>({
    resolver: zodResolver(sectionContentFormSchema),
    defaultValues: {
      title: "",
      iframe_url: "",
      order: 0,
      icon_url: "",
      description: ""
    }
  });

  const handleClose = () => {
    form.reset({
      title: "",
      iframe_url: "",
      order: 0,
      icon_url: "",
      description: ""
    });
    onClose();
  };

  // Cập nhật order mặc định khi tạo mới (chỉ khi modal đã mở và có suggestNextOrder)
  React.useEffect(() => {
    if (isOpen && type === "createUpdateSectionContent" && formType === "create" && !isValidationLoading && suggestNextOrder > 0) {
      // Chỉ set nếu order hiện tại là 0 hoặc khác với suggestNextOrder
      const currentOrder = form.getValues("order");
      if (currentOrder === 0 || currentOrder !== suggestNextOrder) {
        form.setValue("order", suggestNextOrder);
      }
    }
  }, [isOpen, type, formType, suggestNextOrder, isValidationLoading, form]);

  // Thêm useEffect để reset form khi modal đóng
  React.useEffect(() => {
    if (!isOpen) {
      form.reset({
        title: "",
        iframe_url: "",
        order: 0,
        icon_url: "",
        description: ""
      });
    } else if (isOpen && type === "createUpdateSectionContent" && formType === "create") {
      // Reset form về trạng thái ban đầu cho tạo mới
      form.reset({
        title: "",
        iframe_url: "",
        order: !isValidationLoading && suggestNextOrder > 0 ? suggestNextOrder : 0,
        icon_url: "",
        description: ""
      });
      form.clearErrors();
    }
  }, [isOpen, type, formType, form, suggestNextOrder, isValidationLoading]);

  // Cập nhật form khi có dữ liệu từ modal data
  React.useEffect(() => {
    if (formType === "update" && sectionContent) {
      console.log("📝 Loading section content data for update:", sectionContent);
      
      form.reset({
        title: sectionContent.title || "",
        description: sectionContent.description || "",
        iframe_url: sectionContent.iframe_url || "",
        order: sectionContent.order || 0,
        icon_url: sectionContent.icon_url || ""
      });
    }
  }, [sectionContent, formType, form]);

  // Sửa lại hàm submit
  const onSubmit = React.useCallback(async (values: SectionContentFormValues) => {
    
    // Validation dữ liệu trước khi submit
    const validationResult = sectionContentFormSchema.safeParse(values);
    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      errors.forEach((error) => {
        const fieldName = error.path[0] as keyof SectionContentFormValues;
        form.setError(fieldName, {
          type: "manual",
          message: error.message
        });
      });
      showToast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    // Kiểm tra validation trước khi submit
    const customValidationResult = validateSectionContent({
      title: values.title,
      order: values.order
    });
    if (!customValidationResult.isValid) {
      if (customValidationResult.errors.title) {
        form.setError("title", {
          type: "manual",
          message: customValidationResult.errors.title
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
    if (!values.title?.trim()) {
      form.setError("title", {
        type: "manual",
        message: "Tiêu đề không được để trống"
      });
      showToast.error("Vui lòng nhập tiêu đề!");
      return;
    }

    if (!values.iframe_url?.trim()) {
      form.setError("iframe_url", {
        type: "manual",
        message: "Iframe URL không được để trống"
      });
      showToast.error("Vui lòng nhập iframe URL!");
      return;
    }

    if (!values.icon_url?.trim()) {
      form.setError("icon_url", {
        type: "manual",
        message: "Icon không được để trống"
      });
      showToast.error("Vui lòng chọn icon!");
      return;
    }

    if (!values.description?.trim()) {
      form.setError("description", {
        type: "manual",
        message: "Mô tả không được để trống"
      });
      showToast.error("Vui lòng nhập mô tả!");
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

    // Kiểm tra sectionId trước khi submit
    if (!activeLesson.sectionId) {
      showToast.error("Không tìm thấy thông tin section!");
      return;
    }
    
    try {
      if (formType === "create") {
        const formattedValues = {
            sectionContentData: [{
              ...values,
              sc_id: 0 
            }],
            sectionIds: Number(activeLesson.sectionId),
            sectionContentIds: []
        };

        await createSectionContent(formattedValues, {
          onSuccess: () => {
            showToast.success("Tạo section content thành công!");
            handleClose();
          },
          onError: (error: Error) => {
            console.error("Create error:", error);
            showToast.error(error.message || "Đã có lỗi xảy ra khi tạo section!");
          }
        });
      } 
      else if (activeLesson.sectionId && sectionContent) {
        // Đảm bảo có đầy đủ dữ liệu từ sectionData
        const updateData = {
          sectionIds: Number(activeLesson.sectionId),
          sectionContentData: {
            title: values.title,
            description: values.description,
            iframe_url: values.iframe_url,
            order: values.order,
            icon_url: values.icon_url,
            sc_id: Number(sectionContent.sc_id)
          },
          sectionContentIds: [Number(sectionContent.sc_id)] 
        };

        console.log("🔧 Update section content data:", updateData);

        await updateSectionContent(updateData, {
          onSuccess: () => {
            showToast.success("Cập nhật section content thành công!");
            handleClose();
          },
          onError: (error: Error) => {
            console.error("Update error:", error);
            showToast.error(
              error instanceof Error 
                ? `Lỗi: ${error.message}`
                : "Đã có lỗi xảy ra khi cập nhật section content!"
            );
          }
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      showToast.error("Đã có lỗi xảy ra!");
    }
  }, [formType, sectionIds, createSectionContent, updateSectionContent, handleClose, validateSectionContent, form, activeLesson.sectionId]);

  return (
    <AnimatePresence>
      {isOpen && type === "createUpdateSectionContent" && (
        <Dialog open={true} onOpenChange={handleClose}>
          <DialogContent className="max-w-[95vw] md:max-w-[90vw] lg:max-w-[1200px] xl:max-w-[1400px] max-h-[95vh] overflow-hidden !rounded-xl bg-white dark:bg-gray-800">
            <div className="flex flex-col h-full">
              {/* Header */}
              <DialogHeader className="border-b pb-6 px-8 sticky top-0 dark:bg-gray-800 z-10">
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
                      {formType === "create" ? "Thêm mới section content" : "Cập nhật section content"}
                    </p>
                  </motion.div>
                </DialogTitle>
              </DialogHeader>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Column 1: Title & Description */}
                      <div className="space-y-8">
                        <motion.div variants={formAnimation} initial="hidden" animate="visible" custom={1}>
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => {
                              const currentLength = field.value?.length || 0;
                              const maxLength = 100;
                              const isNearLimit = currentLength > maxLength * 0.8;
                              
                              return (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Tiêu đề <span className="text-red-500">*</span>
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
                                            const error = validateField("title", value);
                                            if (error) {
                                              form.setError("title", {
                                                type: "manual",
                                                message: error
                                              });
                                            } else {
                                              form.clearErrors("title");
                                            }
                                          }
                                          
                                          // Validation cho độ dài ký tự
                                          if (value.length > maxLength) {
                                            form.setError("title", {
                                              type: "manual",
                                              message: `Tiêu đề không được vượt quá ${maxLength} ký tự`
                                            });
                                          } else if (value.length <= maxLength && form.formState.errors.title?.message?.includes("không được vượt quá")) {
                                            form.clearErrors("title");
                                          }
                                        }}
                                        disabled={isPending}
                                        placeholder="Nhập tiêu đề..."
                                        className="w-full px-4 py-3 text-base rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                  Mô tả <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    disabled={isPending}
                                    placeholder="Nhập mô tả..."
                                    className="resize-none min-h-[250px] text-base p-4 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                  />
                                </FormControl>
                                <FormMessage className="text-sm text-red-500" />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      </div>

                      {/* Column 2: Iframe URL & Order */}
                      <div className="space-y-8">
                        <motion.div variants={formAnimation} initial="hidden" animate="visible" custom={3}>
                          <FormField
                            control={form.control}
                            name="iframe_url"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                  Iframe URL <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={isPending}
                                    placeholder="Nhập iframe URL..."
                                    className="w-full px-4 py-3 text-base rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                  />
                                </FormControl>
                                <FormMessage className="text-sm text-red-500" />
                              </FormItem>
                            )}
                          />
                        </motion.div>

                        <motion.div variants={formAnimation} initial="hidden" animate="visible" custom={4}>
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
                                      type="number"
                                      min={1}
                                      disabled={isPending}
                                      placeholder="Nhập thứ tự..."
                                      className="w-full px-4 py-3 text-base rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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

                      {/* Column 3: Icon */}
                      <div className="space-y-8">
                        <motion.div variants={formAnimation} initial="hidden" animate="visible" custom={5}>
                          <FormField
                            control={form.control}
                            name="icon_url"
                            render={({ field }) => (
                              <FormItem>
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
                    </div>
                  </form>
                </Form>
              </div>

              {/* Footer */}
              <div className="border-t px-8 py-6 bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isPending}
                    className="px-6 py-3 text-base hover:bg-gray-100"
                  >
                    Hủy
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-3 text-base bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={form.handleSubmit(onSubmit)}
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        {formType === "create" ? "Đang tạo..." : "Đang cập nhật..."}
                      </span>
                    ) : (
                      formType === "create" ? "Tạo section content" : "Cập nhật section content"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

export default CreateUpdateSectionContentModal;
