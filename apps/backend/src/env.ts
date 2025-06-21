import * as z from "zod/v4";

const EnvSchema = z.object({
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3000),
  FOREIGN_KEY_CHECKS: z.enum(["ON", "OFF"]),
  BASE_URL: z.url().default("http://localhost:3000"),
  API_BASE_URL: z.url().default("http://localhost:3000/api/v1"),
});

export type Env = z.infer<typeof EnvSchema>;

let env: Env;
try {
  env = EnvSchema.parse(process.env);
} catch (error) {
  const zodError = error as z.ZodError 
  console.error("THE SHRIMP OF INVALID .ENV FILE VARIABLES HAS VISITED YOU✨🦐✨")
  console.error(z.prettifyError(zodError))
  process.exit(1);
}

export default env;
