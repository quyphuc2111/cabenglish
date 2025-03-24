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
  classroomFormSchema,
  type ClassroomFormValues
} from "@/lib/validations/classroom";
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
import { toast } from "react-toastify";
import { BadgePlus, Pencil } from "lucide-react";
import { useCreateClassroom, useGetSingleClassroom, useUpdateClassroom } from "@/hooks/use-classrooms";

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

function CreateUpdateClassroomModal() {
  const { isOpen, onClose, type, data } = useModal();
  const formType = data?.formType;
  const classroomId = formType === "update" ? data?.classroom?.id : null;

  // Query để lấy dữ liệu classroom khi edit
  const { data: classroomData, isLoading } = useGetSingleClassroom(classroomId as string);

  const { mutate: createClassroom, isPending: isCreating } = useCreateClassroom();
  const { mutate: updateClassroom, isPending: isUpdating } = useUpdateClassroom();

  const isPending = isCreating || isUpdating || isLoading;
  // const isPending = isCreating  || isLoading;

  const form = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomFormSchema),
    defaultValues: {
      classname: "",
      description: "",
      imageUrl: "",
      numliked: 0,
      progress: 0,
      order: 0,
      class_id: 0
    }
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Cập nhật form khi có dữ liệu từ API
  React.useEffect(() => {
    if (formType === "update" && classroomData) {
      const data = Array.isArray(classroomData) ? classroomData[0] : classroomData;
      form.reset({
        classname: data.classname,
        description: data.description,
        imageUrl: data.imageurl,
        numliked: data.numliked,
        progress: data.progress,
        order: data.order,
        class_id: parseInt(data.class_id)
      });
    }
  }, [classroomData, formType, form]);

  // Sửa lại hàm submit
  const onSubmit = React.useCallback(async (values: ClassroomFormValues) => {
    
    try {
      if (formType === "create") {
        await createClassroom(values, {
          onSuccess: () => {
            toast.success("Tạo lớp học thành công!");
            handleClose();
          },
          onError: (error) => {
            console.error("Create error:", error);
            toast.error("Đã có lỗi xảy ra khi tạo lớp học!");
          }
        });
      } else if (classroomId && classroomData) {
        // Đảm bảo có đầy đủ dữ liệu từ classroomData
        const updateData = {
          classId: classroomId,
          data: {
            classname: values.classname,
            description: values.description,
            imageUrl: values.imageUrl,
            numliked: classroomData.numliked ,
            progress: classroomData.progress ,
            order: classroomData.order ,
            class_id: parseInt(classroomData.class_id) 
          }
        };

        console.log("Update data:", updateData);

        await updateClassroom(updateData, {
          onSuccess: () => {
            toast.success("Cập nhật lớp học thành công!");
            handleClose();
          },
          onError: (error) => {
            console.error("Update error:", error);
            toast.error(
              error instanceof Error 
                ? `Lỗi: ${error.message}`
                : "Đã có lỗi xảy ra khi cập nhật lớp học!"
            );
          }
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Đã có lỗi xảy ra!");
    }
  }, [formType, classroomId, createClassroom, updateClassroom, classroomData, handleClose]);

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
                      custom={1}
                    >
                      <FormField
                        control={form.control}
                        name="classname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-medium">
                              Tên lớp học
                            </FormLabel>
                            <FormControl>
                              <motion.div whileTap={{ scale: 0.995 }}>
                                <Input
                                  disabled={isPending}
                                  placeholder="Nhập tên lớp học..."
                                  className="text-base p-6"
                                  {...field}
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage className="text-base" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={formAnimation}
                      custom={2}
                    >
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-medium">
                              Mô tả
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
                    </motion.div>
                  </div>

                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={formAnimation}
                    custom={3}
                  >
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-medium">
                            Hình ảnh
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
                </div>

                <motion.div className="flex justify-end gap-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isPending}
                  >
                    Hủy
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isPending || !form.formState.isValid}
                    className="bg-blue-500"
                  >
                    {isPending 
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
