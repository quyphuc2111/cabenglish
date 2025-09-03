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

export const importClassroomSchema = z.object({
  classname: z.string({
    required_error: "Tên lớp học không được để trống",
    invalid_type_error: "Tên lớp học phải là văn bản",
  })
    .trim()
    .min(1, "Tên lớp học không được để trống")
    .max(100, "Tên lớp học không được vượt quá 100 ký tự")
    .refine(validateNotOnlyWhitespace, {
      message: "Tên lớp học không được chỉ chứa khoảng trắng"
    })
    .refine(validateXSS, {
      message: "Tên lớp học chứa nội dung không an toàn"
    }),
  description: z.string({
    required_error: "Mô tả không được để trống",
    invalid_type_error: "Mô tả phải là văn bản",
  })
    .trim()
    .min(1, "Mô tả không được để trống")
    .max(1000, "Mô tả không được vượt quá 1000 ký tự")
    .refine(validateNotOnlyWhitespace, {
      message: "Mô tả không được chỉ chứa khoảng trắng"
    })
    .refine(validateXSS, {
      message: "Mô tả chứa nội dung không an toàn"
    }),
  imageurl: z.string({
    required_error: "Link ảnh không được để trống",
    invalid_type_error: "Link ảnh phải là văn bản",
  })
    .trim()
    .min(1, "Link ảnh không được để trống")
    .refine(url => {
      try {
        const parsedUrl = new URL(url);
        // Ensure the hostname has at least one dot, which is typical for FQDNs
        return parsedUrl.hostname.includes('.');
      } catch (e) {
        return false;
      }
    }, { message: "Link ảnh không hợp lệ" })
    .refine((url) => /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(url),
      {
        message: "Link phải là một đường dẫn hình ảnh hợp lệ (e.g., .jpg, .png)",
      }
    ),
  order: z.number({
    required_error: "Thứ tự không được để trống",
    invalid_type_error: "Thứ tự phải là một số",
  }).int("Thứ tự phải là số nguyên").positive("Thứ tự phải là số dương"),
});

export type ImportClassroomValues = z.infer<typeof importClassroomSchema>;

