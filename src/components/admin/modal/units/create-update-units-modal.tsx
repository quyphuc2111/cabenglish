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
import { unitsFormSchema, UnitsFormValues } from "@/lib/validations/units";
import {
  useCreateUnitByClassId,
  useUpdateUnitByClassId
} from "@/hooks/use-units";
import { useUnitsValidation } from "@/hooks/use-units-validation";

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

function CreateUpdateUnitsModal() {
  const { isOpen, onClose, type, data } = useModal();
  const formType = data?.formType;
  const classId = formType === "update" ? data?.classroomId : null;

  // Sửa phần xử lý classroomId
  const classroomId = React.useMemo(() => {
    if (!data?.classroomId) {
      // console.error('Missing classroomId:', data);
      return null;
    }

    // Đảm bảo chuyển đổi sang number
    const id = Number(data.classroomId);
    if (isNaN(id)) {
      // console.error('Invalid classroomId:', data.classroomId);
      return null;
    }
    return id;
  }, [data?.classroomId]);

  const unitDataFromModal = data?.unitData;
  
  const { mutate: createUnits, isPending: isCreating } =
    useCreateUnitByClassId(classroomId);
  const { mutate: updateUnits, isPending: isUpdating } =
    useUpdateUnitByClassId(classId);

  const isPending = isCreating || isUpdating;

  // Hook validation để kiểm tra trùng lặp
  const {
    validateField,
    validateUnit,
    suggestNextOrder,
    isLoading: isValidationLoading
  } = useUnitsValidation(
    classroomId,
    formType === "update" ? unitDataFromModal?.unitId : null
  );

  const form = useForm<UnitsFormValues>({
    resolver: zodResolver(unitsFormSchema),
    defaultValues: {
      unitName: "",
      order: 0,
      unitId: 0,
      progress: 0
    },
    mode: "onChange"
  });

  // Cập nhật order mặc định khi tạo mới (chỉ khi modal đã mở và có suggestNextOrder)
  React.useEffect(() => {
    if (isOpen && type === "createUpdateUnits" && formType === "create" && !isValidationLoading && suggestNextOrder > 0) {
      // Chỉ set nếu order hiện tại là 0 hoặc khác với suggestNextOrder
      const currentOrder = form.getValues("order");
      if (currentOrder === 0 || currentOrder !== suggestNextOrder) {
        form.setValue("order", suggestNextOrder);
      }
    }
  }, [isOpen, type, formType, suggestNextOrder, isValidationLoading, form]);

  // Reset form và đóng modal
  const handleClose = React.useCallback(() => {
    form.reset({
      unitName: "",
      order: 0,
      unitId: 0,
      progress: 0
    });
    form.clearErrors();
    onClose();
  }, [form, onClose]);

  // Reset form khi modal mở
  React.useEffect(() => {
    if (isOpen && type === "createUpdateUnits") {
      if (formType === "create") {
        // Reset form về trạng thái ban đầu cho tạo mới
        form.reset({
          unitName: "",
          order: !isValidationLoading && suggestNextOrder > 0 ? suggestNextOrder : 0,
          unitId: 0,
          progress: 0
        });
        form.clearErrors();
      }
      // Với formType === "update", form sẽ được cập nhật trong useEffect khác
    }
  }, [isOpen, type, formType, form, suggestNextOrder, isValidationLoading]);

  // Cập nhật form khi có dữ liệu
  React.useEffect(() => {
    if (formType === "update" && unitDataFromModal) {
      form.reset({
        unitName: unitDataFromModal.unitName,
        order: unitDataFromModal.order,
        unitId: unitDataFromModal.unitId,
        progress: unitDataFromModal.progress
      });
    }
  }, [unitDataFromModal, formType, form]);

  // Kiểm tra xem form có giá trị hợp lệ không
  const isFormValid = React.useMemo(() => {
    const unitName = form.watch("unitName");
    const order = form.watch("order");
    return unitName !== "" && order > 0 && classroomId !== null;
  }, [form.watch("unitName"), form.watch("order"), classroomId]);

  // Xử lý submit form
  const onSubmit = React.useCallback(
    async (values: UnitsFormValues) => {
      if (!classroomId) {
        toast.error("Không tìm thấy thông tin lớp học!");
        return;
      }

      // Kiểm tra validation trước khi submit
      const validationResult = validateUnit(values);
      if (!validationResult.isValid) {
        if (validationResult.errors.unitName) {
          form.setError("unitName", {
            type: "manual",
            message: validationResult.errors.unitName
          });
        }
        if (validationResult.errors.order) {
          form.setError("order", {
            type: "manual",
            message: validationResult.errors.order
          });
        }
        toast.error("Vui lòng kiểm tra lại thông tin!");
        return;
      }

      try {
        if (formType === "create") {
          createUnits(values, {
            onSuccess: (response) => {
              if (response?.success) {
                toast.success("Tạo unit thành công!");
                handleClose();
              } else {
                toast.error(response?.error || "Có lỗi xảy ra khi tạo unit!");
              }
            },
            onError: (error) => {
              console.error("Create unit error:", error);
              toast.error(
                error instanceof Error
                  ? `Lỗi: ${error.message}`
                  : "Đã có lỗi xảy ra khi tạo unit!"
              );
            }
          });
        } else {
          updateUnits(values, {
            onSuccess: (response) => {
              if (response?.success) {
                toast.success("Cập nhật unit thành công!");
                handleClose();
              } else {
                toast.error(
                  response?.error || "Có lỗi xảy ra khi cập nhật unit!"
                );
              }
            },
            onError: (error) => {
              console.error("Update unit error:", error);
              toast.error(
                error instanceof Error
                  ? `Lỗi: ${error.message}`
                  : "Đã có lỗi xảy ra khi cập nhật unit!"
              );
            }
          });
        }
      } catch (error) {
        console.error("Operation error:", error);
        toast.error(
          error instanceof Error
            ? `Lỗi: ${error.message}`
            : `Đã có lỗi xảy ra khi ${
                formType === "create" ? "tạo" : "cập nhật"
              } unit!`
        );
      }
    },
    [formType, createUnits, updateUnits, handleClose, classroomId, validateUnit, form]
  );

  // Không render nếu không phải modal schoolweek
  if (!isOpen || type !== "createUpdateUnits") return null;

  // Disable form nếu không có classroomId hợp lệ
  if (!classroomId) {
    return (
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent>
          <div className="p-6 text-center">
            <p className="text-red-500 font-medium">
              Không tìm thấy thông tin lớp học! Vui lòng thử lại.
            </p>
            <Button onClick={handleClose} className="mt-4" variant="outline">
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && type === "createUpdateUnits" && (
        <Dialog open={true} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-[1100px] !rounded-3xl overflow-hidden shadow-2xl border-0">
            <DialogHeader className="pb-6 border-b border-gray-100">
              <DialogTitle>
                <motion.div
                  className="flex items-center gap-5 w-full"
                  {...ANIMATIONS.title}
                >
                  <div className={`p-3 rounded-xl ${
                    formType === "create" 
                      ? "bg-green-100 text-green-600" 
                      : "bg-blue-100 text-blue-600"
                  }`}>
                    {formType === "create" ? (
                      <BadgePlus className="w-7 h-7" />
                    ) : (
                      <Pencil className="w-7 h-7" />
                    )}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {formType === "create" ? "Thêm mới unit" : "Cập nhật unit"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formType === "create" 
                        ? "Tạo unit mới cho lớp học" 
                        : "Chỉnh sửa thông tin unit"}
                    </p>
                  </div>
                </motion.div>
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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
                        name="unitName"
                        render={({ field }) => {
                          const currentLength = field.value?.length || 0;
                          const maxLength = 100;
                          const isNearLimit = currentLength > maxLength * 0.8;
                          
                          return (
                            <FormItem>
                              <FormLabel className="text-lg font-medium">
                                Tên unit
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
                                        const error = validateField("unitName", value);
                                        if (error) {
                                          form.setError("unitName", {
                                            type: "manual",
                                            message: error
                                          });
                                        } else {
                                          form.clearErrors("unitName");
                                        }
                                      }
                                      
                                      // Validation cho độ dài ký tự
                                      if (value.length > maxLength) {
                                        form.setError("unitName", {
                                          type: "manual",
                                          message: `Tên unit không được vượt quá ${maxLength} ký tự`
                                        });
                                      } else if (value.length <= maxLength && form.formState.errors.unitName?.message?.includes("không được vượt quá")) {
                                        form.clearErrors("unitName");
                                      }
                                    }}
                                    disabled={isPending || isValidationLoading}
                                    placeholder="Nhập tên unit..."
                                    className="text-base p-6 border-2 border-gray-200 focus:border-blue-400 rounded-lg transition-colors"
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
                              <FormMessage className="text-base" />
                            </FormItem>
                          );
                        }}
                      />
                    </motion.div>
                  </div>
                  <div className="space-y-8">
                    <motion.div
                      variants={ANIMATIONS.form}
                      initial="hidden"
                      animate="visible"
                      custom={1}
                    >
                      <FormField
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-medium">
                              Thứ tự unit
                            </FormLabel>
                            <FormControl>
                              <div className="space-y-3">
                                <Input
                                  {...field}
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
                                  disabled={isPending || isValidationLoading}
                                  placeholder={`Nhập thứ tự unit...`}
                                  className="text-base p-6 border-2 border-gray-200 focus:border-blue-400 rounded-lg transition-colors"
                                  type="number"
                                  min={1}
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
                            <FormMessage className="text-base" />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>
                </div>

                <motion.div 
                  className="flex justify-end gap-4 pt-6 border-t border-gray-100"
                  variants={ANIMATIONS.form}
                  initial="hidden"
                  animate="visible"
                  custom={3}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isPending}
                    className="px-8 py-3 text-base font-medium border-2 hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </Button>

                  <Button
                    type="submit"
                    disabled={
                      isPending ||
                      (formType === "create"
                        ? !isFormValid
                        : !form.formState.isValid)
                    }
                    className="px-8 py-3 text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isPending
                      ? `Đang ${formType === "create" ? "tạo" : "cập nhật"}...`
                      : `${formType === "create" ? "Tạo" : "Cập nhật"} unit`}
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

export default CreateUpdateUnitsModal;
