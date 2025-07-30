import { z } from "zod";

export const lessonsFormSchema = z.object({
    schoolweek: z.number().min(1, { message: "Vui lòng chọn tuần học" }).optional(),
    schoolWeekID: z.number().optional(),
    lessonId: z.number(),
    lessonName: z.string()
        .min(1, { message: "Tên bài học không được để trống" })
        .max(100, { message: "Tên bài học không được vượt quá 100 ký tự" })
        .refine((val) => val.trim().length > 0, {
            message: "Tên bài học không được chỉ chứa khoảng trắng"
        }),
    imageUrl: z.string().min(1, { message: "Hình ảnh không được để trống" }),
    numLiked: z.number().min(0, { message: "Số lượt thích phải lớn hơn hoặc bằng 0" }),
    order: z.number().min(1, { message: "Thứ tự phải lớn hơn 0" }),
    isActive: z.boolean(),
});

export type LessonsFormValues = z.infer<typeof lessonsFormSchema>;
