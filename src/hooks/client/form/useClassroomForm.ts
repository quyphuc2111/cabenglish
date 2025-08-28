import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassroomFormValues, classroomFormSchema } from "@/lib/validations/classroom";
import { useCreateClassroom, useUpdateClassroom } from "@/hooks/use-classrooms";
import { useClassroomsValidation } from "@/hooks/use-classrooms-validation";
import { showToast } from "@/utils/toast-config";

const defaultValues: ClassroomFormValues = {
  classname: "",
  description: "",
  imageurl: "",
  numliked: 0,
  progress: 0,
  order: 0,
  class_id: 0
};

export const useClassroomForm = (formType: "create" | "update", classroomId?: string) => {
  const form = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomFormSchema),
    defaultValues
  });

  const { mutate: createClassroom, isPending: isCreating } = useCreateClassroom();
  const { mutate: updateClassroom, isPending: isUpdating } = useUpdateClassroom();
  
  // Hook validation để kiểm tra trùng lặp
  const { validateClassroom, isLoading: isValidationLoading } = useClassroomsValidation(
    formType === "update" ? classroomId : null
  );

  const handleSubmit = async (values: ClassroomFormValues) => {
    try {
      // Validation dữ liệu trước khi submit
      const validationResult = classroomFormSchema.safeParse(values);
      if (!validationResult.success) {
        const errors = validationResult.error.errors;
        errors.forEach((error) => {
          const fieldName = error.path[0] as keyof ClassroomFormValues;
          form.setError(fieldName, {
            type: "manual",
            message: error.message
          });
        });
        showToast.error("Vui lòng kiểm tra lại thông tin!");
        return false;
      }

      // Kiểm tra validation trùng lặp trước khi submit
      const customValidationResult = validateClassroom(values);
      if (!customValidationResult.isValid) {
        if (customValidationResult.errors.classname) {
          form.setError("classname", {
            type: "manual",
            message: customValidationResult.errors.classname
          });
        }
        showToast.error("Vui lòng kiểm tra lại thông tin!");
        return false;
      }

      if (formType === "create") {
        return new Promise((resolve) => {
          createClassroom(values, {
            onSuccess: () => {
              showToast.success("Tạo lớp học thành công!");
              resolve(true);
            },
            onError: (error) => {
              console.error("Create error:", error);
              showToast.error("Đã có lỗi xảy ra khi tạo lớp học!");
              resolve(false);
            }
          });
        });
      } else if (classroomId) {
        const updateData = {
          classId: classroomId,
          data: values
        };

        return new Promise((resolve) => {
          updateClassroom(updateData, {
            onSuccess: () => {
              showToast.success("Cập nhật lớp học thành công!");
              resolve(true);
            },
            onError: (error) => {
              console.error("Update error:", error);
              showToast.error(
                error instanceof Error 
                  ? `Lỗi: ${error.message}`
                  : "Đã có lỗi xảy ra khi cập nhật lớp học!"
              );
              resolve(false);
            }
          });
        });
      }
      return false;
    } catch (error) {
      console.error("Submit error:", error);
      showToast.error("Đã có lỗi xảy ra!");
      return false;
    }
  };

  return {
    form,
    handleSubmit,
    isPending: isCreating || isUpdating || isValidationLoading,
    validateClassroom,
    isValidationLoading
  };
};