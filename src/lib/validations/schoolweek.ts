import { z } from "zod";

export const schoolWeekFormSchema = z.object({
  swId: z.number(),
  value: z.number(),
});

export type SchoolWeekFormValues = z.infer<typeof schoolWeekFormSchema>; 