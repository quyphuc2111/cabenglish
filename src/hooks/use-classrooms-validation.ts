import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllClassroomAdminData } from "@/actions/classroomAction";
import { ClassroomFormValues } from "@/lib/validations/classroom";
import { ClassroomType } from "@/types/classroom";

// Utility function để normalize text cho việc so sánh
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
};

// Interface cho kết quả validation
interface ValidationResult {
  isValid: boolean;
  errors: {
    classname?: string;
  };
}

/**
 * Hook kiểm tra dữ liệu trùng lặp classrooms
 * @param currentClassroomId - ID của classroom hiện tại (dùng cho update, null cho create)
 * @returns Object chứa function validateClassroom và loading state
 */
export function useClassroomsValidation(currentClassroomId?: string | null) {
  // Fetch danh sách classrooms hiện có
  const { data: classroomsData, isLoading } = useQuery({
    queryKey: ["classrooms-validation"],
    queryFn: () => getAllClassroomAdminData(),
    staleTime: 30000, // Cache 30 giây
  });

  // Memoize danh sách classrooms để tối ưu performance
  const existingClassrooms = useMemo(() => {
    if (!classroomsData?.data || !Array.isArray(classroomsData.data)) {
      return [];
    }
    return classroomsData.data as ClassroomType[];
  }, [classroomsData?.data]);

  /**
   * Kiểm tra tên classroom có trùng lặp không
   * @param classname - Tên classroom cần kiểm tra
   * @returns true nếu trùng lặp, false nếu không
   */
  const checkDuplicateClassname = useMemo(() => {
    return (classname: string): boolean => {
      if (!classname.trim()) return false;
      
      const normalizedInputName = normalizeText(classname);
      
      return existingClassrooms.some(classroom => {
        // Bỏ qua classroom hiện tại khi update
        if (currentClassroomId && classroom.class_id === Number(currentClassroomId)) {
          return false;
        }
        
        const normalizedExistingName = normalizeText(classroom.classname);
        return normalizedExistingName === normalizedInputName;
      });
    };
  }, [existingClassrooms, currentClassroomId]);

  /**
   * Validate toàn bộ form data
   * @param formData - Dữ liệu form cần validate
   * @returns ValidationResult
   */
  const validateClassroom = useMemo(() => {
    return (formData: Partial<ClassroomFormValues>): ValidationResult => {
      const errors: ValidationResult['errors'] = {};
      let isValid = true;

      // Kiểm tra tên classroom
      if (formData.classname) {
        if (checkDuplicateClassname(formData.classname)) {
          errors.classname = "Tên lớp học đã tồn tại";
          isValid = false;
        }
      }

      return { isValid, errors };
    };
  }, [checkDuplicateClassname]);

  /**
   * Kiểm tra real-time khi user đang nhập
   * @param fieldName - Tên field cần kiểm tra
   * @param value - Giá trị cần kiểm tra
   * @returns string error message hoặc undefined
   */
  const validateField = useMemo(() => {
    return (fieldName: keyof ClassroomFormValues, value: any): string | undefined => {
      switch (fieldName) {
        case 'classname':
          if (typeof value === 'string' && value.trim() && checkDuplicateClassname(value)) {
            return "Tên lớp học đã tồn tại";
          }
          break;
      }
      return undefined;
    };
  }, [checkDuplicateClassname]);

  return {
    validateClassroom,
    validateField,
    checkDuplicateClassname,
    isLoading,
    existingClassrooms
  };
}

/**
 * Hook đơn giản chỉ để kiểm tra duplicate nhanh
 * @param currentClassroomId - ID classroom hiện tại (optional)
 * @returns object chứa function checkDuplicateClassname và loading state
 */
export function useCheckDuplicateClassname(
  currentClassroomId?: string | null
) {
  const { checkDuplicateClassname, isLoading } = useClassroomsValidation(currentClassroomId);
  
  return {
    checkDuplicateClassname,
    isLoading
  };
}