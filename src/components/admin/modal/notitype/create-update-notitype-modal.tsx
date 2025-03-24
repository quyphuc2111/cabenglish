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
import { useCreateNotiType, useGetSingleNotiType, useUpdateNotiType } from "@/hooks/use-notitype";
import { notiTypeFormSchema, NotiTypeFormValues } from "@/lib/validations/notitype";

// Tách animation configs ra riêng
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
  }
};

function CreateUpdateNotiTypeModal() {
  const { isOpen, onClose, type, data } = useModal();
  const formType = data?.formType;
  const ntId = formType === "update" ? data?.notiType?.id : null;

  const { data: notiTypeData, isLoading } = useGetSingleNotiType(ntId as number);
  const { mutate: createNotiType, isPending: isCreating } = useCreateNotiType();
  const { mutate: updateNotiType, isPending: isUpdating } = useUpdateNotiType();

  const isPending = isCreating || isUpdating || isLoading;

  const form = useForm<NotiTypeFormValues>({
    resolver: zodResolver(notiTypeFormSchema),
    defaultValues: {
      value: "",
      ntId: 0
    },
    mode: "onChange"
  });

  // Reset form và đóng modal
  const handleClose = React.useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  // Cập nhật form khi có dữ liệu
  React.useEffect(() => {
    if (formType === "update" && notiTypeData) {
      form.reset({
        value: notiTypeData.value,  
        ntId: notiTypeData.ntId
      });
    }
  }, [notiTypeData, formType, form]);

  // Kiểm tra xem form có giá trị hợp lệ không
  const isFormValid = React.useMemo(() => {
    const value = form.watch("value");
    return value !== "";
  }, [form.watch("value") ]);

  // Xử lý submit form
  const onSubmit = React.useCallback(async (values: NotiTypeFormValues) => {
    try {
      const mutationFn = formType === "create" 
        ? () => createNotiType(values)
        : () => updateNotiType({ 
            ntId: ntId as number,
            data: { value: values.value, ntId: values.ntId }
          });

      await mutationFn();
      
      toast.success(`${formType === "create" ? "Tạo" : "Cập nhật"} loại thông báo thành công!`);
      handleClose();
    } catch (error) {
      console.error(`${formType} error:`, error);
      toast.error(
        error instanceof Error 
          ? `Lỗi: ${error.message}`
          : `Đã có lỗi xảy ra khi ${formType === "create" ? "tạo" : "cập nhật"} loại thông báo!`
      );
    }
  }, [formType, ntId, createNotiType, updateNotiType, handleClose]);

  // Không render nếu không phải modal schoolweek
  if (!isOpen || type !== "createUpdateNotiType") return null;

  return (
    <AnimatePresence>
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[1100px] !rounded-3xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              <motion.div
                className="flex items-center gap-5 w-full"
                {...ANIMATIONS.title}
              >
                {formType === "create" ? (
                  <BadgePlus className="w-7 h-7" />
                ) : (
                  <Pencil className="w-7 h-7" />
                )}
                <p className="text-2xl font-medium">
                  {formType === "create" ? "Thêm mới loại thông báo" : "Cập nhật loại thông báo"}
                </p>
              </motion.div>
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-8">
                  <motion.div
                    variants={ANIMATIONS.form}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                  >
                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-medium">
                            Nhập loại thông báo
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value);
                              }}
                              disabled={isPending}
                              placeholder="Nhập loại thông báo..."
                              className="text-base p-6"
                            />
                          </FormControl>
                          <FormMessage className="text-base" />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>
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
                  disabled={isPending || (formType === "create" ? !isFormValid : !form.formState.isValid)}
                  className="bg-blue-500"
                >
                  {isPending 
                    ? `Đang ${formType === "create" ? "tạo" : "cập nhật"}...` 
                    : `${formType === "create" ? "Tạo" : "Cập nhật"} loại thông báo`
                  }
                </Button>
              </motion.div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
}

export default CreateUpdateNotiTypeModal;
