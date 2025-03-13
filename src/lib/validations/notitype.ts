import { z } from "zod";

export const notiTypeFormSchema = z.object({
  ntId: z.number(),
  value: z.string(),
});

export type NotiTypeFormValues = z.infer<typeof notiTypeFormSchema>; 