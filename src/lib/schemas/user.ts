import { z } from "zod";

export const userSchema = z.object({
  name: z.string(),
  segments: z.array(z.string()),
});

export const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  segments: z.array(z.string()).min(1, "Select at least one segment"),
});

export type User = z.infer<typeof userSchema>;