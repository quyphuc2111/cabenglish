import { z } from "zod";

// Regex để kiểm tra ký tự hợp lệ (chỉ cho phép chữ cái, số, khoảng trắng và một số ký tự đặc biệt)
const validNameRegex = /^[a-zA-ZÀ-ỹ0-9\s\-_.,()]+$/;

export const unitsFormSchema = z.object({
  unitId: z.number(),
  unitName: z
    .string()
    .min(1, { message: "Tên unit không được để trống" })
    .max(100, { message: "Tên unit không được vượt quá 100 ký tự" })
    .trim()
    .refine(
      (val) => val.length > 0,
      { message: "Tên unit không được chỉ chứa khoảng trắng" }
    )
    .refine(
      (val) => validNameRegex.test(val),
      { message: "Tên unit chứa ký tự không hợp lệ. Chỉ cho phép chữ cái, số, khoảng trắng và các ký tự: - _ . , ( )" }
    )
    .refine(
      (val) => !/\s{2,}/.test(val),
      { message: "Tên unit không được chứa nhiều khoảng trắng liên tiếp" }
    )
    .refine(
      (val) => !val.startsWith(' ') && !val.endsWith(' '),
      { message: "Tên unit không được bắt đầu hoặc kết thúc bằng khoảng trắng" }
    ),
  order: z
    .number()
    .int({ message: "Thứ tự phải là số nguyên" })
    .min(1, { message: "Thứ tự unit phải lớn hơn 0" }),
    // .max(999, { message: "Thứ tự unit không được vượt quá 999" }),
  progress: z
    .number()
    .min(0, { message: "Tiến độ phải từ 0 đến 1" })
    .max(1, { message: "Tiến độ không được vượt quá 1 (100%)" })
    .refine(
      (val) => Number.isFinite(val),
      { message: "Tiến độ phải là số hợp lệ" }
    )
});

export type UnitsFormValues = z.infer<typeof unitsFormSchema>;
