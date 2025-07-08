import { z } from "zod";

export const notiFormSchema = z.object({
  ntId: z.number(),
  title: z.string(),
  description: z.string(),
  notificationId: z.number(),
  contentHtml: z.string(),
  createdAt: z.string(),
  lastSentTime: z.string(),
});

export type NotiFormValues = z.infer<typeof notiFormSchema>; 