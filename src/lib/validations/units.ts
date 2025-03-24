import { z } from "zod";

export const unitsFormSchema = z.object({
  unitId: z.number(),
  unitName: z.string().min(1, { message: "Tên unit không được để trống" }),
  order: z.number().min(1, { message: "Thứ tự unit không được để trống" }),
  progress: z
    .number()
    .min(0, { message: "Tiến độ không được để trống" })
    .max(1, { message: "Tiến độ không được vượt quá 100" })
});

export type UnitsFormValues = z.infer<typeof unitsFormSchema>;
