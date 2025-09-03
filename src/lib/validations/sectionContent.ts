import { z } from "zod";

export const sectionContentFormSchema = z.object({
    title: z.string()
        .min(1, { message: "Tiêu đề không được để trống" })
        .max(100, { message: "Tiêu đề không được vượt quá 100 ký tự" }),
    iframe_url: z.string()
        .min(1, { message: "Iframe url không được để trống" })
        .url({ message: "Iframe url phải là một URL hợp lệ" }),
    icon_url: z.string()
        .min(1, { message: "Icon không được để trống" })
        .url({ message: "Icon url phải là một URL hợp lệ" }),
    description: z.string().min(1, { message: "Mô tả không được để trống" }).max(1000, { message: "Mô tả không được vượt quá 1000 ký tự" }),
    order: z.number().min(1, { message: "Thứ tự phải lớn hơn 0" }),
});

export type SectionContentFormValues = z.infer<typeof sectionContentFormSchema>;
