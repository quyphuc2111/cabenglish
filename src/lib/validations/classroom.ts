import * as z from "zod";

const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /on\w+\s*=/gi,
  /<iframe\b[^>]*>/gi,
  /<object\b[^>]*>/gi,
  /<embed\b[^>]*>/gi,
  /<style\b[^>]*>/gi,
  /data:text\/html/gi,
  /<link\b[^>]*>/gi,
  /<meta\b[^>]*>/gi,
  /expression\s*\(/gi,
  /url\s*\(/gi,
  /@import/gi
];

const validateXSS = (value: string): boolean => {
  return !XSS_PATTERNS.some(pattern => pattern.test(value));
};

const validateNotOnlyWhitespace = (value: string): boolean => {
  return value.trim().length > 0;
};

export const classroomFormSchema = z.object({
  classname: z.string()
    .trim()
    .min(2, "Tên lớp học không được để trống")
    .max(100, "Tên lớp học không được vượt quá 100 ký tự")
    .refine(validateNotOnlyWhitespace, {
      message: "Tên lớp học không được chỉ chứa khoảng trắng"
    })
    .refine(validateXSS, {
      message: "Tên lớp học chứa nội dung không an toàn"
    }),
  description: z.string()
    .trim()
    .min(2, "Mô tả không được để trống")
    .max(1000, "Mô tả không được vượt quá 1000 ký tự")
    .refine(validateNotOnlyWhitespace, {
      message: "Mô tả không được chỉ chứa khoảng trắng"
    })
    .refine(validateXSS, {
      message: "Mô tả chứa nội dung không an toàn"
    }),
  imageurl: z.string()
    .trim()
    .min(1, "Hình ảnh không được để trống")
    .refine(validateNotOnlyWhitespace, {
      message: "URL hình ảnh không được chỉ chứa khoảng trắng"
    })
    .refine(validateXSS, {
      message: "URL hình ảnh chứa nội dung không an toàn"
    }),
  numliked: z.number().default(0),
  progress: z.number().default(0),
  order: z.number().default(0),
  class_id: z.number().default(0)
});

export type ClassroomFormValues = z.infer<typeof classroomFormSchema>; 