import * as z from "zod/v4";

const EnvSchema = z.object({
  BASE_URL: z.url().default("http://localhost:3000"),
  API_BASE_URL: z.url().default("http://localhost:3000/api/v1"),
});

export type Env = z.infer<typeof EnvSchema>;

const env: Env = EnvSchema.parse(process.env);

export default env;
