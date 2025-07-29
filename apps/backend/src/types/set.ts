import type z from "zod/v4";
import type { setSchema } from "../db/schemas/set-schema";

export type SetData = z.infer<typeof setSchema>;
