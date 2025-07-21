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

      console.log("unit tao moi", values);

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
                    {formType === "create" ? "Thêm mới unit" : "Cập nhật unit"}
                  </p>
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
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-medium">
                              Nhập tên unit
                            </FormLabel>
                            <FormControl>
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
                                }}
                                disabled={isPending || isValidationLoading}
                                placeholder="Nhập tên unit..."
                                className="text-base p-6"
                              />
                            </FormControl>
                            <FormMessage className="text-base" />
                          </FormItem>
                        )}
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
                              Nhập thứ tự unit
                            </FormLabel>
                            <FormControl>
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
                                placeholder={`Nhập thứ tự unit... (Gợi ý: ${suggestNextOrder})`}
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
                    disabled={
                      isPending ||
                      (formType === "create"
                        ? !isFormValid
                        : !form.formState.isValid)
                    }
                    className="bg-blue-500"
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
