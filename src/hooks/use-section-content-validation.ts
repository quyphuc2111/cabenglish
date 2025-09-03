import React from "react";
import { useGetSectionContentBySectionId } from "@/hooks/useSectionContent";

interface SectionContentValidationResult {
  isValid: boolean;
  errors: {
    title?: string;
    order?: string;
  };
}

export function useSectionContentValidation(sectionId: number | null, currentSectionContentId: string | null = null) {
  const { data: sectionContentData, isLoading } = useGetSectionContentBySectionId(sectionId || 0);

  // Gợi ý thứ tự tiếp theo
  const suggestNextOrder = React.useMemo(() => {
    if (!sectionContentData || !Array.isArray(sectionContentData)) {
      return 1;
    }
    
    const orders = sectionContentData
      .map((item: any) => item.order || 0)
      .filter((order: number) => order > 0);
    
    if (orders.length === 0) return 1;
    
    return Math.max(...orders) + 1;
  }, [sectionContentData]);

  // Validation cho title
  const validateTitle = React.useCallback((title: string): string | null => {
    if (!title || !title.trim()) {
      return "Tiêu đề không được để trống";
    }

    if (title.trim().length > 100) {
      return "Tiêu đề không được vượt quá 100 ký tự";
    }

    // Kiểm tra trùng lặp (case-insensitive, loại trừ section content hiện tại nếu đang update)
    if (sectionContentData && Array.isArray(sectionContentData)) {
      const isDuplicate = sectionContentData.some((item: any) => {
        // Nếu đang update, bỏ qua section content hiện tại
        if (currentSectionContentId && item.sc_id?.toString() === currentSectionContentId) {
          return false;
        }
        return item.title?.toLowerCase().trim() === title.toLowerCase().trim();
      });

      if (isDuplicate) {
        return "Tiêu đề đã tồn tại";
      }
    }

    return null;
  }, [sectionContentData, currentSectionContentId]);

  // Validation cho order
  const validateOrder = React.useCallback((order: number): string | null => {
    if (!order || order <= 0) {
      return "Thứ tự phải lớn hơn 0";
    }

    if (!Number.isInteger(order)) {
      return "Thứ tự phải là số nguyên";
    }

    // Kiểm tra trùng lặp (loại trừ section content hiện tại nếu đang update)
    if (sectionContentData && Array.isArray(sectionContentData)) {
      const isDuplicate = sectionContentData.some((item: any) => {
        // Nếu đang update, bỏ qua section content hiện tại
        if (currentSectionContentId && item.sc_id?.toString() === currentSectionContentId) {
          return false;
        }
        return item.order === order;
      });

      if (isDuplicate) {
        return "Thứ tự đã tồn tại";
      }
    }

    return null;
  }, [sectionContentData, currentSectionContentId]);

  // Validation toàn bộ section content
  const validateSectionContent = React.useCallback((data: { title: string; order: number }): SectionContentValidationResult => {
    const titleError = validateTitle(data.title);
    const orderError = validateOrder(data.order);

    return {
      isValid: !titleError && !orderError,
      errors: {
        title: titleError || undefined,
        order: orderError || undefined
      }
    };
  }, [validateTitle, validateOrder]);

  // Validation cho từng field
  const validateField = React.useCallback((fieldName: string, value: any): string | null => {
    switch (fieldName) {
      case "title":
        return validateTitle(value);
      case "order":
        return validateOrder(value);
      default:
        return null;
    }
  }, [validateTitle, validateOrder]);

  return {
    validateField,
    validateSectionContent,
    suggestNextOrder,
    isLoading
  };
}
