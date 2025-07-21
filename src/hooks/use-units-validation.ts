import { useQuery } from "@tanstack/react-query";
import { getAllUnitsByClassId } from "@/app/api/actions/units";
import { UnitsFormValues } from "@/lib/validations/units";
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
    unitName?: string;
    order?: string;
  };
}

// Interface cho unit data từ API
interface UnitData {
  unitId: number;
  unitName: string;
  order: number;
  classId: number;
}

/**
 * Hook kiểm tra dữ liệu trùng lặp units
 * @param classId - ID của lớp học
 * @param currentUnitId - ID của unit hiện tại (dùng cho update, null cho create)
 * @returns Object chứa function validateUnit và loading state
 */
export function useUnitsValidation(classId: number | string | null, currentUnitId?: number | null) {
  // Fetch danh sách units hiện có trong lớp
  const { data: unitsData, isLoading } = useQuery({
    queryKey: ["units-validation", classId],
    queryFn: () => getAllUnitsByClassId(classId),
    enabled: !!classId,
    staleTime: 30000, // Cache 30 giây
  });

  // Memoize danh sách units để tối ưu performance
  const existingUnits = useMemo(() => {
    if (!unitsData?.data || !Array.isArray(unitsData.data)) {
      return [];
    }
    return unitsData.data as UnitData[];
  }, [unitsData?.data]);

  /**
   * Kiểm tra tên unit có trùng lặp không
   * @param unitName - Tên unit cần kiểm tra
   * @returns true nếu trùng lặp, false nếu không
   */
  const checkDuplicateUnitName = useMemo(() => {
    return (unitName: string): boolean => {
      if (!unitName.trim()) return false;
      
      const normalizedInputName = normalizeText(unitName);
      
      return existingUnits.some(unit => {
        // Bỏ qua unit hiện tại khi update
        if (currentUnitId && unit.unitId === currentUnitId) {
          return false;
        }
        
        const normalizedExistingName = normalizeText(unit.unitName);
        return normalizedExistingName === normalizedInputName;
      });
    };
  }, [existingUnits, currentUnitId]);

  /**
   * Kiểm tra thứ tự unit có trùng lặp không
   * @param order - Thứ tự unit cần kiểm tra
   * @returns true nếu trùng lặp, false nếu không
   */
  const checkDuplicateOrder = useMemo(() => {
    return (order: number): boolean => {
      if (!order || order <= 0) return false;
      
      return existingUnits.some(unit => {
        // Bỏ qua unit hiện tại khi update
        if (currentUnitId && unit.unitId === currentUnitId) {
          return false;
        }
        
        return unit.order === order;
      });
    };
  }, [existingUnits, currentUnitId]);

  /**
   * Validate toàn bộ form data
   * @param formData - Dữ liệu form cần validate
   * @returns ValidationResult
   */
  const validateUnit = useMemo(() => {
    return (formData: Partial<UnitsFormValues>): ValidationResult => {
      const errors: ValidationResult['errors'] = {};
      let isValid = true;

      // Kiểm tra tên unit
      if (formData.unitName) {
        if (checkDuplicateUnitName(formData.unitName)) {
          errors.unitName = "Tên unit đã tồn tại trong lớp học này";
          isValid = false;
        }
      }

      // Kiểm tra thứ tự
      if (formData.order !== undefined && formData.order !== null) {
        if (checkDuplicateOrder(formData.order)) {
          errors.order = "Thứ tự unit đã tồn tại trong lớp học này";
          isValid = false;
        }
      }

      return { isValid, errors };
    };
  }, [checkDuplicateUnitName, checkDuplicateOrder]);

  /**
   * Kiểm tra real-time khi user đang nhập
   * @param fieldName - Tên field cần kiểm tra
   * @param value - Giá trị cần kiểm tra
   * @returns string error message hoặc undefined
   */
  const validateField = useMemo(() => {
    return (fieldName: keyof UnitsFormValues, value: any): string | undefined => {
      switch (fieldName) {
        case 'unitName':
          if (typeof value === 'string' && value.trim() && checkDuplicateUnitName(value)) {
            return "Tên unit đã tồn tại trong lớp học này";
          }
          break;
        case 'order':
          if (typeof value === 'number' && value > 0 && checkDuplicateOrder(value)) {
            return "Thứ tự unit đã tồn tại trong lớp học này";
          }
          break;
      }
      return undefined;
    };
  }, [checkDuplicateUnitName, checkDuplicateOrder]);

  /**
   * Lấy danh sách thứ tự đã sử dụng
   * @returns Array các số thứ tự đã được sử dụng
   */
  const getUsedOrders = useMemo(() => {
    return existingUnits
      .filter(unit => currentUnitId ? unit.unitId !== currentUnitId : true)
      .map(unit => unit.order)
      .filter(order => order > 0)
      .sort((a, b) => a - b);
  }, [existingUnits, currentUnitId]);

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
    validateUnit,
    validateField,
    checkDuplicateUnitName,
    checkDuplicateOrder,
    getUsedOrders,
    suggestNextOrder,
    isLoading,
    existingUnits
  };
}

/**
 * Hook đơn giản chỉ để kiểm tra duplicate nhanh
 * @param classId - ID của lớp học
 * @param unitName - Tên unit cần kiểm tra
 * @param currentUnitId - ID unit hiện tại (optional)
 * @returns boolean - true nếu trùng lặp
 */
export function useCheckDuplicateUnitName(
  classId: number | string | null,
  unitName: string,
  currentUnitId?: number | null
) {
  const { checkDuplicateUnitName, isLoading } = useUnitsValidation(classId, currentUnitId);
  
  return {
    isDuplicate: checkDuplicateUnitName(unitName),
    isLoading
  };
}

/**
 * Hook đơn giản chỉ để kiểm tra duplicate order nhanh
 * @param classId - ID của lớp học
 * @param order - Thứ tự cần kiểm tra
 * @param currentUnitId - ID unit hiện tại (optional)
 * @returns boolean - true nếu trùng lặp
 */
export function useCheckDuplicateOrder(
  classId: number | string | null,
  order: number,
  currentUnitId?: number | null
) {
  const { checkDuplicateOrder, isLoading } = useUnitsValidation(classId, currentUnitId);
  
  return {
    isDuplicate: checkDuplicateOrder(order),
    isLoading
  };
}