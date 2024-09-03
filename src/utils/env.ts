import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
});

const clientSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
});

const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
} satisfies Partial<z.infer<typeof serverSchema & typeof clientSchema>>;

const merged = serverSchema.merge(clientSchema);

/** @type {Record<keyof z.infer<typeof merged>, string | undefined>} */
export const env = process.env.NODE_ENV === "production"
  ? merged.parse(processEnv)
  : merged.safeParse(processEnv).success
    ? merged.parse(processEnv)
    : (() => {
      console.error(
        "❌ Invalid environment variables:",
        JSON.stringify(merged.safeParse(processEnv).error?.format() ?? {}, null, 4)
      );
      throw new Error("Invalid environment variables");
    })();

export const clientEnv = clientSchema.parse(processEnv);
