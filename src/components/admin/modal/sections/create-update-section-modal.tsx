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
import { toast } from "react-toastify";
import { BadgePlus, Pencil } from "lucide-react";
import { useCreateSection, useGetSingleSection, useUpdateSection } from "@/hooks/use-sections";
import { showToast } from "@/utils/toast-config";

const formAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      ease: "easeOut"
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
  const sectionId = formType === "update" ? data?.section?.id : null;
//   const lessonId = formType === "update" ? data?.lessonIds?.id : null;
  // Query để lấy dữ liệu section khi edit
  const { data: sectionData, isLoading } = useGetSingleSection(sectionId as string);

  const { mutate: createSection, isPending: isCreating } = useCreateSection();
  const { mutate: updateSection, isPending: isUpdating } = useUpdateSection();

  const isPending = isCreating || isUpdating || isLoading;
  // const isPending = isCreating  || isLoading;

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

  // Cập nhật form khi có dữ liệu từ API
  React.useEffect(() => {
    if (formType === "update" && sectionData) {
      const data = Array.isArray(sectionData) ? sectionData[0] : sectionData;
      form.reset({
        sectionName: data.sectionName,
        iconUrl: data.iconUrl,
        estimateTime: data.estimateTime,
        order: data.order
      });
    }
  }, [sectionData, formType, form]);

  // Sửa lại hàm submit
  const onSubmit = React.useCallback(async (values: SectionFormValues) => {
    
    try {
      if (formType === "create") {
        const formattedValues = {
            sectionData: [values],
            lessonId: data?.lessonIds
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
      } else if (sectionId && sectionData) {
        // Đảm bảo có đầy đủ dữ liệu từ sectionData
        const updateData = {
          sectionId: sectionData.sectionId,
          lessonId: data?.lessonIds,
          sectionData: {
            sectionName: values.sectionName,
            iconUrl: values.iconUrl,
            estimateTime: values.estimateTime,
            order: values.order,
          }
        };


        await updateSection(updateData, {
          onSuccess: () => {
            toast.success("Cập nhật lớp học thành công!");
            handleClose();
          },
          onError: (error: Error) => {
            console.error("Update error:", error);
            toast.error(
              error instanceof Error 
                ? `Lỗi: ${error.message}`
                : "Đã có lỗi xảy ra khi cập nhật section!"
            );
          }
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Đã có lỗi xảy ra!");
    }
  }, [formType, sectionId, createSection, updateSection, sectionData, handleClose]);

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
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              Tên section
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="Nhập tên section..."
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                              />
                            </FormControl>
                            <FormMessage className="text-sm text-red-500" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={formAnimation} initial="hidden" animate="visible" custom={2}>
                      <FormField
                        control={form.control}
                        name="estimateTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              Thời gian ước tính
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
                              Thứ tự
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min={1}
                                disabled={isPending}
                                placeholder="Nhập thứ tự..."
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  field.onChange(isNaN(value) ? 0 : value);
                                }}
                              />
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
                            Icon
                          </FormLabel>
                          <FormControl>
                            <div className="mt-2 h-[calc(100%-2rem)]">
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
