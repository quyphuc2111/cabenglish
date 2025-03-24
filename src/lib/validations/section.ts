import { z } from "zod";

export const sectionFormSchema = z.object({
    sectionName: z.string().min(1, { message: "Tên section không được để trống" }),
    iconUrl: z.string().min(1, { message: "Icon không được để trống" }),
    estimateTime: z.string().min(1, { message: "Thời gian ước tính không được để trống" }),
    order: z.number(),
});

export type SectionFormValues = z.infer<typeof sectionFormSchema>;
