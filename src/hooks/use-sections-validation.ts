import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getSectionAdminDataByLessonId } from "@/actions/sectionAction";

interface ValidationResult {
  isValid: boolean;
  errors: {
    sectionName?: string;
    order?: string;
  };
}

export const useSectionsValidation = (
  lessonId: number | null,
  currentSectionId?: string | null
) => {
  const { data: sectionsData, isLoading } = useQuery({
    queryKey: ["sections", lessonId],
    queryFn: async () => {
      if (!lessonId || lessonId <= 0) {
        return { data: [] };
      }
      
      const response = await getSectionAdminDataByLessonId({ lessonId });
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    enabled: !!lessonId && lessonId > 0
  });

  const sections = sectionsData?.data || [];

  // Tìm order tiếp theo cho section mới
  const suggestNextOrder = React.useMemo(() => {
    if (!sections || sections.length === 0) return 1;
    
    const maxOrder = Math.max(...sections.map(section => section.order || 0));
    return maxOrder + 1;
  }, [sections]);

  // Kiểm tra trùng lặp tên section
  const validateSectionName = React.useCallback((sectionName: string): string | null => {
    if (!sectionName?.trim()) {
      return "Tên section không được để trống";
    }

    if (sectionName.length > 100) {
      return "Tên section không được vượt quá 100 ký tự";
    }

    const trimmedName = sectionName.trim().toLowerCase();
    const existingSection = sections.find(section => {
      // Bỏ qua section hiện tại khi update
      if (currentSectionId && section.sectionId?.toString() === currentSectionId) {
        return false;
      }
      return section.sectionName?.toLowerCase() === trimmedName;
    });

    if (existingSection) {
      return "Tên section đã tồn tại, vui lòng chọn tên khác";
    }

    return null;
  }, [sections, currentSectionId]);

  // Kiểm tra trùng lặp order
  const validateOrder = React.useCallback((order: number): string | null => {
    if (!order || order <= 0) {
      return "Thứ tự phải lớn hơn 0";
    }

    if (!Number.isInteger(order)) {
      return "Thứ tự phải là số nguyên";
    }

    const existingSection = sections.find(section => {
      // Bỏ qua section hiện tại khi update
      if (currentSectionId && section.sectionId?.toString() === currentSectionId) {
        return false;
      }
      return section.order === order;
    });

    if (existingSection) {
      return "Thứ tự này đã tồn tại, vui lòng chọn thứ tự khác";
    }

    return null;
  }, [sections, currentSectionId]);

  // Kiểm tra toàn bộ form
  const validateSection = React.useCallback((values: {
    sectionName: string;
    order: number;
  }): ValidationResult => {
    const errors: ValidationResult["errors"] = {};

    const sectionNameError = validateSectionName(values.sectionName);
    if (sectionNameError) {
      errors.sectionName = sectionNameError;
    }

    const orderError = validateOrder(values.order);
    if (orderError) {
      errors.order = orderError;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, [validateSectionName, validateOrder]);

  return {
    validateField: (fieldName: "sectionName" | "order", value: any) => {
      if (fieldName === "sectionName") {
        return validateSectionName(value);
      }
      if (fieldName === "order") {
        return validateOrder(value);
      }
      return null;
    },
    validateSection,
    suggestNextOrder,
    isLoading
  };
};
