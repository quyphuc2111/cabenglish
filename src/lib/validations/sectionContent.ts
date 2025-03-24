import { z } from "zod";

export const sectionContentFormSchema = z.object({
    title: z.string().min(1, { message: "Tiêu đề không được để trống" }),
    iframe_url: z.string().min(1, { message: "Iframe url không được để trống" }),
    icon_url: z.string().min(1, { message: "Icon không được để trống" }),
    description: z.string().min(1, { message: "Mô tả không được để trống" }),
    order: z.number(),
});

export type SectionContentFormValues = z.infer<typeof sectionContentFormSchema>;
