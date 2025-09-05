import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { createTestDb, createTestUser } from "../../test/test-db";
import {
  getUserBiometrics,
  createUserBiometrics,
  updateUserBiometrics,
} from "../../db/queries/user-queries";
import type { UserBiometrics } from "@aevim/shared-types/schemas/user-schema";

let db: Database;
let userId: string;

const biometricsData: UserBiometrics = {
  weight: 75,
  sex: "male",
  height: 180,
  build: "athletic",
};

beforeEach(() => {
  db = createTestDb();
  userId = createTestUser(db);
});

afterEach(() => {
  db.close();
});

describe("getUserBiometrics", () => {
  it("returns user biometrics if they exist", () => {
    createUserBiometrics(db, userId, biometricsData);
    
    const biometrics = getUserBiometrics(db, userId);
    expect(biometrics).toEqual({
      weight: 75,
      sex: "male",
      height: 180,
      build: "athletic",
    });
  });

  it("returns null if no biometrics exist", () => {
    const biometrics = getUserBiometrics(db, userId);
    expect(biometrics).toBeNull();
  });

  it("returns null for non-existent user", () => {
    const biometrics = getUserBiometrics(db, "non-existent-user-id");
    expect(biometrics).toBeNull();
  });
});

describe("createUserBiometrics", () => {
  it("creates user biometrics successfully", () => {
    const biometrics = createUserBiometrics(db, userId, biometricsData);
    
    expect(biometrics).toEqual({
      weight: 75,
      sex: "male",
      height: 180,
      build: "athletic",
    });
  });

  it("creates biometrics with different values", () => {
    const differentBiometrics: UserBiometrics = {
      weight: 65,
      sex: "female",
      height: 165,
      build: "slim",
    };
    
    const biometrics = createUserBiometrics(db, userId, differentBiometrics);
    
    expect(biometrics).toEqual({
      weight: 65,
      sex: "female",
      height: 165,
      build: "slim",
    });
  });

  it("throws error if user already has biometrics", () => {
    createUserBiometrics(db, userId, biometricsData);
    
    // Try to create again
    expect(() => {
      createUserBiometrics(db, userId, biometricsData);
    }).toThrow(/UNIQUE constraint failed/);
  });

  it("throws error if user_id doesn't exist", () => {
    expect(() => {
      createUserBiometrics(db, "non-existent-user-id", biometricsData);
    }).toThrow(/FOREIGN KEY constraint failed/);
  });
});

describe("updateUserBiometrics", () => {
  it("updates user biometrics successfully", () => {
    createUserBiometrics(db, userId, biometricsData);
    
    // Update them
    const updatedBiometrics = updateUserBiometrics(db, userId, {
      weight: 80,
      build: "muscular",
    });
    
    expect(updatedBiometrics).toEqual({
      weight: 80,
      sex: "male",
      height: 180,
      build: "muscular",
    });
  });

  it("updates only provided fields", () => {
    createUserBiometrics(db, userId, biometricsData);
    
    // Update only weight
    const updatedBiometrics = updateUserBiometrics(db, userId, {
      weight: 85,
    });
    
    expect(updatedBiometrics).toEqual({
      weight: 85,
      sex: "male",
      height: 180,
      build: "athletic",
    });
  });

  it("updates all fields", () => {
    createUserBiometrics(db, userId, biometricsData);
   
    const newBiometrics: UserBiometrics = {
      weight: 70,
      sex: "female",
      height: 170,
      build: "average",
    };
    
    const updatedBiometrics = updateUserBiometrics(db, userId, newBiometrics);
    
    expect(updatedBiometrics).toEqual(newBiometrics);
  });

  it("throws error if user has no biometrics to update", () => {
    expect(() => {
      updateUserBiometrics(db, userId, { weight: 80 });
    }).toThrow("USER_BIOMETRICS_NOT_FOUND");
  });

  it("throws error if user doesn't exist", () => {
    expect(() => {
      updateUserBiometrics(db, "non-existent-user-id", { weight: 80 });
    }).toThrow("USER_BIOMETRICS_NOT_FOUND");
  });

  it("handles empty update object", () => {
    createUserBiometrics(db, userId, biometricsData);
    
    const updatedBiometrics = updateUserBiometrics(db, userId, {});
    
    expect(updatedBiometrics).toEqual(biometricsData);
  });
});
