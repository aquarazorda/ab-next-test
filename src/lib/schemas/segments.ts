import { z } from "zod";

export const segmentSchema = z.object({
  name: z.string().min(1, "Segment name is required"),
  routes: z.array(z.string()),
});

export type Segment = z.infer<typeof segmentSchema>;
