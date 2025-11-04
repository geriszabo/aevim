import { z } from "zod";

export const userBiometricsSchema = z.object({
  weight: z
    .number()
    .min(30, "Weight must be at least 30 kg")
    .max(300, "Weight must be less than 300 kg"),
  sex: z.enum(["male", "female"], { message: "Sex must be male, female" }),
  height: z
    .number()
    .min(100, "Height must be at least 100 cm")
    .max(250, "Height must be less than 250 cm"),
  build: z.enum(["slim", "average", "athletic", "muscular", "heavy"], {
    message: "Build must be slim, average, athletic, muscular, or heavy",
  }),
});

export const userBiometricsUpdateSchema = z
  .object({
    weight: z
      .number()
      .min(30, "Weight must be at least 30 kg")
      .max(300, "Weight must be less than 300 kg")
      .optional(),
    sex: z
      .enum(["male", "female"], { message: "Sex must be male, female" })
      .optional(),
    height: z
      .number()
      .min(100, "Height must be at least 100 cm")
      .max(250, "Height must be less than 250 cm")
      .optional(),
    build: z
      .enum(["slim", "average", "athletic", "muscular", "heavy"], {
        message: "Build must be slim, average, athletic, muscular, or heavy",
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export type UserBiometrics = z.infer<typeof userBiometricsSchema>;
export type UserBiometricsUpdate = z.infer<typeof userBiometricsUpdateSchema>;
