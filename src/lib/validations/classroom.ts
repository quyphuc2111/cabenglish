import * as z from "zod";

export const classroomFormSchema = z.object({
  classname: z.string()
    .min(1, "Tên lớp học không được để trống")
    .max(100, "Tên lớp học không được vượt quá 100 ký tự"),
  description: z.string()
    .min(1, "Mô tả không được để trống")
    .max(1000, "Mô tả không được vượt quá 1000 ký tự"),
  imageurl: z.string()
    .min(1, "Hình ảnh không được để trống"),
  numliked: z.number().default(0),
  progress: z.number().default(0),
  order: z.number().default(0),
  class_id: z.number().default(0)
});

export type ClassroomFormValues = z.infer<typeof classroomFormSchema>; 