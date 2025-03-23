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
import { useCreateSectionContent, useUpdateSectionContent } from "@/hooks/useSectionContent";
import { sectionContentFormSchema, SectionContentFormValues } from "@/lib/validations/sectionContent";
import { Textarea } from "@/components/ui/textarea";
import { useLessonStore } from "@/store/use-lesson-store";

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

function CreateUpdateSectionContentModal() {
  const { isOpen, onClose, type, data } = useModal();
  const formType = data?.formType;
  const sectionIds = formType === "update" ? data?.sectionIds : null;
  const sectionContent = formType === "update" ? data?.sectionContent : null;

  const {activeLesson} = useLessonStore();

  // Query để lấy dữ liệu section khi edit
//   const { data: sectionData, isLoading } = useGetSingleSection(sectionIds as string);

  const { mutate: createSectionContent, isPending: isCreating } = useCreateSectionContent();
  const { mutate: updateSectionContent, isPending: isUpdating } = useUpdateSectionContent();

  const isPending = isCreating || isUpdating ;
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
    }
  }, [isOpen, form]);

  // Cập nhật form khi có dữ liệu từ API
  React.useEffect(() => {
    if (formType === "update" && sectionContent) {
      const data = Array.isArray(sectionContent) ? sectionContent[0] : sectionContent;
      form.reset({
        title: data.title,
        description: data.description,
        iframe_url: data.iframe_url,
        order: data.order,
        icon_url: data.icon_url
      });
    }
  }, [sectionContent, formType, form]);

  // Sửa lại hàm submit
  const onSubmit = React.useCallback(async (values: SectionFormValues) => {
    
    try {
      if (formType === "create") {
        const formattedValues = {
            sectionContentData: [values],
            sectionIds: activeLesson.sectionId
        };
        console.log("formattedValues", formattedValues);
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
          sectionIds: activeLesson.sectionId,
          sectionContentData: {
            title: values.title,
            description: values.description,
            iframe_url: values.iframe_url,
            order: values.order,
            icon_url: values.icon_url,
            sc_id: sectionContent.sc_id
          }
        };


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
      toast.error("Đã có lỗi xảy ra!");
    }
  }, [formType, sectionIds, createSectionContent, updateSectionContent, handleClose]);

  return (
    <AnimatePresence>
      {isOpen && type === "createUpdateSectionContent" && (
        <Dialog open={true} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-[95vw] md:max-w-[80vw] lg:max-w-[900px] h-[90vh] overflow-y-auto !rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-4 md:p-6">
            <DialogHeader className="border-b pb-4 mb-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
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

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-4">
                    <motion.div variants={formAnimation} initial="hidden" animate="visible" custom={1}>
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              Tiêu đề
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="Nhập tiêu đề..."
                                className="w-full px-3 py-2 text-sm rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={formAnimation} initial="hidden" animate="visible" custom={2}>
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Mô tả</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                disabled={isPending}
                                placeholder="Nhập mô tả..."
                                className="resize-none min-h-[250px] md:min-h-[300px] text-sm p-3"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <motion.div variants={formAnimation} initial="hidden" animate="visible" custom={3}>
                        <FormField
                          control={form.control}
                          name="iframe_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Iframe URL</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={isPending}
                                  placeholder="Nhập iframe URL..."
                                  className="resize-none text-sm p-3"
                                />
                              </FormControl>
                              <FormMessage />
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
                              <FormLabel className="text-sm font-medium">Thứ tự</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min={1}
                                  disabled={isPending}
                                  placeholder="Nhập thứ tự..."
                                  className="text-sm"
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    field.onChange(isNaN(value) ? 0 : value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </div>

                    <motion.div variants={formAnimation} initial="hidden" animate="visible" custom={4}>
                      <FormField
                        control={form.control}
                        name="icon_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Icon</FormLabel>
                            <FormControl>
                              <div className="mt-2 h-[200px] md:h-[250px]">
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
                  </div>
                </div>

                <motion.div 
                  className="fixed bottom-0 left-0 right-0 px-4 md:px-6 py-4 border-t bg-white dark:bg-gray-800 shadow-lg z-50"
                  style={{
                    width: "inherit",
                    maxWidth: "inherit"
                  }}
                >
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isPending}
                      className="px-4 py-2 text-sm"
                    >
                      Hủy
                    </Button>
                    
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white"
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
                </motion.div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

export default CreateUpdateSectionContentModal;
