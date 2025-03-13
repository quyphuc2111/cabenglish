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
import { useCreateSchoolWeek, useGetSingleSchoolWeek, useUpdateSchoolWeek } from "@/hooks/use-schoolweek";
import { schoolWeekFormSchema, SchoolWeekFormValues } from "@/lib/validations/schoolweek";

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

function CreateUpdateSchoolWeekModal() {
  const { isOpen, onClose, type, data } = useModal();
  const formType = data?.formType;
  const swId = formType === "update" ? data?.schoolWeek?.id : null;

  const { data: schoolWeekData, isLoading } = useGetSingleSchoolWeek(swId as number);
  const { mutate: createSchoolWeek, isPending: isCreating } = useCreateSchoolWeek();
  const { mutate: updateSchoolWeek, isPending: isUpdating } = useUpdateSchoolWeek();

  const isPending = isCreating || isUpdating || isLoading;

  const form = useForm<SchoolWeekFormValues>({
    resolver: zodResolver(schoolWeekFormSchema),
    defaultValues: {
      value: 0,
      swId: 0
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
    if (formType === "update" && schoolWeekData) {
      const data = Array.isArray(schoolWeekData) ? schoolWeekData[0] : schoolWeekData;
      form.reset({
        value: data.value,
        swId: data.swId
      });
    }
  }, [schoolWeekData, formType, form]);

  // Kiểm tra xem form có giá trị hợp lệ không
  const isFormValid = React.useMemo(() => {
    const value = form.watch("value");
    return value > 0;
  }, [form.watch("value")]);

  // Xử lý submit form
  const onSubmit = React.useCallback(async (values: SchoolWeekFormValues) => {
    try {
      const mutationFn = formType === "create" 
        ? () => createSchoolWeek(values)
        : () => updateSchoolWeek({ 
            swId: swId as number,
            data: { value: values.value, swId: values.swId }
          });

      await mutationFn();
      
      toast.success(`${formType === "create" ? "Tạo" : "Cập nhật"} tuần học thành công!`);
      handleClose();
    } catch (error) {
      console.error(`${formType} error:`, error);
      toast.error(
        error instanceof Error 
          ? `Lỗi: ${error.message}`
          : `Đã có lỗi xảy ra khi ${formType === "create" ? "tạo" : "cập nhật"} tuần học!`
      );
    }
  }, [formType, swId, createSchoolWeek, updateSchoolWeek, handleClose]);

  // Không render nếu không phải modal schoolweek
  if (!isOpen || type !== "createUpdateSchoolWeek") return null;

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
                  {formType === "create" ? "Thêm mới tuần học" : "Cập nhật tuần học"}
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
                            Nhập tuần học
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                field.onChange(isNaN(value) ? 0 : value);
                              }}
                              disabled={isPending}
                              placeholder="Nhập tuần học..."
                              className="text-base p-6"
                              type="number"
                              min={1}
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
                    : `${formType === "create" ? "Tạo" : "Cập nhật"} tuần học`
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

export default CreateUpdateSchoolWeekModal;
