import { useQuery } from "@tanstack/react-query";
import { getAllLessonAdminDataByClassIdUnitId } from "@/actions/lessonAction";
import { LessonsFormValues } from "@/lib/validations/lessons";
import { useMemo } from "react";

// Utility function để loại bỏ dấu tiếng Việt và normalize text
const normalizeText = (text: string): string => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
};

// Interface cho kết quả validation
interface ValidationResult {
  isValid: boolean;
  errors: {
    lessonName?: string;
    order?: string;
  };
}

// Interface cho lesson data từ API
interface LessonData {
  lessonId: number;
  lessonName: string;
  order: number;
  schoolWeekID?: number;
  imageUrl: string;
  numLiked: number;
  isActive: boolean;
}

/**
 * Hook kiểm tra dữ liệu trùng lặp lessons
 * @param classId - ID của lớp học
 * @param unitId - ID của unit
 * @param currentLessonId - ID của lesson hiện tại (dùng cho update, null cho create)
 * @returns Object chứa function validateLesson và loading state
 */
export function useLessonsValidation(
  classId: number | string | null,
  unitId: number | string | null,
  currentLessonId?: number | null
) {
  // Fetch danh sách lessons hiện có trong unit
  const { data: lessonsData, isLoading } = useQuery({
    queryKey: ["lessons-validation", classId, unitId],
    queryFn: () => getAllLessonAdminDataByClassIdUnitId(
      classId?.toString() || "",
      unitId?.toString() || ""
    ),
    enabled: !!classId && !!unitId,
    staleTime: 30000, // Cache 30 giây
  });

  // Memoize danh sách lessons để tối ưu performance
  const existingLessons = useMemo(() => {
    if (!lessonsData?.data || !Array.isArray(lessonsData.data)) {
      return [];
    }
    return lessonsData.data as LessonData[];
  }, [lessonsData?.data]);

  /**
   * Kiểm tra tên lesson có trùng lặp không
   * @param lessonName - Tên lesson cần kiểm tra
   * @returns true nếu trùng lặp, false nếu không
   */
  const checkDuplicateLessonName = useMemo(() => {
    return (lessonName: string): boolean => {
      if (!lessonName.trim()) return false;
      
      const normalizedInputName = normalizeText(lessonName);
      
      return existingLessons.some(lesson => {
        // Bỏ qua lesson hiện tại khi update
        if (currentLessonId && lesson.lessonId === currentLessonId) {
          return false;
        }
        
        const normalizedExistingName = normalizeText(lesson.lessonName);
        return normalizedExistingName === normalizedInputName;
      });
    };
  }, [existingLessons, currentLessonId]);

  /**
   * Kiểm tra thứ tự lesson có trùng lặp không
   * @param order - Thứ tự lesson cần kiểm tra
   * @returns true nếu trùng lặp, false nếu không
   */
  const checkDuplicateOrder = useMemo(() => {
    return (order: number): boolean => {
      if (!order || order <= 0) return false;
      
      return existingLessons.some(lesson => {
        // Bỏ qua lesson hiện tại khi update
        if (currentLessonId && lesson.lessonId === currentLessonId) {
          return false;
        }
        
        return lesson.order === order;
      });
    };
  }, [existingLessons, currentLessonId]);

  /**
   * Validate toàn bộ form data
   * @param formData - Dữ liệu form cần validate
   * @returns ValidationResult
   */
  const validateLesson = useMemo(() => {
    return (formData: Partial<LessonsFormValues>): ValidationResult => {
      const errors: ValidationResult['errors'] = {};
      let isValid = true;

      // Kiểm tra tên lesson
      if (formData.lessonName) {
        if (checkDuplicateLessonName(formData.lessonName)) {
          errors.lessonName = "Tên bài học đã tồn tại trong unit này";
          isValid = false;
        }
      }

      // Kiểm tra thứ tự
      if (formData.order !== undefined && formData.order !== null) {
        if (checkDuplicateOrder(formData.order)) {
          errors.order = "Thứ tự bài học đã tồn tại trong unit này";
          isValid = false;
        }
      }

      return { isValid, errors };
    };
  }, [checkDuplicateLessonName, checkDuplicateOrder]);

  /**
   * Kiểm tra real-time khi user đang nhập
   * @param fieldName - Tên field cần kiểm tra
   * @param value - Giá trị cần kiểm tra
   * @returns string error message hoặc undefined
   */
  const validateField = useMemo(() => {
    return (fieldName: keyof LessonsFormValues, value: any): string | undefined => {
      switch (fieldName) {
        case 'lessonName':
          if (typeof value === 'string' && value.trim() && checkDuplicateLessonName(value)) {
            return "Tên bài học đã tồn tại trong unit này";
          }
          break;
        case 'order':
          if (typeof value === 'number' && value > 0 && checkDuplicateOrder(value)) {
            return "Thứ tự bài học đã tồn tại trong unit này";
          }
          break;
      }
      return undefined;
    };
  }, [checkDuplicateLessonName, checkDuplicateOrder]);

  /**
   * Lấy danh sách thứ tự đã sử dụng
   * @returns Array các số thứ tự đã được sử dụng
   */
  const getUsedOrders = useMemo(() => {
    return existingLessons
      .filter(lesson => currentLessonId ? lesson.lessonId !== currentLessonId : true)
      .map(lesson => lesson.order)
      .filter(order => order > 0)
      .sort((a, b) => a - b);
  }, [existingLessons, currentLessonId]);

  /**
   * Gợi ý thứ tự tiếp theo có thể sử dụng
   * @returns Số thứ tự tiếp theo
   */
  const suggestNextOrder = useMemo(() => {
    const usedOrders = getUsedOrders;
    if (usedOrders.length === 0) return 1;
    
    // Tìm số nhỏ nhất chưa được sử dụng
    for (let i = 1; i <= usedOrders.length + 1; i++) {
      if (!usedOrders.includes(i)) {
        return i;
      }
    }
    
    return usedOrders.length + 1;
  }, [getUsedOrders]);

  return {
    validateLesson,
    validateField,
    checkDuplicateLessonName,
    checkDuplicateOrder,
    getUsedOrders,
    suggestNextOrder,
    isLoading,
    existingLessons
  };
}

/**
 * Hook đơn giản chỉ để kiểm tra duplicate nhanh
 * @param classId - ID của lớp học
 * @param unitId - ID của unit
 * @param lessonName - Tên lesson cần kiểm tra
 * @param currentLessonId - ID lesson hiện tại (optional)
 * @returns boolean - true nếu trùng lặp
 */
export function useCheckDuplicateLessonName(
  classId: number | string | null,
  unitId: number | string | null,
  lessonName: string,
  currentLessonId?: number | null
) {
  const { checkDuplicateLessonName, isLoading } = useLessonsValidation(classId, unitId, currentLessonId);
  
  return {
    isDuplicate: checkDuplicateLessonName(lessonName),
    isLoading
  };
}

/**
 * Hook đơn giản chỉ để kiểm tra duplicate order nhanh
 * @param classId - ID của lớp học
 * @param unitId - ID của unit
 * @param order - Thứ tự cần kiểm tra
 * @param currentLessonId - ID lesson hiện tại (optional)
 * @returns boolean - true nếu trùng lặp
 */
export function useCheckDuplicateOrder(
  classId: number | string | null,
  unitId: number | string | null,
  order: number,
  currentLessonId?: number | null
) {
  const { checkDuplicateOrder, isLoading } = useLessonsValidation(classId, unitId, currentLessonId);
  
  return {
    isDuplicate: checkDuplicateOrder(order),
    isLoading
  };
}