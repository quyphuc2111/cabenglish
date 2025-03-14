import { z } from "zod";

export const lessonsFormSchema = z.object({
    schoolweek: z.number(),
    lessonId: z.number(),
    lessonName: z.string().min(1, { message: "Tên bài học không được để trống" }),
    imageUrl: z.string().min(1, { message: "Hình ảnh không được để trống" }),
    numLiked: z.number(),
    order: z.number(),
    isActive: z.boolean(),
});

export type LessonsFormValues = z.infer<typeof lessonsFormSchema>;
