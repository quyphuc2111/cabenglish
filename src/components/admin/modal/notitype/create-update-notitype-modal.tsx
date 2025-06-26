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
import {  Pencil, Sparkles, Bell, BellRing } from "lucide-react";
import { useCreateNotiType, useGetSingleNotiType, useUpdateNotiType } from "@/hooks/use-notitype";
import { notiTypeFormSchema, NotiTypeFormValues } from "@/lib/validations/notitype";

const ANIMATIONS = {
  modal: {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2 }
    }
  },
  form: {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.1, 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  },
  title: {
    initial: { x: -30, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
        delay: 0.1
      }
    }
  },
  button: {
    whileHover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    whileTap: { scale: 0.98 }
  }
};

function CreateUpdateNotiTypeModal() {
  const { isOpen, onClose, type, data } = useModal();
  const formType = data?.formType;
  const ntId = formType === "update" ? data?.notiType?.id : null;

  const { data: notiTypeData, isLoading } = useGetSingleNotiType(
    ntId ? String(ntId) : null
  );
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

  const handleClose = React.useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  React.useEffect(() => {
    if (formType === "update" && notiTypeData) {
      const data = Array.isArray(notiTypeData) 
        ? (notiTypeData as any[])[0] 
        : (notiTypeData as any);
      
      if (data && typeof data === 'object' && 'value' in data && 'ntId' in data) {
        form.reset({
          value: String(data.value), 
          ntId: data.ntId
        });
      }
    }
  }, [notiTypeData, formType, form]);

  const isFormValid = React.useMemo(() => {
    const value = form.watch("value");
    return value !== "" && value.trim().length > 0;
  }, [form.watch("value")]);

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

  if (!isOpen || type !== "createUpdateNotiType") return null;

  return (
    <AnimatePresence mode="wait">
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] !rounded-3xl overflow-hidden border-0 p-0 shadow-2xl">
          <motion.div
            variants={ANIMATIONS.modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-200 to-purple-300 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full opacity-20 blur-3xl"></div>
              <Sparkles className="absolute top-6 right-6 w-4 h-4 text-blue-400 opacity-30" />
              <Bell className="absolute bottom-6 left-6 w-3 h-3 text-purple-400 opacity-30" />
            </div>

            <DialogHeader className="relative px-8 pt-8 pb-2">
              <DialogTitle>
                <motion.div
                  className="flex items-center gap-4 w-full"
                  {...ANIMATIONS.title}
                >
                  <div className={`
                    p-3 rounded-2xl shadow-lg
                    ${formType === "create" 
                      ? "bg-gradient-to-br from-green-400 to-emerald-500" 
                      : "bg-gradient-to-br from-blue-400 to-indigo-500"
                    }
                  `}>
                    {formType === "create" ? (
                      <BellRing className="w-6 h-6 text-white" />
                    ) : (
                      <Pencil className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {formType === "create" ? "Thêm mới loại thông báo" : "Cập nhật loại thông báo"}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formType === "create" 
                        ? "Tạo loại thông báo mới cho hệ thống" 
                        : "Chỉnh sửa thông tin loại thông báo"
                      }
                    </p>
                  </div>
                </motion.div>
              </DialogTitle>
            </DialogHeader>

            <div className="relative px-8 pb-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <motion.div
                    variants={ANIMATIONS.form}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            Tên loại thông báo
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value);
                                }}
                                disabled={isPending}
                                placeholder="Nhập tên loại thông báo..."
                                className="
                                  text-base p-6 rounded-2xl border-2 
                                  bg-white/80 dark:bg-gray-800/80 
                                  backdrop-blur-sm
                                  border-gray-200 dark:border-gray-700
                                  focus:border-blue-400 dark:focus:border-blue-500
                                  focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20
                                  transition-all duration-300
                                  shadow-lg hover:shadow-xl
                                  placeholder:text-gray-400
                                "
                              />
                              {isFormValid && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                >
                                  <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg"></div>
                                </motion.div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage className="text-base text-red-500" />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div 
                    className="flex justify-end gap-4 pt-6"
                    variants={ANIMATIONS.form}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                  >
                    <motion.div {...ANIMATIONS.button}>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isPending}
                        className="
                          px-6 py-3 rounded-2xl border-2 
                          bg-gray-50 hover:bg-gray-100 
                          dark:bg-gray-800 dark:hover:bg-gray-700
                          border-gray-200 dark:border-gray-600
                          text-gray-700 dark:text-gray-300
                          font-medium transition-all duration-300
                          shadow-lg hover:shadow-xl
                        "
                      >
                        Hủy bỏ
                      </Button>
                    </motion.div>
                    
                    <motion.div {...ANIMATIONS.button}>
                      <Button
                        type="submit"
                        disabled={isPending || (formType === "create" ? !isFormValid : !form.formState.isValid)}
                        className={`
                          px-6 py-3 rounded-2xl font-medium
                          text-white shadow-lg hover:shadow-xl
                          transition-all duration-300
                          disabled:opacity-50 disabled:cursor-not-allowed
                          ${formType === "create"
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                            : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                          }
                        `}
                      >
                        {isPending && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                        )}
                        {isPending 
                          ? `Đang ${formType === "create" ? "tạo" : "cập nhật"}...` 
                          : `${formType === "create" ? "Tạo mới" : "Cập nhật"}`
                        }
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>
              </Form>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
}

export default CreateUpdateNotiTypeModal;
