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
import { useCheckSchoolWeekExists, useCreateSchoolWeek, useGetSingleSchoolWeek, useSchoolWeek, useUpdateSchoolWeek } from "@/hooks/use-schoolweek";
import { schoolWeekFormSchema, SchoolWeekFormValues } from "@/lib/validations/schoolweek";
import { showToast } from "@/utils/toast-config";

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
    animate: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 10 } }
  }
};

function CreateUpdateSchoolWeekModal() {
  const { isOpen, onClose, type, data } = useModal();
  const formType = data?.formType;
  const swId = formType === "update" ? data?.schoolWeek?.id : null;

  const form = useForm<SchoolWeekFormValues>({
    resolver: zodResolver(schoolWeekFormSchema),
    defaultValues: { value: 1, swId: 1 },
    mode: "onChange"
  });

  const { data: schoolWeekData, isLoading } = useGetSingleSchoolWeek(swId?.toString() || "");
  const { mutate: createSchoolWeek, isPending: isCreating } = useCreateSchoolWeek();
  const { mutate: updateSchoolWeek, isPending: isUpdating } = useUpdateSchoolWeek();
  
  const { data: allSchoolWeeks } = useSchoolWeek();
  const currentValue = form.watch("value");
  
  const schoolWeekExists = React.useMemo(() => {
    if (!allSchoolWeeks?.data) return false;
    
    if (formType === "update" && swId) {
      return allSchoolWeeks.data.some((week: any) => 
        week.value === currentValue && week.swId !== swId
      );
    }
    
    return allSchoolWeeks.data.some((week: any) => week.value === currentValue);
  }, [allSchoolWeeks?.data, currentValue, formType, swId]);

  const isPending = isCreating || isUpdating || isLoading;

  

  const handleClose = React.useCallback(() => {
    form.reset({ value: 1, swId: 1 });
    onClose();
  }, [form, onClose]);

  React.useEffect(() => {
    if (formType === "update" && schoolWeekData) {
      const data = Array.isArray(schoolWeekData) ? schoolWeekData[0] : schoolWeekData;
      form.reset(data);
    }
  }, [schoolWeekData, formType, form]);

  const isFormValid = form.watch("value") >= 1 && form.watch("value") <= 52;

  const handleSubmit = React.useCallback(async (values: SchoolWeekFormValues) => {
    try {
      if (schoolWeekExists) {
        showToast.error("Tuần học đã tồn tại");
        return;
      }

      if (formType === "create") {
        createSchoolWeek(values, {
          onSuccess: () => {
            showToast.success("Tạo tuần học thành công");
            handleClose();
          },
          onError: (error: Error) => {
            showToast.error(error.message || "Có lỗi xảy ra khi tạo tuần học");
          }
        });
      } else {
        updateSchoolWeek({ 
          swId: swId as number,
          data: values
        }, {
          onSuccess: () => {
            showToast.success("Cập nhật tuần học thành công");
            handleClose();
          },
          onError: (error: Error) => {
            showToast.error(error.message || "Có lỗi xảy ra khi cập nhật tuần học");
          }
        });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra!");
    }
  }, [formType, swId, createSchoolWeek, updateSchoolWeek, handleClose, schoolWeekExists]);

  if (!isOpen || type !== "createUpdateSchoolWeek") return null;

  return (
    <AnimatePresence>
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[700px] !rounded-3xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              <motion.div className="flex items-center gap-5 w-full" {...ANIMATIONS.title}>
                {formType === "create" ? <BadgePlus className="w-7 h-7" /> : <Pencil className="w-7 h-7" />}
                <p className="text-2xl font-medium">
                  {formType === "create" ? "Thêm mới tuần học" : "Cập nhật tuần học"}
                </p>
              </motion.div>
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <motion.div variants={ANIMATIONS.form} initial="hidden" animate="visible" custom={1}>
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-medium">Nhập tuần học</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={1}
                          max={52}
                          disabled={isPending}
                          placeholder="Nhập tuần học (1-52)..."
                          className="text-base p-6"
                          onChange={e => {
                            const value = parseInt(e.target.value) || 0;
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-base" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div className="flex justify-end gap-4 pt-2">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || !isFormValid}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {isPending 
                    ? `Đang ${formType === "create" ? "tạo" : "cập nhật"}...` 
                    : `${formType === "create" ? "Tạo" : "Cập nhật"} tuần học`}
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
