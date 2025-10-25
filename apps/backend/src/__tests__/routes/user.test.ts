import { describe, beforeEach, afterEach, expect, mock, it } from "bun:test";
import { Database } from "bun:sqlite";

import { createTestDb } from "../../test/test-db";
import app from "../../index";
import {
  createUserBiometricsAndReturn,
  getUserBiometricsAndReturn,
  loginFlow,
  updateUserBiometricsAndReturn,
} from "../../test/test-helpers";
import type { UserBiometrics } from "@aevim/shared-types";

let db: Database;

mock.module("../../db/db.ts", () => {
  return { dbConnect: () => db };
});

beforeEach(() => {
  db = createTestDb();
});
afterEach(() => {
  db.close();
});

describe("/user/biometrics endpoint", () => {
  it("returns 401 if no auth token is provided", async () => {
    const req = new Request(
      "http://localhost:3000/api/v1/auth/user/biometrics"
    );
    const res = await app.fetch(req);
    expect(res.status).toBe(401);
  });

  describe("GET /user/biometrics", () => {
    it("returns null if no biometrics data exists", async () => {
      const { cookie } = await loginFlow();
      const { biometricsRes, biometrics } = await getUserBiometricsAndReturn(
        cookie!
      );

      expect(biometricsRes.status).toBe(200);
      expect(biometrics).toBeNull();
    });

    it("returns user biometrics if they exist", async () => {
      const { cookie } = await loginFlow();

      // First create biometrics
      const { biometrics: createdBiometrics } =
        await createUserBiometricsAndReturn(cookie!, {
          weight: 75,
          sex: "male",
          height: 180,
          build: "athletic",
        });

      expect(createdBiometrics).toEqual({
        weight: 75,
        sex: "male",
        height: 180,
        build: "athletic",
      });

      // Then get them
      const { biometricsRes, biometrics } = await getUserBiometricsAndReturn(
        cookie!
      );

      expect(biometricsRes.status).toBe(200);
      expect(biometrics).toEqual({
        weight: 75,
        sex: "male",
        height: 180,
        build: "athletic",
      });
    });
  });

  describe("POST /user/biometrics", () => {
    it("creates user biometrics", async () => {
      const { cookie } = await loginFlow();
      const { biometricsRes, biometrics } = await createUserBiometricsAndReturn(
        cookie!,
        {
          weight: 70,
          sex: "female",
          height: 165,
          build: "slim",
        }
      );

      expect(biometricsRes.status).toBe(201);
      expect(biometrics).toEqual({
        weight: 70,
        sex: "female",
        height: 165,
        build: "slim",
      });
    });

    it("returns 409 if user already has biometrics", async () => {
      const { cookie } = await loginFlow();

      // Create first biometrics
      const { biometricsRes: firstRes } = await createUserBiometricsAndReturn(
        cookie!,
        {
          weight: 80,
          sex: "male",
          height: 175,
          build: "muscular",
        }
      );
      expect(firstRes.status).toBe(201);

      // Try to create again
      const { biometricsRes: secondRes, biometrics } =
        await createUserBiometricsAndReturn(cookie!, {
          weight: 85,
          sex: "male",
          height: 175,
          build: "muscular",
        });

      expect(secondRes.status).toBe(409);
      expect(biometrics).toEqual({
        errors: ["User already has biometrics data"],
      });
    });

    it("returns 400 if parameters are invalid", async () => {
      const { cookie } = await loginFlow();

      // Test invalid weight
      const { biometricsRes: weightRes, biometrics: weightBiometrics } =
        await createUserBiometricsAndReturn(cookie!, {
          weight: 20, // Too low
          sex: "pansexual furry" as "male",
          height: 69,
          build: "like a dumptruck" as "athletic",
        });

      expect(weightRes.status).toBe(400);
      expect(weightBiometrics).toEqual({
        errors: [
          "Weight must be at least 30 kg",
          "Sex must be male, female",
          "Height must be at least 100 cm",
          "Build must be slim, average, athletic, muscular, or heavy",
        ],
      });

      // Test invalid height
      const { biometricsRes: heightRes, biometrics: heightBiometrics } =
        await createUserBiometricsAndReturn(cookie!, {
          weight: 75,
          sex: "male",
          height: 50, // Too low
          build: "athletic",
        });

      expect(heightRes.status).toBe(400);
      expect(heightBiometrics).toEqual({
        errors: ["Height must be at least 100 cm"],
      });

      // Test invalid sex
      const { biometricsRes: sexRes, biometrics: sexBiometrics } =
        await createUserBiometricsAndReturn(cookie!, {
          weight: 75,
          sex: "invalid" as UserBiometrics["sex"],
          height: 180,
          build: "athletic",
        });

      expect(sexRes.status).toBe(400);
      expect(sexBiometrics).toEqual({
        errors: ["Sex must be male, female"],
      });

      // Test invalid build
      const { biometricsRes: buildRes, biometrics: buildBiometrics } =
        await createUserBiometricsAndReturn(cookie!, {
          weight: 75,
          sex: "male",
          height: 180,
          build: "invalid" as UserBiometrics["build"],
        });

      expect(buildRes.status).toBe(400);
      expect(buildBiometrics).toEqual({
        errors: ["Build must be slim, average, athletic, muscular, or heavy"],
      });
    });
  });

  describe("PUT /user/biometrics", () => {
    it("updates user biometrics", async () => {
      const { cookie } = await loginFlow();

      // First create biometrics
      await createUserBiometricsAndReturn(cookie!, {
        weight: 75,
        sex: "male",
        height: 180,
        build: "athletic",
      });

      // Then update them
      const { biometricsRes, biometrics } = await updateUserBiometricsAndReturn(
        cookie!,
        {
          weight: 80,
          build: "muscular",
        }
      );

      expect(biometricsRes.status).toBe(200);
      expect(biometrics).toEqual({
        weight: 80,
        sex: "male",
        height: 180,
        build: "muscular",
      });
    });

    it("returns 404 if no biometrics data exists to update", async () => {
      const { cookie } = await loginFlow();

      const { biometricsRes, biometrics } = await updateUserBiometricsAndReturn(
        cookie!,
        {
          weight: 80,
        }
      );

      expect(biometricsRes.status).toBe(404);
      expect(biometrics).toEqual({
        errors: ["No biometrics data found for user"],
      });
    });

    it("returns 400 if no fields are provided for update", async () => {
      const { cookie } = await loginFlow();

      // First create biometrics
      await createUserBiometricsAndReturn(cookie!, {
        weight: 75,
        sex: "male",
        height: 180,
        build: "athletic",
      });

      // Try to update with empty object
      const { biometricsRes, biometrics } = await updateUserBiometricsAndReturn(
        cookie!,
        {}
      );

      expect(biometricsRes.status).toBe(400);
      expect(biometrics).toEqual({
        errors: ["At least one field must be provided for update"],
      });
    });

    it("returns 400 if update parameters are invalid", async () => {
      const { cookie } = await loginFlow();

      // First create biometrics
      await createUserBiometricsAndReturn(cookie!, {
        weight: 75,
        sex: "male",
        height: 180,
        build: "athletic",
      });

      // Test invalid weight
      const { biometricsRes: weightRes, biometrics: weightBiometrics } =
        await updateUserBiometricsAndReturn(cookie!, {
          weight: 350, // Too high
        });

      expect(weightRes.status).toBe(400);
      expect(weightBiometrics).toEqual({
        errors: [
          "Weight must be less than 300 kg",
          "At least one field must be provided for update",
        ],
      });
    });
  });
});
