import { z } from "zod";

const EnvSchema = z.object({
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3000),
  FOREIGN_KEY_CHECKS: z.enum(["ON", "OFF"]),
  BASE_URL: z.string().url().default("http://localhost:3000"),
  API_BASE_URL: z.string().url().default("http://localhost:3000/api/v1"),
});

const env = EnvSchema.parse(process.env);

export default env;
