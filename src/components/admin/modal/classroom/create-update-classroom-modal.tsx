"use client";

import React from "react";

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

function CreateUpdateClassroomModal() {
  const { isOpen, onClose, type, data } = useModal();
  const formType = data?.formType;
  const classroomId = formType === "update" ? data?.classroom?.id : null;

  const { data: classroomData, isLoading: isLoadingClassroom } = useGetSingleClassroom(classroomId as string);
  const { form, handleSubmit, isPending } = useClassroomForm(formType as "create" | "update", classroomId as string);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  React.useEffect(() => {
    if (formType === "update" && classroomData) {
      form.reset(classroomData);
    }
  }, [classroomData, formType, form]);

  const onSubmit = async (values: ClassroomFormValues) => {
    const success = await handleSubmit(values);
 
    if (success) {
      handleClose();
    }
  };

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
                      name="imageurl"
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
                    disabled={isPending }
                    className="bg-blue-500/90 hover:bg-blue-500"
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
