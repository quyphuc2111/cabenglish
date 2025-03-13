import { z } from "zod";

export const classroomFormSchema = z.object({
  classname: z.string().min(1, "Tên lớp học không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  imageUrl: z.string().min(1, "Hình ảnh không được để trống"),
  numliked: z.number().optional(),
  progress: z.number().optional(),
  order: z.number().optional(),
  class_id: z.number().optional()
});

export type ClassroomFormValues = z.infer<typeof classroomFormSchema>; 