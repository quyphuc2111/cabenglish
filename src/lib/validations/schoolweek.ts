import { z } from "zod";

export const schoolWeekFormSchema = z.object({
  swId: z.number(),
  value: z.number().min(1, "Tuần học phải lớn hơn 0").max(52, "Tuần học không được vượt quá 52"),
});

export type SchoolWeekFormValues = z.infer<typeof schoolWeekFormSchema>;