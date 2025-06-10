import { z } from "zod";

const EnvSchema = z.object({
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3000),
  FOREIGN_KEY_CHECKS: z.enum(["ON", "OFF"]),
});

const env = EnvSchema.parse(process.env);

export default env;
