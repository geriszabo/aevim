import type z from "zod";
import type { setSchema } from "../db/schemas/set-schema";

export type SetData = z.infer<typeof setSchema>;
