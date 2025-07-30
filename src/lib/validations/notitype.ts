import { z } from "zod";

const XSS_PATTERN = /<[^>]*>|javascript:|data:|vbscript:|on\w+\s*=|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}/i;

const UNSAFE_CHARS = /[<>"'&\\]/;

export const notiTypeFormSchema = z.object({
  ntId: z.number(),
  value: z
    .string()
    .min(1, "Tên loại thông báo không được để trống")
    .max(100, "Tên loại thông báo không được vượt quá 100 ký tự")
    .trim() 
    .refine(
      (val) => val.length > 0,
      "Tên loại thông báo không được chỉ chứa khoảng trắng"
    )
    .refine(
      (val) => !XSS_PATTERN.test(val),
      "Tên loại thông báo chứa ký tự không an toàn (HTML/JavaScript)"
    )
    .refine(
      (val) => !UNSAFE_CHARS.test(val),
      "Tên loại thông báo không được chứa các ký tự đặc biệt: < > \" ' & \\"
    )
    .refine(
      (val) => !/^\s+$/.test(val),
      "Tên loại thông báo không được chỉ chứa khoảng trắng"
    )
    .refine(
      (val) => !/\s{2,}/.test(val),
      "Tên loại thông báo không được chứa nhiều khoảng trắng liên tiếp"
    ),
});

export type NotiTypeFormValues = z.infer<typeof notiTypeFormSchema>;