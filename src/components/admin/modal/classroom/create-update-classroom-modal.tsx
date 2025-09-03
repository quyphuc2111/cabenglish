"use client";

import React from "react";
import { useQueryClient } from "@tanstack/react-query";

// component import
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ui/image-upload";
import { BadgePlus, Pencil } from "lucide-react";
import {  useGetSingleClassroom } from "@/hooks/use-classrooms";
import { useModal } from "@/hooks/useModalStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  type ClassroomFormValues
} from "@/lib/validations/classroom";
import { useClassroomForm } from "@/hooks/client/form/useClassroomForm";
import { useCheckDuplicateClassname } from "@/hooks/use-classrooms-validation";

const formAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

// Shimmer Loading Components
const InputSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
    <div className="h-14 bg-gray-200 rounded-md"></div>
  </div>
);

const TextareaSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
    <div className="h-[250px] bg-gray-200 rounded-md"></div>
  </div>
);

const ImageUploaderSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
    <div className="h-80 bg-gray-200 rounded-lg border-2 border-dashed border-gray-300"></div>
  </div>
);

function CreateUpdateClassroomModal() {
  const { isOpen, onClose, type, data } = useModal();
  const queryClient = useQueryClient();
  const formType = data?.formType;
  const classroomId = formType === "update" ? data?.classroom?.id : null;

  const { data: classroomData, isLoading: isLoadingClassroom } = useGetSingleClassroom(classroomId as string);
  const { form, handleSubmit, isPending, validateClassroom, isValidationLoading, suggestNextOrder, checkDuplicateOrder } = useClassroomForm(formType as "create" | "update", classroomId as string);
  
  // Hook để kiểm tra trùng lặp real-time
  const { checkDuplicateClassname } = useCheckDuplicateClassname(
    formType === "update" ? (classroomId as string) : undefined
  );

  const handleClose = () => {
    form.reset({
      classname: "",
      description: "",
      imageurl: "",
      order: 0
    });
    onClose();
  };

  React.useEffect(() => {
    if (formType === "update" && classroomData) {
      form.reset(classroomData);
    } else if (formType === "create") {
      form.reset({
        classname: "",
        description: "",
        imageurl: "",
        order: 0
      });
    }
  }, [classroomData, formType, form]);

  React.useEffect(() => {
    if (isOpen && type === "createUpdateClassroom" && formType === "create" && !isValidationLoading && suggestNextOrder > 0) {
      const currentOrder = form.getValues("order");
      if (currentOrder === 0 || currentOrder !== suggestNextOrder) {
        form.setValue("order", suggestNextOrder);
      }
    }
  }, [isOpen, type, formType, suggestNextOrder, isValidationLoading, form]);

  React.useEffect(() => {
    if (!isOpen && type === "createUpdateClassroom") {
      form.reset({
        classname: "",
        description: "",
        imageurl: "",
        order: 0
      });
    }
  }, [isOpen, type, form]);

  const onSubmit = async (values: ClassroomFormValues) => {
    const success = await handleSubmit(values);
 
    if (success) {
      // Invalidate cache để cập nhật dữ liệu validation
      queryClient.invalidateQueries({ queryKey: ["classrooms-validation"] });
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      handleClose();
    }
  };

  // Show loading state for update mode
  const isShowingSkeleton = formType === "update" && isLoadingClassroom;

  return (
    <AnimatePresence>
      {isOpen && type === "createUpdateClassroom" && (
        <Dialog open={true} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-[1100px] !rounded-3xl overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                <motion.div
                  className="flex items-center gap-5 w-full"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 10
                  }}
                >
                  {formType === "create" ? (
                    <BadgePlus className="w-7 h-7" />
                  ) : (
                    <Pencil className="w-7 h-7" />
                  )}
                  <p className="text-2xl font-medium">
                    {formType === "create" ? "Thêm mới lớp học" : "Cập nhật lớp học"}
                  </p>
                </motion.div>
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={formAnimation}
                      transition={{ delay: 0.1 }}
                    >
                      {isShowingSkeleton ? (
                        <InputSkeleton />
                      ) : (
                        <FormField
                          control={form.control}
                          name="classname"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-medium">
                                Tên lớp học <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <motion.div whileTap={{ scale: 0.995 }}>
                                  <Input
                                    disabled={isPending || isValidationLoading}
                                    placeholder="Nhập tên lớp học..."
                                    className="text-base p-6"
                                    {...field}
                                    onBlur={(e) => {
                                      field.onBlur();
                                      // Kiểm tra trùng lặp khi blur
                                      const classname = e.target.value.trim();
                                      if (classname) {
                                        const isDuplicate = checkDuplicateClassname(classname);
                                        if (isDuplicate) {
                                          form.setError("classname", {
                                            type: "manual",
                                            message: "Tên lớp học đã tồn tại!"
                                          });
                                        } else {
                                          form.clearErrors("classname");
                                        }
                                      }
                                    }}
                                  />
                                </motion.div>
                              </FormControl>
                              <FormMessage className="text-base" />
                            </FormItem>
                          )}
                        />
                      )}
                    </motion.div>

                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={formAnimation}
                      transition={{ delay: 0.15 }}
                    >
                      {isShowingSkeleton ? (
                        <InputSkeleton />
                      ) : (
                        <FormField
                          control={form.control}
                          name="order"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-medium">
                                Thứ tự <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="space-y-3">
                                  <motion.div whileTap={{ scale: 0.995 }}>
                                    <Input
                                      type="number"
                                      disabled={isPending || isValidationLoading}
                                      placeholder="Nhập thứ tự hiển thị..."
                                      className="text-base p-6"
                                      {...field}
                                      onChange={(event) => field.onChange(Number(event.target.value))}
                                      onBlur={(e) => {
                                        field.onBlur();
                                        const order = Number(e.target.value);
                                        if (order > 0) {
                                          if (checkDuplicateOrder(order)) {
                                            form.setError("order", {
                                              type: "manual",
                                              message: "Thứ tự này đã tồn tại. Vui lòng chọn một số khác."
                                            });
                                          } else {
                                            form.clearErrors("order");
                                          }
                                        }
                                      }}
                                    />
                                  </motion.div>
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
                              <FormMessage className="text-base" />
                            </FormItem>
                          )}
                        />
                      )}
                    </motion.div>

                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={formAnimation}
                      transition={{ delay: 0.2 }}
                    >
                      {isShowingSkeleton ? (
                        <TextareaSkeleton />
                      ) : (
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-medium">
                                Mô tả <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <motion.div whileTap={{ scale: 0.995 }}>
                                  <Textarea
                                    disabled={isPending}
                                    placeholder="Nhập mô tả lớp học..."
                                    className="resize-none text-base min-h-[250px] p-6"
                                    {...field}
                                  />
                                </motion.div>
                              </FormControl>
                              <FormMessage className="text-base" />
                            </FormItem>
                          )}
                        />
                      )}
                    </motion.div>
                  </div>

                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={formAnimation}
                    transition={{ delay: 0.3 }}
                  >
                    {isShowingSkeleton ? (
                      <ImageUploaderSkeleton />
                    ) : (
                      <FormField
                        control={form.control}
                        name="imageurl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-medium">
                              Hình ảnh <span className="text-red-500">*</span>
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
                    )}
                  </motion.div>
                </div>

                <motion.div className="flex justify-end gap-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isPending || isShowingSkeleton}
                  >
                    Hủy
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isPending || isShowingSkeleton || isValidationLoading}
                    className="bg-blue-500/90 hover:bg-blue-500"
                  >
                    {(isPending || isValidationLoading)
                      ? `Đang ${formType === "create" ? "tạo" : "cập nhật"}...` 
                      : `${formType === "create" ? "Tạo" : "Cập nhật"} lớp học`
                    }
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

export default CreateUpdateClassroomModal;
